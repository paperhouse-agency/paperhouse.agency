import { create } from 'zustand'
import type { BlockData, CmsPage, CmsPageSeo } from './types'

const MAX_HISTORY = 50

interface EditorState {
  page: CmsPage | null
  isSaving: boolean
  lastSaved: Date | null
  saveError: string | null
  history: CmsPage[]
  historyIndex: number
}

interface EditorActions {
  setPage: (page: CmsPage) => void
  setTitle: (title: string) => void
  setSlug: (slug: string) => void
  updateSeo: (seo: Partial<CmsPageSeo>) => void
  addBlock: (block: BlockData) => void
  removeBlock: (id: string) => void
  updateBlock: (id: string, data: Partial<BlockData>) => void
  reorderBlocks: (blocks: BlockData[]) => void
  toggleStatus: () => Promise<void>
  duplicateBlock: (id: string) => void
  undo: () => void
  redo: () => void
  save: () => Promise<void>
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

function scheduleSave(get: () => EditorState & EditorActions) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    get().save()
  }, 500)
}

function pushHistory(state: EditorState, currentPage: CmsPage): Pick<EditorState, 'history' | 'historyIndex'> {
  // Truncate forward history on new change
  const newHistory = [...state.history.slice(0, state.historyIndex + 1), currentPage].slice(-MAX_HISTORY)
  return { history: newHistory, historyIndex: newHistory.length - 1 }
}

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  page: null,
  isSaving: false,
  lastSaved: null,
  saveError: null,
  history: [],
  historyIndex: -1,

  setPage: (page) => set({ page, history: [], historyIndex: -1 }),

  setTitle: (title) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, title }, ...hist })
    scheduleSave(get)
  },

  setSlug: (slug) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, slug }, ...hist })
    scheduleSave(get)
  },

  updateSeo: (seo) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, seo: { ...page.seo, ...seo } }, ...hist })
    scheduleSave(get)
  },

  addBlock: (block) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, blocks: [...page.blocks, block] }, ...hist })
    scheduleSave(get)
  },

  removeBlock: (id) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, blocks: page.blocks.filter((b) => b._id !== id) }, ...hist })
    scheduleSave(get)
  },

  updateBlock: (id, data) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({
      page: {
        ...page,
        blocks: page.blocks.map((b) => (b._id === id ? ({ ...b, ...data } as BlockData) : b)),
      },
      ...hist,
    })
    scheduleSave(get)
  },

  reorderBlocks: (blocks) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, blocks }, ...hist })
    scheduleSave(get)
  },

  toggleStatus: async () => {
    const { page } = get()
    if (!page) return
    const newStatus: 'draft' | 'published' = page.status === 'draft' ? 'published' : 'draft'
    const updated: CmsPage = { ...page, status: newStatus }
    set({ page: updated, isSaving: true })
    if (saveTimer) clearTimeout(saveTimer)
    await fetch(`/api/admin/pages/${page.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
      body: JSON.stringify(updated),
    })
    set({ isSaving: false, lastSaved: new Date() })
  },

  duplicateBlock: (id) => {
    const { page } = get()
    if (!page) return
    const idx = page.blocks.findIndex((b) => b._id === id)
    if (idx === -1) return
    const original = page.blocks[idx]
    const cloned = JSON.parse(JSON.stringify(original)) as BlockData
    const clone: BlockData = { ...cloned, _id: crypto.randomUUID() }
    const hist = pushHistory(get(), page)
    const newBlocks = [...page.blocks]
    newBlocks.splice(idx + 1, 0, clone)
    set({ page: { ...page, blocks: newBlocks }, ...hist })
    scheduleSave(get)
  },

  undo: () => {
    const { history, historyIndex, page } = get()
    if (historyIndex < 0 || history.length === 0) return
    const target = history[historyIndex]
    // Save current page one step forward in "redo" by adjusting index only
    // We push current page as "future" when going back by reducing the index
    const newIndex = historyIndex - 1
    // Restore to the snapshot at historyIndex, shift index back
    // But we need to keep the current page accessible for redo
    // Strategy: keep history unchanged, just walk the index
    // We need to store "current" as part of history too — insert current at historyIndex+1 if not already
    const newHistory = [...history]
    if (page && (newHistory.length <= historyIndex + 1)) {
      // insert current page so redo works
      newHistory.splice(historyIndex + 1, 0, page)
    }
    set({ page: target, history: newHistory, historyIndex: newIndex })
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => get().save(), 500)
  },

  redo: () => {
    const { history, historyIndex } = get()
    const nextIndex = historyIndex + 1
    if (nextIndex >= history.length) return
    const target = history[nextIndex]
    set({ page: target, historyIndex: nextIndex })
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => get().save(), 500)
  },

  save: async () => {
    const { page } = get()
    if (!page) return
    set({ isSaving: true, saveError: null })
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: JSON.stringify({ ...page, updatedAt: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error('Save failed')
      set({ isSaving: false, lastSaved: new Date() })
    } catch (err) {
      set({ isSaving: false, saveError: err instanceof Error ? err.message : 'Save failed' })
    }
  },
}))
