import { create } from 'zustand'
import type { BlockData, CmsPage, CmsPageSeo, CmsPageSettings } from './types'

const MAX_HISTORY = 50

interface EditorState {
  page: CmsPage | null
  isSaving: boolean
  lastSaved: Date | null
  saveError: string | null
  isDirty: boolean
  history: CmsPage[]
  historyIndex: number
}

interface EditorActions {
  setPage: (page: CmsPage) => void
  setTitle: (title: string) => void
  setSlug: (slug: string) => void
  updateSeo: (seo: Partial<CmsPageSeo>) => void
  updateSettings: (settings: Partial<CmsPageSettings>) => void
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

function pushHistory(state: EditorState, currentPage: CmsPage): Pick<EditorState, 'history' | 'historyIndex'> {
  const newHistory = [...state.history.slice(0, state.historyIndex + 1), currentPage].slice(-MAX_HISTORY)
  return { history: newHistory, historyIndex: newHistory.length - 1 }
}

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  page: null,
  isSaving: false,
  lastSaved: null,
  saveError: null,
  isDirty: false,
  history: [],
  historyIndex: -1,

  setPage: (page) => set({ page, history: [], historyIndex: -1, isDirty: false, lastSaved: null, saveError: null }),

  setTitle: (title) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, title }, ...hist, isDirty: true })
  },

  setSlug: (slug) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, slug }, ...hist, isDirty: true })
  },

  updateSeo: (seo) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, seo: { ...page.seo, ...seo } }, ...hist, isDirty: true })
  },

  updateSettings: (settings) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, settings: { ...page.settings, ...settings } }, ...hist, isDirty: true })
  },

  addBlock: (block) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, blocks: [...page.blocks, block] }, ...hist, isDirty: true })
  },

  removeBlock: (id) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, blocks: page.blocks.filter((b) => b._id !== id) }, ...hist, isDirty: true })
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
      isDirty: true,
    })
  },

  reorderBlocks: (blocks) => {
    const { page } = get()
    if (!page) return
    const hist = pushHistory(get(), page)
    set({ page: { ...page, blocks }, ...hist, isDirty: true })
  },

  toggleStatus: async () => {
    const { page } = get()
    if (!page) return
    const newStatus: 'draft' | 'published' = page.status === 'draft' ? 'published' : 'draft'
    const updated: CmsPage = { ...page, status: newStatus }
    set({ page: updated, isSaving: true, saveError: null })
    const res = await fetch(`/api/admin/pages/${page.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
      body: JSON.stringify(updated),
    })
    if (res.ok) {
      set({ isSaving: false, lastSaved: new Date(), isDirty: false })
    } else {
      const err = (await res.json()) as { error?: string }
      set({ isSaving: false, saveError: err.error ?? 'Save failed' })
    }
  },

  duplicateBlock: (id) => {
    const { page } = get()
    if (!page) return
    const idx = page.blocks.findIndex((b) => b._id === id)
    if (idx === -1) return
    const original = page.blocks[idx]
    const clone: BlockData = { ...(JSON.parse(JSON.stringify(original)) as BlockData), _id: crypto.randomUUID() }
    const hist = pushHistory(get(), page)
    const newBlocks = [...page.blocks]
    newBlocks.splice(idx + 1, 0, clone)
    set({ page: { ...page, blocks: newBlocks }, ...hist, isDirty: true })
  },

  undo: () => {
    const { history, historyIndex, page } = get()
    if (historyIndex < 0 || history.length === 0) return
    const target = history[historyIndex]
    const newHistory = [...history]
    if (page && newHistory.length <= historyIndex + 1) {
      newHistory.splice(historyIndex + 1, 0, page)
    }
    set({ page: target, history: newHistory, historyIndex: historyIndex - 1, isDirty: true })
  },

  redo: () => {
    const { history, historyIndex } = get()
    const nextIndex = historyIndex + 1
    if (nextIndex >= history.length) return
    set({ page: history[nextIndex], historyIndex: nextIndex, isDirty: true })
  },

  save: async () => {
    const { page } = get()
    if (!page) return
    set({ isSaving: true, saveError: null })
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
        body: JSON.stringify({ ...page, updatedAt: new Date().toISOString() }),
      })
      if (!res.ok) {
        const err = (await res.json()) as { error?: string }
        throw new Error(err.error ?? 'Save failed')
      }
      set({ isSaving: false, lastSaved: new Date(), isDirty: false })
    } catch (err) {
      set({ isSaving: false, saveError: err instanceof Error ? err.message : 'Save failed' })
    }
  },
}))
