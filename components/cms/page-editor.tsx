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
      <div className="cms-editor-shell">

        {/* Floating sidebar collapse/expand button — anchored to shell */}
        <button
          type="button"
          className="cms-sidebar-float-btn"
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
          className={`cms-editor-sidebar${sidebarOpen ? '' : ' cms-editor-sidebar--collapsed'}`}
          style={sidebarOpen ? { width: sidebarWidth } : undefined}
        >
          {sidebarOpen && <>
          <div className="cms-sidebar-top">
            <div className="cms-sidebar-title-row">
              <span className="cms-mono-label">Blocks</span>
            </div>
            <p className="cms-sidebar-desc">Drag a block onto the page.</p>
            <div className="cms-sidebar-search">
              <span style={{ flex: 'none', opacity: 0.5, lineHeight: 1, fontSize: 14 }}>⌕</span>
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search blocks…"
              />
            </div>
          </div>

          <div className="cms-sidebar-blocks">
            {filteredPalette.length === 0 && (
              <p className="cms-sidebar-empty">No blocks match "{sidebarSearch}".</p>
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
          <div className="cms-resize-handle" onMouseDown={startSidebarResize} />
        )}

        {/* ── Right canvas ── */}
        <div className="cms-canvas">

          {/* Page header */}
          <div className="cms-page-header">
            <div>
              <div className="cms-breadcrumb">
                <Link href="/admin/pages" className="cms-breadcrumb-link">Pages</Link>
                <span className="cms-breadcrumb-sep">›</span>
                <span className="cms-breadcrumb-current">{page.title || 'Untitled'}</span>
              </div>

              <div className="cms-ph-title-row">
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

                <span className={`cms-badge cms-badge-${page.status === 'published' ? 'pub' : 'draft'}`}>
                  {page.status === 'published' ? 'Published' : 'Draft'}
                </span>

                {isHomepage && (
                  <span className="cms-badge cms-badge-home">Homepage</span>
                )}
              </div>

              <div className="cms-ph-meta">
                {isHomepage ? (
                  <span className="cms-mono">/</span>
                ) : (
                  <div className="cms-slug-row">
                    <span className="cms-slug-seg">/</span>
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
                      className={`cms-slug-input${slugError ? ' cms-slug-input--error' : ''}`}
                    />
                    {slugError && (
                      <span className="cms-slug-error">{slugError}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="cms-header-actions">
              <div className="cms-header-action-row">
                {/* Undo / Redo */}
                <button
                  type="button"
                  className="cms-icon-btn"
                  disabled={!canUndo}
                  onClick={undo}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 size={15} />
                </button>
                <button
                  type="button"
                  className="cms-icon-btn"
                  disabled={!canRedo}
                  onClick={redo}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo2 size={15} />
                </button>

                <span className="cms-divider" />

                {/* Save status + button */}
                <span className="cms-save-status">
                  {isSaving && <span className="cms-save-saving">Saving…</span>}
                  {!isSaving && saveError && <span className="cms-save-error">{saveError}</span>}
                  {!(isSaving || saveError ) && isDirty && (
                    <span className="cms-save-dirty">● Unsaved</span>
                  )}
                  {!((isSaving || saveError ) || isDirty ) && lastSaved && (
                    <span className="cms-save-ok">✓ Saved</span>
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

                <span className="cms-divider" />

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
              <div className="cms-header-action-row">
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
                <label className="cms-homepage-row">
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
                  <span className="cms-toggle-label">Set as homepage</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="cms-tabs">
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
                className={`cms-tab${activeTab === id ? ' active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                {label}
                {count !== null && (
                  <span className="cms-tab-count">{count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Blocks tab ── */}
          {activeTab === 'blocks' && (
            <div className="cms-tab-body">
              <SortableContext
                items={page.blocks.map((b) => b._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="cms-blocks-layout">
                  {page.blocks.length === 0 && (
                    <div className="cms-drop-zone">
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
          <div className="cms-resize-handle" onMouseDown={startPreviewResize} />
        )}

        {activeTab === 'blocks' && previewOpen && (
          <div className="cms-preview-panel" style={{ width: previewWidth }}>
            <div className="cms-preview-panel-header">
              <span className="cms-mono-label">Preview</span>
              <button
                type="button"
                className="cms-sidebar-collapse-btn"
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
          <div className="cms-palette-item cms-palette-item--dragging">
            <span className="cms-palette-grip">⠿</span>
            <span className="cms-palette-icon-wrap" />
            <span className="cms-palette-name">{activePaletteEntry.label}</span>
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
      className="cms-palette-item"
      style={{ opacity: isDragging ? 0.35 : 1 }}
      onClick={onAdd}
      {...listeners}
      {...attributes}
    >
      <span className="cms-palette-grip">⠿</span>
      <span className="cms-palette-icon-wrap" style={{ fontSize: 14 }}>
        {entry.icon ? '◈' : '▣'}
      </span>
      <span className="cms-palette-name">{entry.label}</span>
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
      <div className={`cms-block-card${isSelected ? ' cms-block-card--selected' : ''}`}>
        {/* Card header — click to expand/collapse */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: dnd-kit sortable wrapper */}
        {/* biome-ignore lint/a11y/useSemanticElements: sortable requires div */}
        <div
          className="cms-block-card-header"
          onClick={onSelect}
          onKeyDown={(e) => e.key === 'Enter' && onSelect()}
          role="button"
          tabIndex={0}
        >
          <div className="cms-block-card-left">
            {/* biome-ignore lint/a11y/noStaticElementInteractions: dnd-kit */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: dnd-kit */}
            <span
              className="cms-block-drag"
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
            >
              ⠿
            </span>

            <span
              className={`cms-block-icon${isSelected ? ' cms-block-icon--active' : ''}`}
            >
              ▣
            </span>

            <div className="cms-block-info">
              <span className="cms-block-name">{entry?.label ?? block._type}</span>
              <span className="cms-block-num">Block {String(index + 1).padStart(2, '0')}</span>
            </div>
          </div>

          <div
            className="cms-block-card-actions"
            // stop propagation so clicks on action buttons don't toggle selection
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="cms-block-action"
              title={isVisible ? 'Hide block' : 'Show block'}
              onClick={onToggleVisible}
              style={{ fontSize: 14 }}
            >
              {isVisible ? '◉' : '○'}
            </button>
            <button
              type="button"
              className="cms-block-action"
              title="Duplicate"
              onClick={onDuplicate}
              style={{ fontSize: 13 }}
            >
              ⎘
            </button>
            <button
              type="button"
              className="cms-block-action cms-block-action--danger"
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
          <div className="cms-block-form">
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

  return (
    <div className="cms-tab-body">
      <div className="cms-seo-layout">
        {/* Left: form */}
        <div className="cms-card">
          <div className="cms-card-header">
            <h3 className="cms-card-title">Search engine optimization</h3>
            <p className="cms-card-sub">How this page appears in search results and when shared.</p>
          </div>
          <div className="cms-card-body">
            <div className="cms-field cms-field-full">
              <div className="cms-field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Meta title <span className="cms-field-req">*</span></span>
                <span className={`cms-char-meter${metaTitle.length > 60 ? ' cms-char-meter--over' : ''}`}>
                  {metaTitle.length} / 60
                </span>
              </div>
              <input
                type="text"
                className="cms-input cms-input--sm"
                value={metaTitle}
                onChange={(e) => updateSeo({ title: e.target.value })}
                placeholder="Page title for search engines"
              />
            </div>

            <div className="cms-field cms-field-full">
              <div className="cms-field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Meta description</span>
                <span className={`cms-char-meter${metaDesc.length > 160 ? ' cms-char-meter--over' : ''}`}>
                  {metaDesc.length} / 160
                </span>
              </div>
              <textarea
                className="cms-textarea cms-textarea--sm"
                value={metaDesc}
                onChange={(e) => updateSeo({ description: e.target.value })}
                placeholder="Short description for search results"
                rows={3}
              />
            </div>

            <div className="cms-field cms-field-full">
              <label className="cms-field-label">Keywords</label>
              <input
                type="text"
                className="cms-input cms-input--sm"
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
              <span className="cms-field-hint">Comma-separated keywords</span>
            </div>

            {/* OG image if available */}
            <div className="cms-field cms-field-full">
              <label className="cms-field-label">Social share image (OG)</label>
              <input
                type="url"
                className="cms-input cms-input--sm cms-input--mono"
                value={seo.ogImage ?? ''}
                onChange={(e) => updateSeo({ ogImage: e.target.value })}
                placeholder="https://example.com/og-image.jpg"
              />
              <span className="cms-field-hint">Recommended 1200 × 630 px</span>
            </div>

            {/* Search indexing toggle */}
            <div className="cms-toggle-row">
              <div>
                <div className="cms-indexing-title" style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500 }}>
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
            <div className="cms-mono-label">Search result preview</div>
            <div className="cms-google-preview">
              <div className="cms-google-domain-row">
                <span className="cms-google-favicon">p</span>
                <div>
                  <div className="cms-google-site-name">PaperHouse</div>
                  <div className="cms-google-url">
                    https://paperhouse.agency/{page.slug || ''}
                  </div>
                </div>
              </div>
              <div className="cms-google-title">
                {metaTitle || page.title || 'Page title'}
              </div>
              <div className="cms-google-desc">
                {metaDesc || 'Add a meta description to preview how this page appears in search results.'}
              </div>
            </div>
          </div>

          <div>
            <div className="cms-mono-label">Social card</div>
            <div className="cms-social-card">
              <div className="cms-social-img">
                {seo.ogImage ? (
                  // biome-ignore lint/performance/noImgElement: admin-only preview
                  <img src={seo.ogImage} alt="" />
                ) : (
                  <span>No OG image set</span>
                )}
              </div>
              <div className="cms-social-body">
                <div className="cms-social-domain">paperhouse.agency</div>
                <div className="cms-social-title">{metaTitle || page.title}</div>
                <div className="cms-social-desc">{metaDesc}</div>
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

  return (
    <div className="cms-tab-body">
      <div className="cms-settings-layout">

        {/* ── Page settings card ── */}
        <div className="cms-card">
          <div className="cms-card-header">
            <h3 className="cms-card-title">Page settings</h3>
            <p className="cms-card-sub">Placement, visibility and authorship for this page.</p>
          </div>
          <div className="cms-card-body">

            {/* 2-col grid */}
            <div className="cms-settings-grid">

              {/* Status (read-only — use Publish toggle below) */}
              <div className="cms-field">
                <label className="cms-field-label">Status</label>
                <span
                  className={`cms-badge cms-badge-${page.status === 'published' ? 'pub' : 'draft'}`}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {page.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Visibility */}
              <div className="cms-field">
                <label htmlFor="settings-visibility" className="cms-field-label">Visibility</label>
                <select
                  id="settings-visibility"
                  className="cms-select cms-select--sm"
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
              <div className="cms-field">
                <label htmlFor="settings-parent" className="cms-field-label">Parent page</label>
                <select
                  id="settings-parent"
                  className="cms-select cms-select--sm"
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
              <div className="cms-field">
                <label htmlFor="settings-template" className="cms-field-label">Template</label>
                <select
                  id="settings-template"
                  className="cms-select cms-select--sm"
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
              <div className="cms-field">
                <label htmlFor="settings-author" className="cms-field-label">Author</label>
                {authors.length > 0 ? (
                  <select
                    id="settings-author"
                    className="cms-select cms-select--sm"
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
                    className="cms-input cms-input--sm"
                    value={s.author ?? ''}
                    onChange={(e) => updateSettings({ author: e.target.value || undefined })}
                    placeholder="Author name"
                  />
                )}
              </div>

              {/* Language */}
              <div className="cms-field">
                <label htmlFor="settings-language" className="cms-field-label">Language</label>
                <select
                  id="settings-language"
                  className="cms-select cms-select--sm"
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
            <div className="cms-field">
              <label className="cms-field-label">First published</label>
              <input
                type="text"
                className="cms-input cms-input--sm cms-input--mono"
                value={formatPublishedAt(s.publishedAt)}
                readOnly
                placeholder="Not yet published"
                style={{ color: s.publishedAt ? 'var(--color-text)' : 'var(--chrome-faint)' }}
              />
              <span className="cms-field-hint">Set automatically when this page is first published.</span>
            </div>

            {/* Set as homepage toggle */}
            <div className="cms-toggle-row">
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
            <div className="cms-toggle-row">
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
        <div className="cms-card">
          <div className="cms-card-header">
            <h3 className="cms-card-title">Page info</h3>
          </div>
          <div className="cms-card-body">
            <div className="cms-settings-grid">
              <div className="cms-field">
                <label className="cms-field-label">Page ID</label>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--chrome-muted)', wordBreak: 'break-all' }}>
                  {page.id}
                </code>
              </div>
              <div className="cms-field">
                <label className="cms-field-label">URL slug</label>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--chrome-muted)' }}>
                  /{page.slug || ''}
                </code>
              </div>
              <div className="cms-field">
                <label className="cms-field-label">Created</label>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--chrome-muted)' }}>
                  {new Date(page.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="cms-field">
                <label className="cms-field-label">Last updated</label>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--chrome-muted)' }}>
                  {new Date(page.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Danger zone card ── */}
        <div className="cms-card">
          <div className="cms-card-header">
            <h3 className="cms-card-title" style={{ color: 'var(--color-primary)' }}>Danger zone</h3>
          </div>
          <div className="cms-card-body">
            <div className="cms-danger-row">
              <div className="cms-danger-text">
                <h4>Delete this page</h4>
                <p>Permanently removes the page and all its blocks. This cannot be undone.</p>
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
