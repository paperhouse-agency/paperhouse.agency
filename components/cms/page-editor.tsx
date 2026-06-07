'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/components/link'
import { Button } from '@/components/button'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BLOCK_REGISTRY } from '@/libs/cms/block-registry'
import { useEditorStore } from '@/libs/cms/editor-store'
import type { BlockData, CmsPage, CmsPageSettings } from '@/libs/cms/types'
import { BlockFieldsPanel } from './block-fields-panel'
import { BlocksPreview } from './block-preview'
import { Undo2, Redo2 } from 'lucide-react'

type Tab = 'blocks' | 'seo' | 'settings'

interface PageAuthor { id: string; name: string }
interface PageRef { id: string; title: string; slug: string }

export function PageEditor({
  initialPage,
  authors = [],
  allPages = [],
}: {
  initialPage: CmsPage
  authors?: PageAuthor[]
  allPages?: PageRef[]
}) {
  const {
    setPage,
    page,
    setTitle,
    setSlug,
    updateSeo,
    updateSettings,
    reorderBlocks,
    addBlock,
    removeBlock,
    updateBlock,
    toggleStatus,
    duplicateBlock,
    undo,
    redo,
    save,
    isSaving,
    isDirty,
    lastSaved,
    saveError,
    history,
    historyIndex,
  } = useEditorStore()

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('blocks')
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(268)
  const [previewWidth, setPreviewWidth] = useState(400)

  function startSidebarResize(e: React.MouseEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startW = sidebarWidth
    function onMove(ev: MouseEvent) {
      setSidebarWidth(Math.max(160, Math.min(480, startW + ev.clientX - startX)))
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  function startPreviewResize(e: React.MouseEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startW = previewWidth
    function onMove(ev: MouseEvent) {
      setPreviewWidth(Math.max(280, Math.min(720, startW - (ev.clientX - startX))))
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  useEffect(() => {
    setPage(initialPage)
  }, [initialPage, setPage])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 's') {
        e.preventDefault()
        save()
        return
      }
      if (mod && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault()
        redo()
        return
      }
      if (mod && e.key === 'z') {
        e.preventDefault()
        undo()
        return
      }
      if (e.key === 'Escape') {
        setSelectedBlockId(null)
        return
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlockId) {
        const target = e.target as HTMLElement
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT'
        )
          return
        removeBlock(selectedBlockId)
        setSelectedBlockId(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [save, undo, redo, removeBlock, selectedBlockId])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  if (!page) return <p style={{ padding: '2rem', fontFamily: 'var(--font-body)' }}>Loading…</p>

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDragId(null)

    const activeId = String(active.id)

    if (activeId.startsWith('palette-')) {
      const type = activeId.slice('palette-'.length)
      const entry = BLOCK_REGISTRY.find((e) => e.type === type)
      if (entry) {
        const block = entry.defaultData()
        addBlock(block)
        setSelectedBlockId(block._id)
        setActiveTab('blocks')
      }
      return
    }

    if (!over || active.id === over.id || !page) return
    const oldIndex = page.blocks.findIndex((b) => b._id === active.id)
    const newIndex = page.blocks.findIndex((b) => b._id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderBlocks(arrayMove(page.blocks, oldIndex, newIndex))
    }
  }

  const canUndo = historyIndex >= 0 && history.length > 0
  const canRedo = historyIndex < history.length - 1
  const isHomepage = page.slug === '' || page.slug === 'index'
  const activePaletteEntry = activeDragId?.startsWith('palette-')
    ? BLOCK_REGISTRY.find((e) => e.type === activeDragId.slice('palette-'.length))
    : null

  const filteredPalette = BLOCK_REGISTRY.filter((e) =>
    e.label.toLowerCase().includes(sidebarSearch.toLowerCase()),
  )


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative flex-1 flex min-h-0 overflow-hidden">

        {/* Floating sidebar collapse/expand button — anchored to shell */}
        <button
          type="button"
          className="absolute top-[14px] z-20 flex items-center justify-center w-[24px] h-[24px] rounded-full border border-[var(--chrome-border)] bg-[var(--c-card)] text-[var(--chrome-muted)] cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.10)] transition-[left,background,color,box-shadow] duration-200 hover:text-text hover:shadow-[0_2px_8px_rgba(0,0,0,0.14)]"
          style={{ left: sidebarOpen ? sidebarWidth - 13 : 0 }}
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? 'Hide blocks panel' : 'Show blocks panel'}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {sidebarOpen
              ? <path d="M15 18l-6-6 6-6" />
              : <path d="M9 18l6-6-6-6" />}
          </svg>
        </button>

        {/* ── Left sidebar: block palette ── */}
        <aside
          className={`relative flex-none bg-[var(--chrome)] flex flex-col overflow-hidden transition-[width,min-width] duration-200${sidebarOpen ? '' : ' !w-0 min-w-0'}`}
          style={sidebarOpen ? { width: sidebarWidth } : undefined}
        >
          {sidebarOpen && <>
          <div className="px-[20px] pt-[22px] pb-[14px] flex-none">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Blocks</span>
            </div>
            <p className="mt-[8px] mb-0 font-body text-[12.5px] leading-[1.45] text-[var(--chrome-muted)]">Drag a block onto the page.</p>
            <div className="mt-[14px] flex items-center gap-[9px] px-[14px] h-[38px] rounded-full bg-[rgba(26,26,26,0.05)] border border-transparent text-[var(--chrome-faint)]">
              <span style={{ flex: 'none', opacity: 0.5, lineHeight: 1, fontSize: 14 }}>⌕</span>
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="border-none bg-transparent outline-none flex-1 font-body text-[13px] text-text min-w-0 placeholder:text-[var(--chrome-faint)]"
                placeholder="Search blocks…"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-[14px] pb-[18px] pt-[4px] flex flex-col gap-[7px]">
            {filteredPalette.length === 0 && (
              <p className="font-body text-[13px] text-[var(--chrome-muted)] py-[14px] px-[4px]">No blocks match "{sidebarSearch}".</p>
            )}
            {filteredPalette.map((entry) => (
              <PaletteItem
                key={entry.type}
                entry={entry}
                onAdd={() => {
                  const block = entry.defaultData()
                  addBlock(block)
                  setSelectedBlockId(block._id)
                  setActiveTab('blocks')
                }}
              />
            ))}
          </div>
          </>}
        </aside>

        {/* Sidebar resize handle */}
        {sidebarOpen && (
          // biome-ignore lint/a11y/noStaticElementInteractions: drag handle
          <div className="flex-none w-[4px] cursor-col-resize bg-transparent transition-[background] duration-150 z-[5] hover:bg-primary hover:opacity-35 active:bg-primary active:opacity-35" onMouseDown={startSidebarResize} />
        )}

        {/* ── Right canvas ── */}
        <div className="flex-1 overflow-y-auto min-w-0 bg-[var(--workspace)] flex flex-col">

          {/* Page header */}
          <div className="px-[34px] pt-[26px] pb-[22px] flex items-start justify-between gap-[24px] flex-wrap flex-none">
            <div>
              <div className="flex items-center gap-[8px] mb-[10px]">
                <Link href="/admin/pages" className="font-mono text-[11.5px] tracking-[0.08em] text-[var(--chrome-muted)] no-underline transition-colors duration-[120ms] hover:text-text">Pages</Link>
                <span className="text-[var(--chrome-faint)] text-[12px] leading-none">›</span>
                <span className="font-mono text-[11.5px] tracking-[0.08em] text-text">{page.title || 'Untitled'}</span>
              </div>

              <div className="flex items-center gap-[14px] flex-wrap">
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Page title"
                  style={{
                    fontFamily: 'var(--font-heading, Georgia, serif)',
                    fontSize: 36,
                    fontWeight: 400,
                    color: 'var(--color-text)',
                    border: '1px solid transparent',
                    background: 'transparent',
                    outline: 'none',
                    padding: '2px 6px',
                    borderRadius: 6,
                    lineHeight: 1,
                    transition: 'border-color 0.15s, background 0.15s',
                    margin: 0,
                    minWidth: 120,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--c-card-border)'
                    e.currentTarget.style.background = 'var(--c-card)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.background = 'transparent'
                  }}
                />

                <span className={`inline-flex items-center gap-[6px] rounded-full py-[4px] px-[11px] font-mono text-[11px] tracking-[0.1em] uppercase whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-current before:flex-none ${page.status === 'published' ? 'bg-[rgba(31,138,91,0.12)] text-[#1f8a5b]' : 'bg-bluishgray text-[var(--chrome-muted)]'}`}>
                  {page.status === 'published' ? 'Published' : 'Draft'}
                </span>

                {isHomepage && (
                  <span className="inline-flex items-center gap-[6px] rounded-full py-[4px] px-[11px] font-mono text-[11px] tracking-[0.1em] uppercase whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-current before:flex-none bg-[rgba(255,77,0,0.1)] text-primary">Homepage</span>
                )}
              </div>

              <div className="font-body text-[14px] text-[var(--chrome-muted)] mt-[10px] flex items-center gap-[8px]">
                {isHomepage ? (
                  <span className="font-mono text-[12px] text-[var(--chrome-muted)]">/</span>
                ) : (
                  <div className="flex items-center gap-[4px] flex-1 min-w-0">
                    <span className="font-mono text-[13px] text-[var(--chrome-faint)] flex-none">/</span>
                    <input
                      type="text"
                      value={page.slug}
                      onChange={(e) => {
                        setSlug(e.target.value)
                        setSlugError(null)
                      }}
                      onBlur={async (e) => {
                        const val = e.target.value.trim()
                        if (!val || val === initialPage.slug) {
                          setSlugError(null)
                          return
                        }
                        const res = await fetch(
                          `/api/admin/pages?slugCheck=${encodeURIComponent(val)}&excludeId=${page.id}`,
                        )
                        const data = (await res.json()) as { taken?: boolean }
                        setSlugError(data.taken ? 'Slug already in use' : null)
                      }}
                      placeholder="page-slug"
                      className={`font-mono text-[13px] text-[var(--chrome-muted)] border border-transparent bg-transparent py-[2px] px-[6px] rounded-[4px] transition-[border-color,background] duration-150 min-w-[60px] flex-1 max-w-[300px] outline-none hover:border-[var(--c-card-border)] hover:bg-[var(--c-card)] focus:border-[var(--chrome-muted)] focus:bg-[var(--c-card)] focus:text-text${slugError ? ' border-primary' : ''}`}
                    />
                    {slugError && (
                      <span className="text-[12px] text-primary font-body">{slugError}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-[14px] flex-none">
              <div className="flex items-center gap-[10px]">
                {/* Undo / Redo */}
                <button
                  type="button"
                  className="w-[34px] h-[34px] rounded-[8px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-text cursor-pointer transition-[border-color,background] duration-[120ms] flex-none hover:not-disabled:border-[#b8b5b0] hover:not-disabled:bg-[var(--workspace)] disabled:opacity-35 disabled:cursor-not-allowed"
                  disabled={!canUndo}
                  onClick={undo}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 size={15} />
                </button>
                <button
                  type="button"
                  className="w-[34px] h-[34px] rounded-[8px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-text cursor-pointer transition-[border-color,background] duration-[120ms] flex-none hover:not-disabled:border-[#b8b5b0] hover:not-disabled:bg-[var(--workspace)] disabled:opacity-35 disabled:cursor-not-allowed"
                  disabled={!canRedo}
                  onClick={redo}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo2 size={15} />
                </button>

                <span className="w-[1px] h-[24px] bg-[var(--c-card-border)] flex-none" />

                {/* Save status + button */}
                <span className="font-mono text-[11.5px] whitespace-nowrap tracking-[0.04em]">
                  {isSaving && <span className="text-[var(--chrome-muted)]">Saving…</span>}
                  {!isSaving && saveError && <span className="text-primary">{saveError}</span>}
                  {!(isSaving || saveError ) && isDirty && (
                    <span className="text-[#b87c20]">● Unsaved</span>
                  )}
                  {!((isSaving || saveError ) || isDirty ) && lastSaved && (
                    <span className="text-[#1f8a5b]">✓ Saved</span>
                  )}
                </span>

                <Button
                  type="button"
                  variant="default"
                  color={"primary"}
                  size="sm"
                  disabled={isSaving || !isDirty}
                  onClick={save}
                  title="Save (Ctrl+S)"
                  className={isSaving || !isDirty ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {isSaving ? 'Saving…' : 'Save changes'}
                </Button>

                <span className="w-[1px] h-[24px] bg-[var(--c-card-border)] flex-none" />

                {/* Publish / Unpublish */}
                <Button
                  size="sm"
                  variant={page.status === 'published' ? 'outline' : 'default'}
                  color={page.status === 'published' ? 'neutral' : 'primary'}
                  onClick={toggleStatus}
                >
                  {page.status === 'draft' ? 'Publish' : 'Unpublish'}
                </Button>
              </div>

              {/* Row 2: preview toggle + homepage toggle */}
              <div className="flex items-center gap-[10px]">
                <Button
                  type="button"
                  variant={previewOpen ? 'default' : 'outline'}
                  color="neutral"
                  size="sm"
                  onClick={() => setPreviewOpen((v) => !v)}
                >
                  {previewOpen ? 'Hide preview' : 'Preview'}
                </Button>

                {/* biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: intentional toggle */}
                {/* biome-ignore lint/a11y/useSemanticElements: label triggers checkbox */}
                <label className="inline-flex items-center gap-[10px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="cms-toggle"
                    checked={isHomepage}
                    onChange={(e) => {
                      setSlugError(null)
                      setSlug(
                        e.target.checked
                          ? ''
                          : (page.title
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/(^-|-$)/g, '') || 'untitled'),
                      )
                    }}
                  />
                  <span className="font-mono text-[11.5px] tracking-[0.08em] uppercase text-[var(--chrome-muted)]">Set as homepage</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-[30px] px-[34px] border-b border-[var(--c-card-border)] flex-none bg-[var(--workspace)]">
            {(
              [
                ['blocks', 'Blocks', String(page.blocks.length)],
                ['seo', 'SEO', null],
                ['settings', 'Settings', null],
              ] as [Tab, string, string | null][]
            ).map(([id, label, count]) => (
              <button
                key={id}
                type="button"
                className={`inline-flex items-center gap-[8px] pb-[14px] pt-0 px-[2px] bg-none border-none border-b-2 -mb-[1px] cursor-pointer font-mono text-[13.5px] tracking-[0.04em] transition-colors duration-150 ${activeTab === id ? 'text-text border-b-primary' : 'text-[var(--chrome-muted)] border-b-transparent hover:text-text'}`}
                onClick={() => setActiveTab(id)}
              >
                {label}
                {count !== null && (
                  <span className={`font-mono text-[11px] py-[2px] px-[7px] rounded-full ${activeTab === id ? 'bg-[rgba(255,77,0,0.1)] text-primary' : 'bg-bluishgray text-[var(--chrome-faint)]'}`}>{count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Blocks tab ── */}
          {activeTab === 'blocks' && (
            <div className="px-[34px] py-[24px] pb-[40px] flex-1">
              <SortableContext
                items={page.blocks.map((b) => b._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-[14px]">
                  {page.blocks.length === 0 && (
                    <div className="flex items-center justify-center gap-[8px] p-[22px] rounded-[12px] border-[1.5px] border-dashed border-[var(--chrome-faint)] bg-transparent text-[var(--chrome-muted)] font-mono text-[13px] tracking-[0.04em] cursor-default text-center">
                      Drag a block from the left panel or click a block to add it.
                    </div>
                  )}
                  {page.blocks.map((block, i) => (
                    <SortableBlockCard
                      key={block._id}
                      block={block}
                      index={i}
                      isSelected={block._id === selectedBlockId}
                      onSelect={() =>
                        setSelectedBlockId(
                          block._id === selectedBlockId ? null : block._id,
                        )
                      }
                      onRemove={() => {
                        removeBlock(block._id)
                        if (selectedBlockId === block._id) setSelectedBlockId(null)
                      }}
                      onDuplicate={() => duplicateBlock(block._id)}
                      onToggleVisible={() =>
                        updateBlock(block._id, {
                          visible: !(block.visible ?? true),
                        })
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          )}

          {/* ── SEO tab ── */}
          {activeTab === 'seo' && <SeoTab page={page} updateSeo={updateSeo} />}

          {/* ── Settings tab ── */}
          {activeTab === 'settings' && (
            <SettingsTab
              page={page}
              isHomepage={isHomepage}
              setSlug={setSlug}
              toggleStatus={toggleStatus}
              updateSettings={updateSettings}
              authors={authors}
              allPages={allPages}
            />
          )}
        </div>

        {/* ── Live preview panel (blocks tab only) ── */}
        {activeTab === 'blocks' && previewOpen && (
          // biome-ignore lint/a11y/noStaticElementInteractions: drag handle sibling
          <div className="flex-none w-[4px] cursor-col-resize bg-transparent transition-[background] duration-150 z-[5] hover:bg-primary hover:opacity-35 active:bg-primary active:opacity-35" onMouseDown={startPreviewResize} />
        )}

        {activeTab === 'blocks' && previewOpen && (
          <div className="flex-none bg-[var(--chrome)] flex flex-col overflow-hidden" style={{ width: previewWidth }}>
            <div className="px-[20px] py-[13px] border-b border-[var(--chrome-border)] flex items-center justify-between flex-none">
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Preview</span>
              <button
                type="button"
                className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-[var(--chrome-muted)] cursor-pointer transition-[background,color] duration-[120ms] flex-none hover:bg-[rgba(26,26,26,0.08)] hover:text-text"
                onClick={() => setPreviewOpen(false)}
                title="Hide preview"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <BlocksPreview blocks={page.blocks} selectedBlockId={selectedBlockId} />
          </div>
        )}
      </div>

      {/* Drag overlay for palette items */}
      <DragOverlay>
        {activePaletteEntry && (
          <div className="flex items-center gap-[11px] py-[10px] px-[12px] rounded-[10px] cursor-grab bg-[rgba(255,255,255,0.88)] border border-[rgba(26,26,26,0.08)] shadow-[0_8px_24px_rgba(0,0,0,0.15)] text-text select-none opacity-[0.88]">
            <span className="text-[var(--chrome-faint)] cursor-grab flex-none leading-none text-[16px]">⠿</span>
            <span className="w-[30px] h-[30px] rounded-[8px] flex-none inline-flex items-center justify-center bg-bluishgray text-[var(--chrome-muted)]" />
            <span className="font-body text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">{activePaletteEntry.label}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

/* ── Palette item ────────────────────────────────────────────────── */
function PaletteItem({
  entry,
  onAdd,
}: {
  entry: { type: string; label: string; icon?: string; defaultData: () => BlockData }
  onAdd: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${entry.type}`,
  })

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: dnd-kit spreads keyboard handlers via attributes
    // biome-ignore lint/a11y/noStaticElementInteractions: dnd-kit requires div as draggable root
    <div
      ref={setNodeRef}
      className="flex items-center gap-[11px] py-[10px] px-[12px] rounded-[10px] cursor-grab bg-[rgba(255,255,255,0.88)] border border-[rgba(26,26,26,0.08)] shadow-[var(--c-card-shadow)] text-text transition-[border-color,box-shadow,opacity] duration-100 select-none hover:border-[rgba(26,26,26,0.15)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] active:cursor-grabbing"
      style={{ opacity: isDragging ? 0.35 : 1 }}
      onClick={onAdd}
      {...listeners}
      {...attributes}
    >
      <span className="text-[var(--chrome-faint)] cursor-grab flex-none leading-none text-[16px]">⠿</span>
      <span className="w-[30px] h-[30px] rounded-[8px] flex-none inline-flex items-center justify-center bg-bluishgray text-[var(--chrome-muted)]" style={{ fontSize: 14 }}>
        {entry.icon ? '◈' : '▣'}
      </span>
      <span className="font-body text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">{entry.label}</span>
    </div>
  )
}

/* ── Sortable block card ─────────────────────────────────────────── */
function SortableBlockCard({
  block,
  index,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleVisible,
}: {
  block: BlockData
  index: number
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onDuplicate: () => void
  onToggleVisible: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block._id })

  const entry = BLOCK_REGISTRY.find((e) => e.type === block._type)
  const isVisible = block.visible ?? true

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : isVisible ? 1 : 0.5,
      }}
    >
      <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
        {/* Card header — click to expand/collapse */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: dnd-kit sortable wrapper */}
        {/* biome-ignore lint/a11y/useSemanticElements: sortable requires div */}
        <div
          className="flex items-center justify-between px-[18px] py-[14px] border-b border-[var(--c-card-border)] bg-[var(--workspace)] cursor-pointer transition-[background] duration-100 select-none hover:bg-[#f5f3f0]"
          onClick={onSelect}
          onKeyDown={(e) => e.key === 'Enter' && onSelect()}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-[12px] min-w-0">
            {/* biome-ignore lint/a11y/noStaticElementInteractions: dnd-kit */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: dnd-kit */}
            <span
              className="text-[var(--chrome-faint)] cursor-grab flex-none text-[18px] leading-none p-[2px] active:cursor-grabbing"
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
            >
              ⠿
            </span>

            <span
              className={`w-[32px] h-[32px] rounded-[8px] inline-flex items-center justify-center flex-none text-[15px] leading-none ${isSelected ? 'bg-primary text-offwhite' : 'bg-bluishgray text-[var(--chrome-muted)]'}`}
            >
              ▣
            </span>

            <div className="flex items-center gap-[9px] min-w-0">
              <span className="font-heading text-[16px] text-text whitespace-nowrap overflow-hidden text-ellipsis">{entry?.label ?? block._type}</span>
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--chrome-faint)] border border-[var(--c-card-border)] rounded-[4px] py-[2px] px-[6px] flex-none">Block {String(index + 1).padStart(2, '0')}</span>
            </div>
          </div>

          <div
            className="flex items-center gap-[6px] flex-none"
            // stop propagation so clicks on action buttons don't toggle selection
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="w-[32px] h-[32px] rounded-[7px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-[var(--chrome-muted)] cursor-pointer font-body transition-[background,color,border-color] duration-100 hover:bg-[var(--workspace)] hover:border-[#b8b5b0] hover:text-text"
              title={isVisible ? 'Hide block' : 'Show block'}
              onClick={onToggleVisible}
              style={{ fontSize: 14 }}
            >
              {isVisible ? '◉' : '○'}
            </button>
            <button
              type="button"
              className="w-[32px] h-[32px] rounded-[7px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-[var(--chrome-muted)] cursor-pointer font-body transition-[background,color,border-color] duration-100 hover:bg-[var(--workspace)] hover:border-[#b8b5b0] hover:text-text"
              title="Duplicate"
              onClick={onDuplicate}
              style={{ fontSize: 13 }}
            >
              ⎘
            </button>
            <button
              type="button"
              className="w-[32px] h-[32px] rounded-[7px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-[var(--chrome-muted)] cursor-pointer font-body transition-[background,color,border-color] duration-100 hover:bg-[#fff5f4] hover:text-primary hover:border-[#ffc4bc]"
              title="Remove block"
              onClick={onRemove}
              style={{ fontSize: 16 }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Expanded form */}
        {isSelected && (
          <div className="px-[24px] py-[24px] pb-[26px] flex flex-col gap-[20px]">
            <BlockFieldsPanel block={block} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── SEO tab ─────────────────────────────────────────────────────── */
function SeoTab({
  page,
  updateSeo,
}: {
  page: CmsPage
  updateSeo: (data: Partial<CmsPage['seo']>) => void
}) {
  const seo = page.seo
  const metaTitle = seo.title ?? ''
  const metaDesc = seo.description ?? ''
  const keywords = (seo.keywords ?? []).join(', ')

  const fieldCls = 'flex flex-col gap-[8px]'
  const labelCls = 'font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]'
  const inputSmCls = 'w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)]'
  const hintCls = 'font-body text-[12px] text-[var(--chrome-faint)] mt-[-2px] leading-[1.4]'

  return (
    <div className="px-[34px] py-[24px] pb-[40px] flex-1">
      <div className="grid gap-[26px] items-start" style={{ gridTemplateColumns: 'minmax(0,1fr) 400px' }}>
        {/* Left: form */}
        <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
          <div className="px-[22px] py-[18px] border-b border-[var(--c-card-border)]">
            <h3 className="font-heading font-normal text-[19px] m-0 text-text">Search engine optimization</h3>
            <p className="font-body text-[13.5px] text-[var(--chrome-muted)] mt-[5px] mb-0">How this page appears in search results and when shared.</p>
          </div>
          <div className="px-[22px] py-[22px] flex flex-col gap-[20px]">
            <div className={fieldCls}>
              <div className={labelCls} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Meta title <span className="text-primary">*</span></span>
                <span className={`font-body text-[12px] ${metaTitle.length > 60 ? 'text-primary' : 'text-[var(--chrome-faint)]'}`}>
                  {metaTitle.length} / 60
                </span>
              </div>
              <input
                type="text"
                className={inputSmCls}
                value={metaTitle}
                onChange={(e) => updateSeo({ title: e.target.value })}
                placeholder="Page title for search engines"
              />
            </div>

            <div className={fieldCls}>
              <div className={labelCls} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Meta description</span>
                <span className={`font-body text-[12px] ${metaDesc.length > 160 ? 'text-primary' : 'text-[var(--chrome-faint)]'}`}>
                  {metaDesc.length} / 160
                </span>
              </div>
              <textarea
                className="w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)] resize-y min-h-[80px]"
                value={metaDesc}
                onChange={(e) => updateSeo({ description: e.target.value })}
                placeholder="Short description for search results"
                rows={3}
              />
            </div>

            <div className={fieldCls}>
              <label className={labelCls}>Keywords</label>
              <input
                type="text"
                className={inputSmCls}
                value={keywords}
                onChange={(e) =>
                  updateSeo({
                    keywords: e.target.value
                      .split(',')
                      .map((k) => k.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="keyword1, keyword2, keyword3"
              />
              <span className={hintCls}>Comma-separated keywords</span>
            </div>

            {/* OG image if available */}
            <div className={fieldCls}>
              <label className={labelCls}>Social share image (OG)</label>
              <input
                type="url"
                className={`${inputSmCls} font-mono`}
                value={seo.ogImage ?? ''}
                onChange={(e) => updateSeo({ ogImage: e.target.value })}
                placeholder="https://example.com/og-image.jpg"
              />
              <span className={hintCls}>Recommended 1200 × 630 px</span>
            </div>

            {/* Search indexing toggle */}
            <div className="flex items-center justify-between px-[16px] py-[14px] rounded-[10px] bg-bluishgray">
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500 }}>
                  Allow search indexing
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--chrome-muted)', marginTop: 2 }}>
                  Let search engines list this page.
                </div>
              </div>
              <input
                type="checkbox"
                className="cms-toggle"
                checked={!(seo.noIndex ?? false)}
                onChange={(e) => updateSeo({ noIndex: !e.target.checked })}
              />
            </div>
          </div>
        </div>

        {/* Right: previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, position: 'sticky', top: 0 }}>
          <div>
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Search result preview</div>
            <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] px-[20px] py-[18px] mt-[12px]">
              <div className="flex items-center gap-[9px] mb-[8px]">
                <span className="w-[26px] h-[26px] rounded-full bg-primary text-offwhite font-body font-bold text-[13px] inline-flex items-center justify-center flex-none">p</span>
                <div>
                  <div className="font-body text-[13px] leading-[1.2] text-text">PaperHouse</div>
                  <div className="font-mono text-[11.5px] text-[var(--chrome-muted)]">
                    https://paperhouse.agency/{page.slug || ''}
                  </div>
                </div>
              </div>
              <div className="font-body text-[18px] text-secondary leading-[1.25] mb-[4px]">
                {metaTitle || page.title || 'Page title'}
              </div>
              <div className="font-body text-[13px] text-[var(--chrome-muted)] leading-[1.5]">
                {metaDesc || 'Add a meta description to preview how this page appears in search results.'}
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Social card</div>
            <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden mt-[12px]">
              <div className="aspect-[1200/500] overflow-hidden bg-bluishgray flex items-center justify-center text-[var(--chrome-faint)] font-mono text-[12px]">
                {seo.ogImage ? (
                  // biome-ignore lint/performance/noImgElement: admin-only preview
                  <img src={seo.ogImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>No OG image set</span>
                )}
              </div>
              <div className="px-[16px] py-[14px]">
                <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--chrome-faint)]">paperhouse.agency</div>
                <div className="font-heading text-[16px] mt-[5px] text-text">{metaTitle || page.title}</div>
                <div className="font-body text-[12px] text-[var(--chrome-muted)] mt-[4px] leading-[1.5]">{metaDesc}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Settings tab ────────────────────────────────────────────────── */

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'password-protected', label: 'Password-protected' },
] as const

const TEMPLATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'landing-page', label: 'Landing page' },
  { value: 'article', label: 'Article' },
  { value: 'contact', label: 'Contact' },
  { value: 'blank', label: 'Blank' },
] as const

const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'pt-BR', label: 'Portuguese (BR)' },
  { value: 'ar', label: 'Arabic' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
  { value: 'ja', label: 'Japanese' },
] as const

function SettingsTab({
  page,
  isHomepage,
  setSlug,
  toggleStatus,
  updateSettings,
  authors,
  allPages,
}: {
  page: CmsPage
  isHomepage: boolean
  setSlug: (slug: string) => void
  toggleStatus: () => Promise<void>
  updateSettings: (s: Partial<CmsPageSettings>) => void
  authors: { id: string; name: string }[]
  allPages: { id: string; title: string; slug: string }[]
}) {
  const s = page.settings ?? {}

  /** Format ISO date for the publish date input */
  function formatPublishedAt(iso?: string) {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  const fieldCls = 'flex flex-col gap-[8px]'
  const labelCls = 'font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]'
  const selectSmCls = 'w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary cursor-pointer appearance-auto'
  const inputSmCls = 'w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)]'

  return (
    <div className="px-[34px] py-[24px] pb-[40px] flex-1">
      <div className="max-w-[780px] flex flex-col gap-[20px]">

        {/* ── Page settings card ── */}
        <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
          <div className="px-[22px] py-[18px] border-b border-[var(--c-card-border)]">
            <h3 className="font-heading font-normal text-[19px] m-0 text-text">Page settings</h3>
            <p className="font-body text-[13.5px] text-[var(--chrome-muted)] mt-[5px] mb-0">Placement, visibility and authorship for this page.</p>
          </div>
          <div className="px-[22px] py-[22px] flex flex-col gap-[20px]">

            {/* 2-col grid */}
            <div className="grid gap-[18px_20px]" style={{ gridTemplateColumns: '1fr 1fr' }}>

              {/* Status (read-only — use Publish toggle below) */}
              <div className={fieldCls}>
                <label className={labelCls}>Status</label>
                <span
                  className={`inline-flex items-center gap-[6px] rounded-full py-[4px] px-[11px] font-mono text-[11px] tracking-[0.1em] uppercase whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-current before:flex-none self-start ${page.status === 'published' ? 'bg-[rgba(31,138,91,0.12)] text-[#1f8a5b]' : 'bg-bluishgray text-[var(--chrome-muted)]'}`}
                >
                  {page.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Visibility */}
              <div className={fieldCls}>
                <label htmlFor="settings-visibility" className={labelCls}>Visibility</label>
                <select
                  id="settings-visibility"
                  className={selectSmCls}
                  value={s.visibility ?? 'public'}
                  onChange={(e) =>
                    updateSettings({ visibility: e.target.value as CmsPageSettings['visibility'] })
                  }
                >
                  {VISIBILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Parent page */}
              <div className={fieldCls}>
                <label htmlFor="settings-parent" className={labelCls}>Parent page</label>
                <select
                  id="settings-parent"
                  className={selectSmCls}
                  value={s.parentSlug ?? ''}
                  onChange={(e) => updateSettings({ parentSlug: e.target.value || undefined })}
                >
                  <option value="">— None (top level) —</option>
                  {allPages.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.title} (/{p.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Template */}
              <div className={fieldCls}>
                <label htmlFor="settings-template" className={labelCls}>Template</label>
                <select
                  id="settings-template"
                  className={selectSmCls}
                  value={s.template ?? 'default'}
                  onChange={(e) =>
                    updateSettings({ template: e.target.value as CmsPageSettings['template'] })
                  }
                >
                  {TEMPLATE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Author */}
              <div className={fieldCls}>
                <label htmlFor="settings-author" className={labelCls}>Author</label>
                {authors.length > 0 ? (
                  <select
                    id="settings-author"
                    className={selectSmCls}
                    value={s.author ?? ''}
                    onChange={(e) => updateSettings({ author: e.target.value || undefined })}
                  >
                    <option value="">— Unassigned —</option>
                    {authors.map((a) => (
                      <option key={a.id} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="settings-author"
                    type="text"
                    className={inputSmCls}
                    value={s.author ?? ''}
                    onChange={(e) => updateSettings({ author: e.target.value || undefined })}
                    placeholder="Author name"
                  />
                )}
              </div>

              {/* Language */}
              <div className={fieldCls}>
                <label htmlFor="settings-language" className={labelCls}>Language</label>
                <select
                  id="settings-language"
                  className={selectSmCls}
                  value={s.language ?? 'en-US'}
                  onChange={(e) => updateSettings({ language: e.target.value })}
                >
                  {LANGUAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Publish date (read-only timestamp, auto-set on first publish) */}
            <div className={fieldCls}>
              <label className={labelCls}>First published</label>
              <input
                type="text"
                className={`${inputSmCls} font-mono`}
                value={formatPublishedAt(s.publishedAt)}
                readOnly
                placeholder="Not yet published"
                style={{ color: s.publishedAt ? 'var(--color-text)' : 'var(--chrome-faint)' }}
              />
              <span className="font-body text-[12px] text-[var(--chrome-faint)] mt-[-2px] leading-[1.4]">Set automatically when this page is first published.</span>
            </div>

            {/* Set as homepage toggle */}
            <div className="flex items-center justify-between px-[16px] py-[14px] rounded-[10px] bg-bluishgray">
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>
                  Set as homepage
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--chrome-muted)', marginTop: 2 }}>
                  Serve this page at the site root (/).
                </div>
              </div>
              <input
                type="checkbox"
                className="cms-toggle"
                checked={isHomepage}
                onChange={(e) => {
                  setSlug(
                    e.target.checked
                      ? ''
                      : (page.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '') || 'untitled'),
                  )
                }}
              />
            </div>

            {/* Published toggle */}
            <div className="flex items-center justify-between px-[16px] py-[14px] rounded-[10px] bg-bluishgray">
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>
                  Published
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--chrome-muted)', marginTop: 2 }}>
                  {page.status === 'published' ? 'Live — visible to the public.' : 'Draft — not publicly visible.'}
                </div>
              </div>
              <input
                type="checkbox"
                className="cms-toggle"
                checked={page.status === 'published'}
                onChange={() => toggleStatus()}
              />
            </div>

          </div>
        </div>

        {/* ── Meta card (read-only timestamps) ── */}
        <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
          <div className="px-[22px] py-[18px] border-b border-[var(--c-card-border)]">
            <h3 className="font-heading font-normal text-[19px] m-0 text-text">Page info</h3>
          </div>
          <div className="px-[22px] py-[22px] flex flex-col gap-[20px]">
            <div className="grid gap-[18px_20px]" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className={fieldCls}>
                <label className={labelCls}>Page ID</label>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--chrome-muted)', wordBreak: 'break-all' }}>
                  {page.id}
                </code>
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>URL slug</label>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--chrome-muted)' }}>
                  /{page.slug || ''}
                </code>
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>Created</label>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--chrome-muted)' }}>
                  {new Date(page.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className={fieldCls}>
                <label className={labelCls}>Last updated</label>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--chrome-muted)' }}>
                  {new Date(page.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Danger zone card ── */}
        <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
          <div className="px-[22px] py-[18px] border-b border-[var(--c-card-border)]">
            <h3 className="font-heading font-normal text-[19px] m-0 text-primary">Danger zone</h3>
          </div>
          <div className="px-[22px] py-[22px] flex flex-col gap-[20px]">
            <div className="flex items-center justify-between gap-[20px]">
              <div>
                <h4 style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, margin: '0 0 3px', color: 'var(--color-text)' }}>Delete this page</h4>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--chrome-muted)', margin: 0 }}>Permanently removes the page and all its blocks. This cannot be undone.</p>
              </div>
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={async () => {
                  if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return
                  await fetch(`/api/admin/pages/${page.id}`, {
                    method: 'DELETE',
                    headers: { 'x-requested-with': 'XMLHttpRequest' },
                  })
                  window.location.href = '/admin/pages'
                }}
              >
                Delete page
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
