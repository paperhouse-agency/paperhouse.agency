'use client'

import { useState } from 'react'
import { getBlockEntry } from '@/libs/cms/block-registry'
import type { FieldDef } from '@/libs/cms/block-registry'
import { useEditorStore } from '@/libs/cms/editor-store'
import type { BlockData } from '@/libs/cms/types'

export function BlockFieldsPanel({ block }: { block: BlockData }) {
  const { updateBlock } = useEditorStore()
  const entry = getBlockEntry(block._type)
  if (!entry) return <p className="f-empty">Unknown block type: {block._type}</p>
  if (entry.fields.length === 0) return <p className="f-empty">This block has no configurable fields.</p>

  function getNestedValue(obj: Record<string, unknown>, path: string[]): unknown {
    return path.reduce((acc, key) => (acc as Record<string, unknown>)?.[key], obj as unknown)
  }

  function setNestedValue(obj: Record<string, unknown>, path: string[], value: unknown): Record<string, unknown> {
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
    <div className="f-grid">
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
  const isFullSpan = field.span === 'full' || ['textarea', 'array', 'image', 'blocks'].includes(field.type)
  return (
    <div className={isFullSpan ? 'f-group f-group-full' : 'f-group'}>
      {children}
    </div>
  )
}

function FieldLabel({ field, htmlFor }: { field: FieldDef; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="f-label">
      {field.label}
      {field.required && <span className="f-required">*</span>}
    </label>
  )
}

function FieldDescription({ field }: { field: FieldDef }) {
  if (!field.description) return null
  return <p className="f-desc">{field.description}</p>
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
            className={isEmpty ? 'f-input-error' : ''}
          />
          <FieldDescription field={field} />
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
            className={isEmpty ? 'f-input-error' : ''}
          />
          <FieldDescription field={field} />
        </>
      )

    case 'boolean':
      return (
        <div className="f-toggle-wrap">
          <input
            type="checkbox"
            id={fieldId}
            className="f-toggle"
            checked={(value as boolean) ?? false}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label htmlFor={fieldId} className="f-toggle-label">{field.label}</label>
          {field.description && <span className="f-desc" style={{ marginTop: 0 }}>{field.description}</span>}
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
            className={isEmpty ? 'f-input-error' : ''}
          >
            <option value="">— Select —</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <FieldDescription field={field} />
        </>
      )

    case 'icon':
      return (
        <>
          <FieldLabel field={field} htmlFor={fieldId} />
          <div className="f-icon-wrap">
            <input
              id={fieldId}
              type="text"
              value={(value as string) ?? ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder ?? 'e.g. Star, ArrowRight'}
              className={isEmpty ? 'f-input-error' : ''}
            />
          </div>
          <p className="f-desc">Lucide icon name in PascalCase</p>
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
          <FieldDescription field={field} />
        </>
      )

    case 'array':
      return (
        <>
          <FieldLabel field={field} htmlFor={fieldId} />
          <FieldDescription field={field} />
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
        <p className="f-desc" style={{ fontStyle: 'italic' }}>{field.label} — nested block editing coming soon.</p>
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
    <div className="f-array">
      {items.length === 0 && (
        <p className="f-array-empty">No items yet.</p>
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
      <button type="button" className="f-array-add" onClick={addItem}>
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
    <div className="f-array-item">
      <div className="f-array-header">
        <button type="button" className="f-array-toggle" onClick={() => setOpen(!open)}>
          <span className="f-array-chevron">{open ? '▾' : '▸'}</span>
          <span className="f-array-num">
            {index + 1}
            {preview && <span className="f-array-preview"> — {preview}</span>}
          </span>
        </button>
        <div className="f-array-actions">
          <button type="button" title="Move up" disabled={index === 0} onClick={() => onMove(index, index - 1)}>↑</button>
          <button type="button" title="Move down" disabled={index === total - 1} onClick={() => onMove(index, index + 1)}>↓</button>
          <button type="button" title="Remove" className="f-array-remove" onClick={onRemove}>×</button>
        </div>
      </div>

      {open && (
        <div className="f-array-body">
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
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const res = await fetch('/api/admin/images', {
      method: 'POST',
      headers: { 'Content-Type': file.type, 'x-filename': file.name, 'x-requested-with': 'XMLHttpRequest' },
      body: file,
    })
    const data = (await res.json()) as { url?: string }
    setUploading(false)
    if (res.ok && data.url) onChange(data.url, alt)
  }

  return (
    <div className="f-image">
      <div className="f-image-thumb">
        {src
          // biome-ignore lint/performance/noImgElement: admin-only thumbnail
          ? <img src={src} alt={alt} />
          : <span>No image</span>
        }
      </div>
      <div className="f-image-inputs">
        <input
          type="url"
          value={src}
          onChange={(e) => onChange(e.target.value, alt)}
          placeholder="Image URL"
        />
        <input
          type="text"
          value={alt}
          onChange={(e) => onChange(src, e.target.value)}
          placeholder="Alt text"
        />
        <label className="f-image-upload">
          {uploading ? 'Uploading…' : 'Upload file'}
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="f-file-hidden" />
        </label>
      </div>
    </div>
  )
}
