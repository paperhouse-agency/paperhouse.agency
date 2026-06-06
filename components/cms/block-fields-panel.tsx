'use client'

import { useState } from 'react'
import { MediaPickerModal } from './media-picker-modal'
import type { MediaAsset } from './media-manager'
import { getBlockEntry } from '@/libs/cms/block-registry'
import type { FieldDef } from '@/libs/cms/block-registry'
import { useEditorStore } from '@/libs/cms/editor-store'
import type { BlockData } from '@/libs/cms/types'

export function BlockFieldsPanel({ block }: { block: BlockData }) {
  const { updateBlock } = useEditorStore()
  const entry = getBlockEntry(block._type)
  if (!entry) {
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--chrome-muted)', fontStyle: 'italic' }}>
        Unknown block type: {block._type}
      </p>
    )
  }
  if (entry.fields.length === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--chrome-muted)', fontStyle: 'italic' }}>
        This block has no configurable fields.
      </p>
    )
  }

  function getNestedValue(obj: Record<string, unknown>, path: string[]): unknown {
    return path.reduce((acc, key) => (acc as Record<string, unknown>)?.[key], obj as unknown)
  }

  function setNestedValue(
    obj: Record<string, unknown>,
    path: string[],
    value: unknown,
  ): Record<string, unknown> {
    const [head, ...rest] = path
    if (rest.length === 0) return { ...obj, [head]: value }
    return { ...obj, [head]: setNestedValue((obj[head] as Record<string, unknown>) ?? {}, rest, value) }
  }

  function handleChange(key: string, value: unknown) {
    const parts = key.split('.')
    if (parts.length === 1) {
      updateBlock(block._id, { [key]: value } as Partial<BlockData>)
    } else {
      const updated = setNestedValue(block as unknown as Record<string, unknown>, parts, value)
      updateBlock(block._id, updated as Partial<BlockData>)
    }
  }

  function getValue(key: string): unknown {
    return getNestedValue(block as unknown as Record<string, unknown>, key.split('.'))
  }

  return (
    <div className="cms-field-grid">
      {entry.fields.map((field) => (
        <FieldGroup key={field.key} field={field}>
          <FieldEditor
            field={field}
            value={getValue(field.key)}
            blockId={block._id}
            onChange={(v) => handleChange(field.key, v)}
          />
        </FieldGroup>
      ))}
    </div>
  )
}

function FieldGroup({ field, children }: { field: FieldDef; children: React.ReactNode }) {
  const isFullSpan =
    field.span === 'full' || ['textarea', 'array', 'image', 'blocks'].includes(field.type)
  return (
    <div className={`cms-field${isFullSpan ? ' cms-field-full' : ''}`}>
      {children}
    </div>
  )
}

function FieldLabel({ field, htmlFor }: { field: FieldDef; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="cms-field-label">
      {field.label}
      {field.required && <span className="cms-field-req">*</span>}
    </label>
  )
}

function FieldHint({ field }: { field: FieldDef }) {
  if (!field.description) return null
  return <span className="cms-field-hint">{field.description}</span>
}

function FieldEditor({
  field,
  value,
  blockId,
  onChange,
}: {
  field: FieldDef
  value: unknown
  blockId: string
  onChange: (v: unknown) => void
}) {
  const fieldId = `${blockId}-${field.key}`
  const isEmpty = field.required && !value

  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <>
          <FieldLabel field={field} htmlFor={fieldId} />
          <input
            id={fieldId}
            type={field.type === 'url' ? 'url' : 'text'}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`cms-input cms-input--sm${isEmpty ? ' cms-input--error' : ''}`}
          />
          <FieldHint field={field} />
        </>
      )

    case 'textarea':
      return (
        <>
          <FieldLabel field={field} htmlFor={fieldId} />
          <textarea
            id={fieldId}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`cms-textarea cms-textarea--sm${isEmpty ? ' cms-input--error' : ''}`}
          />
          <FieldHint field={field} />
        </>
      )

    case 'boolean':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
          <input
            type="checkbox"
            id={fieldId}
            className="cms-toggle"
            checked={(value as boolean) ?? false}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label
            htmlFor={fieldId}
            style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--color-text)', cursor: 'pointer' }}
          >
            {field.label}
          </label>
          {field.description && (
            <span className="cms-field-hint">{field.description}</span>
          )}
        </div>
      )

    case 'select':
      return (
        <>
          <FieldLabel field={field} htmlFor={fieldId} />
          <select
            id={fieldId}
            value={(value as string) ?? field.defaultValue ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className={`cms-select cms-select--sm${isEmpty ? ' cms-input--error' : ''}`}
          >
            <option value="">— Select —</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldHint field={field} />
        </>
      )

    case 'icon':
      return (
        <>
          <FieldLabel field={field} htmlFor={fieldId} />
          <input
            id={fieldId}
            type="text"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? 'e.g. Star, ArrowRight'}
            className={`cms-input cms-input--sm${isEmpty ? ' cms-input--error' : ''}`}
          />
          <span className="cms-field-hint">Lucide icon name in PascalCase</span>
        </>
      )

    case 'image':
      return (
        <>
          <FieldLabel field={field} htmlFor={fieldId} />
          <ImageField
            src={(value as { src: string; alt: string })?.src ?? ''}
            alt={(value as { src: string; alt: string })?.alt ?? ''}
            onChange={(src, alt) => onChange({ src, alt })}
          />
          <FieldHint field={field} />
        </>
      )

    case 'array':
      return (
        <>
          <FieldLabel field={field} htmlFor={fieldId} />
          <FieldHint field={field} />
          <ArrayField
            field={field}
            items={(value as Record<string, unknown>[]) ?? []}
            blockId={blockId}
            onChange={onChange}
          />
        </>
      )

    case 'blocks':
      return (
        <p className="cms-field-hint" style={{ fontStyle: 'italic' }}>
          {field.label} — nested block editing coming soon.
        </p>
      )

    default:
      return null
  }
}

function ArrayField({
  field,
  items,
  blockId,
  onChange,
}: {
  field: FieldDef
  items: Record<string, unknown>[]
  blockId: string
  onChange: (v: unknown) => void
}) {
  function move(from: number, to: number) {
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  function remove(i: number) {
    const next = [...items]
    next.splice(i, 1)
    onChange(next)
  }

  function addItem() {
    const newItem: Record<string, unknown> = { _id: crypto.randomUUID() }
    field.fields?.forEach((f) => {
      if (f.type === 'boolean') newItem[f.key] = false
      else if (f.type === 'image') newItem[f.key] = { src: '', alt: '' }
      else newItem[f.key] = f.defaultValue ?? ''
    })
    onChange([...items, newItem])
  }

  return (
    <div className="cms-array">
      {items.length === 0 && (
        <p className="cms-array-empty">No items yet.</p>
      )}
      {items.map((item, i) => (
        <ArrayItem
          key={(item._id as string) ?? `${blockId}-${field.key}-${i}`}
          item={item}
          index={i}
          total={items.length}
          subFields={field.fields ?? []}
          blockId={`${blockId}-${field.key}-${i}`}
          onMove={move}
          onRemove={() => remove(i)}
          onChange={(updated) => {
            const next = [...items]
            next[i] = updated
            onChange(next)
          }}
        />
      ))}
      <button type="button" className="cms-array-add" onClick={addItem}>
        + Add {field.label}
      </button>
    </div>
  )
}

function ArrayItem({
  item,
  index,
  total,
  subFields,
  blockId,
  onMove,
  onRemove,
  onChange,
}: {
  item: Record<string, unknown>
  index: number
  total: number
  subFields: FieldDef[]
  blockId: string
  onMove: (from: number, to: number) => void
  onRemove: () => void
  onChange: (updated: Record<string, unknown>) => void
}) {
  const [open, setOpen] = useState(true)
  const preview = getItemPreview(item, subFields)

  return (
    <div className="cms-array-item">
      <div className="cms-array-header">
        <button
          type="button"
          className="cms-array-toggle"
          onClick={() => setOpen(!open)}
        >
          <span className="cms-array-chevron">{open ? '▾' : '▸'}</span>
          <span className="cms-array-num">Item {index + 1}</span>
          {preview && (
            <span className="cms-array-preview-text"> — {preview}</span>
          )}
        </button>
        <div className="cms-array-actions">
          <button
            type="button"
            className="cms-array-btn"
            title="Move up"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
          >
            ↑
          </button>
          <button
            type="button"
            className="cms-array-btn"
            title="Move down"
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
          >
            ↓
          </button>
          <button
            type="button"
            className="cms-array-btn cms-array-btn--remove"
            title="Remove"
            onClick={onRemove}
          >
            ×
          </button>
        </div>
      </div>

      {open && (
        <div className="cms-array-body">
          {subFields.map((subField) => (
            <FieldGroup key={subField.key} field={subField}>
              <FieldEditor
                field={subField}
                value={item[subField.key]}
                blockId={blockId}
                onChange={(v) => onChange({ ...item, [subField.key]: v })}
              />
            </FieldGroup>
          ))}
        </div>
      )}
    </div>
  )
}

function getItemPreview(item: Record<string, unknown>, fields: FieldDef[]): string {
  const textField = fields.find((f) => f.type === 'text' && item[f.key])
  if (textField) return String(item[textField.key]).slice(0, 40)
  const nameField = ['name', 'label', 'heading', 'title', 'question'].find((k) => item[k])
  if (nameField) return String(item[nameField]).slice(0, 40)
  return ''
}

function ImageField({
  src,
  alt,
  onChange,
}: {
  src: string
  alt: string
  onChange: (src: string, alt: string) => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)

  function handleSelect(asset: MediaAsset) {
    onChange(asset.url, alt)
  }

  return (
    <>
      <div className="cms-image-field">
        <div className="cms-image-thumb">
          {src ? (
            // biome-ignore lint/performance/noImgElement: admin-only thumbnail
            <img src={src} alt={alt} />
          ) : (
            <span>No image</span>
          )}
        </div>
        <div className="cms-image-inputs">
          {src && (
            <p className="cms-image-url-preview" title={src}>
              {src.split('/').pop()}
            </p>
          )}
          <button
            type="button"
            className="cms-upload-btn"
            onClick={() => setPickerOpen(true)}
          >
            {src ? 'Change image' : 'Choose image'}
          </button>
          <input
            type="text"
            value={alt}
            onChange={(e) => onChange(src, e.target.value)}
            placeholder="Alt text"
            className="cms-input cms-input--sm"
          />
        </div>
      </div>
      {pickerOpen && (
        <MediaPickerModal
          currentUrl={src}
          onSelect={handleSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  )
}
