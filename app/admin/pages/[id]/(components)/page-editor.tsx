'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/components/link'
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
import type { BlockData, CmsPage } from '@/libs/cms/types'
import { BlockFieldsPanel } from './block-fields-panel'

export function PageEditor({ initialPage }: { initialPage: CmsPage }) {
  const {
    setPage,
    page,
    setTitle,
    setSlug,
    updateSeo,
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
    lastSaved,
    saveError,
    history,
    historyIndex,
  } = useEditorStore()

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'blocks' | 'seo'>('blocks')
  const [activeDragId, setActiveDragId] = useState<string | null>(null)

  useEffect(() => {
    setPage(initialPage)
  }, [initialPage, setPage])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 's') {
        e.preventDefault()
        if (saveTimer) clearTimeout(saveTimer)
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
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return
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

  if (!page) return <p>Loading…</p>

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDragId(null)

    const activeId = String(active.id)

    // Palette → canvas: drop to add a new block
    if (activeId.startsWith('palette-')) {
      const type = activeId.slice('palette-'.length)
      const entry = BLOCK_REGISTRY.find((e) => e.type === type)
      if (entry) {
        const block = entry.defaultData()
        addBlock(block)
        setSelectedBlockId(block._id)
      }
      return
    }

    // Block reorder
    if (!over || active.id === over.id || !page) return
    const oldIndex = page.blocks.findIndex((b) => b._id === active.id)
    const newIndex = page.blocks.findIndex((b) => b._id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderBlocks(arrayMove(page.blocks, oldIndex, newIndex))
    }
  }

  const canUndo = historyIndex >= 0 && history.length > 0
  const canRedo = historyIndex < history.length - 1
  const activePaletteEntry = activeDragId?.startsWith('palette-')
    ? BLOCK_REGISTRY.find((e) => e.type === activeDragId.slice('palette-'.length))
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="editor-grid">
        {/* Left: palette */}
        <div className="editor-palette">
          <h3>Blocks</h3>
          {BLOCK_REGISTRY.map((entry) => (
            <PaletteItem
              key={entry.type}
              entry={entry}
              onAdd={() => {
                const block = entry.defaultData()
                addBlock(block)
                setSelectedBlockId(block._id)
              }}
            />
          ))}
        </div>

        {/* Canvas */}
        <div className="editor-canvas">
          {/* Sticky page meta bar */}
          <div className="editor-canvas-meta">
            <div className="editor-meta-row">
              <input
                type="text"
                value={page.title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title"
                className="editor-meta-title"
              />
              <div className="editor-meta-actions">
                <span className="editor-save-status">
                  {isSaving && <span className="editor-save-saving">Saving…</span>}
                  {!isSaving && lastSaved && <span className="editor-save-ok">Saved {lastSaved.toLocaleTimeString()}</span>}
                  {saveError && <span className="editor-save-error">{saveError}</span>}
                </span>
                <button type="button" className="editor-meta-icon-btn" disabled={!canUndo} onClick={undo} title="Undo (Ctrl+Z)">↩</button>
                <button type="button" className="editor-meta-icon-btn" disabled={!canRedo} onClick={redo} title="Redo (Ctrl+Shift+Z)">↪</button>
                <span className={`admin-badge admin-badge-${page.status}`}>{page.status}</span>
                <button
                  type="button"
                  data-variant={page.status === 'draft' ? 'primary' : 'secondary'}
                  style={{ padding: '4px 12px', fontSize: '12px' }}
                  onClick={toggleStatus}
                >
                  {page.status === 'draft' ? 'Publish' : 'Unpublish'}
                </button>
                <Link
                  href={`/${page.slug}`}
                  className="editor-meta-preview"
                >
                  Preview ↗
                </Link>
              </div>
            </div>
            <div className="editor-meta-slug">
              <span className="admin-slug">/</span>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug"
                className="admin-slug editor-slug-input"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="editor-tabs">
            <button type="button" className={`editor-tab${activeTab === 'blocks' ? ' active' : ''}`} onClick={() => setActiveTab('blocks')}>Blocks</button>
            <button type="button" className={`editor-tab${activeTab === 'seo' ? ' active' : ''}`} onClick={() => setActiveTab('seo')}>SEO</button>
          </div>

          {/* Block list with inline collapsible fields */}
          {activeTab === 'blocks' && (
            <div className="editor-block-list">
              {page.blocks.length === 0 ? (
                <p style={{ padding: '1.5rem', color: '#aaa', textAlign: 'center', margin: 0 }}>
                  No blocks yet — drag one from the left panel or click to add.
                </p>
              ) : (
                <SortableContext items={page.blocks.map((b) => b._id)} strategy={verticalListSortingStrategy}>
                  {page.blocks.map((block) => (
                    <SortableBlockItem
                      key={block._id}
                      block={block}
                      isSelected={block._id === selectedBlockId}
                      onSelect={() => setSelectedBlockId(block._id === selectedBlockId ? null : block._id)}
                      onRemove={() => {
                        removeBlock(block._id)
                        if (selectedBlockId === block._id) setSelectedBlockId(null)
                      }}
                      onDuplicate={() => duplicateBlock(block._id)}
                      onToggleVisible={() => updateBlock(block._id, { visible: !(block.visible ?? true) })}
                    />
                  ))}
                </SortableContext>
              )}
            </div>
          )}

          {/* SEO tab */}
          {activeTab === 'seo' && (
            <div className="admin-card" style={{ borderRadius: '0 0 6px 6px', borderTop: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row">
                <label htmlFor="seo-title">SEO Title</label>
                <input id="seo-title" type="text" value={page.seo.title ?? ''} onChange={(e) => updateSeo({ title: e.target.value })} />
              </div>
              <div className="form-row">
                <label htmlFor="seo-desc">Description</label>
                <textarea id="seo-desc" value={page.seo.description ?? ''} onChange={(e) => updateSeo({ description: e.target.value })} rows={3} />
              </div>
              <div className="form-row">
                <label htmlFor="seo-keywords">Keywords (comma-separated)</label>
                <input id="seo-keywords" type="text" value={(page.seo.keywords ?? []).join(', ')} onChange={(e) => updateSeo({ keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) })} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input id="seo-noindex" type="checkbox" style={{ width: 'auto' }} checked={page.seo.noIndex ?? false} onChange={(e) => updateSeo({ noIndex: e.target.checked })} />
                <label htmlFor="seo-noindex" style={{ textTransform: 'none', letterSpacing: 0, fontSize: '13px', color: '#444', marginBottom: 0 }}>No index</label>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Drag overlay for palette items */}
      <DragOverlay>
        {activePaletteEntry && (
          <div className="editor-palette-btn editor-palette-btn--dragging">
            {activePaletteEntry.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

// Module-level reference to saveTimer so the keydown handler can cancel it
const saveTimer: ReturnType<typeof setTimeout> | null = null

function PaletteItem({
  entry,
  onAdd,
}: {
  entry: { type: string; label: string; defaultData: () => BlockData }
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
      className="editor-palette-btn"
      style={{ opacity: isDragging ? 0.35 : 1 }}
      onClick={onAdd}
      {...listeners}
      {...attributes}
    >
      <span className="editor-palette-icon">⠿</span>
      <span>{entry.label}</span>
    </div>
  )
}

function SortableBlockItem({
  block,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleVisible,
}: {
  block: BlockData
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onDuplicate: () => void
  onToggleVisible: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block._id })
  const entry = BLOCK_REGISTRY.find((e) => e.type === block._type)
  const isVisible = block.visible ?? true

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
    >
      {/* Block row */}
      {/* biome-ignore lint/a11y/useSemanticElements: dnd-kit sortable wrapper prevents using <button> here */}
      <div
        className={`editor-block-item${isSelected ? ' selected' : ''}`}
        style={{ opacity: isVisible ? 1 : 0.45 }}
        onClick={onSelect}
        onKeyDown={(e) => e.key === 'Enter' && onSelect()}
        role="button"
        tabIndex={0}
      >
        {/* biome-ignore lint/a11y/noStaticElementInteractions: dnd-kit */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: dnd-kit */}
        <span {...attributes} {...listeners} className="editor-block-drag" onClick={(e) => e.stopPropagation()}>⠿</span>
        <span className="editor-block-label">{entry?.label ?? block._type}</span>
        <div className="editor-block-actions">
          <button type="button" title="Duplicate" onClick={(e) => { e.stopPropagation(); onDuplicate() }}>⎘</button>
          <button type="button" title={isVisible ? 'Hide block' : 'Show block'} onClick={(e) => { e.stopPropagation(); onToggleVisible() }}>{isVisible ? '◉' : '○'}</button>
          <button type="button" title="Remove block" onClick={(e) => { e.stopPropagation(); onRemove() }}>×</button>
        </div>
      </div>

      {/* Inline collapsible fields */}
      {isSelected && (
        <div className="editor-block-fields">
          <BlockFieldsPanel block={block} />
        </div>
      )}
    </div>
  )
}
