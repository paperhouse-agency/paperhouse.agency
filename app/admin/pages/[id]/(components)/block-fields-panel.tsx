'use client'

import { useState } from 'react'
import { getBlockEntry } from '@/libs/cms/block-registry'
import type { FieldDef } from '@/libs/cms/block-registry'
import { useEditorStore } from '@/libs/cms/editor-store'
import type { BlockData } from '@/libs/cms/types'

export function BlockFieldsPanel({ block }: { block: BlockData }) {
  const { updateBlock } = useEditorStore()
  const entry = getBlockEntry(block._type)
  if (!entry) return <p>Unknown block type: {block._type}</p>

  function setNestedValue(obj: Record<string, unknown>, path: string[], value: unknown): Record<string, unknown> {
    const [head, ...rest] = path
    if (rest.length === 0) return { ...obj, [head]: value }
    return {
      ...obj,
      [head]: setNestedValue((obj[head] as Record<string, unknown>) ?? {}, rest, value),
    }
  }

  function getNestedValue(obj: Record<string, unknown>, path: string[]): unknown {
    return path.reduce((acc, key) => (acc as Record<string, unknown>)?.[key], obj as unknown)
  }

  function handleChange(key: string, value: unknown) {
    const parts = key.split('.')
    if (parts.length === 1) {
      updateBlock(block._id, { [key]: value } as Partial<BlockData>)
    } else {
      const blockObj = block as unknown as Record<string, unknown>
      const updated = setNestedValue(blockObj, parts, value)
      updateBlock(block._id, updated as Partial<BlockData>)
    }
  }

  function getValue(key: string): unknown {
    const parts = key.split('.')
    return getNestedValue(block as unknown as Record<string, unknown>, parts)
  }

  return (
    <div>
      {entry.fields.map((field) => (
        <FieldEditor
          key={field.key}
          field={field}
          value={getValue(field.key)}
          blockId={block._id}
          onChange={(v) => handleChange(field.key, v)}
        />
      ))}
    </div>
  )
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
  const inputStyle = {
    width: '100%',
    padding: '0.3rem',
    fontFamily: 'monospace',
    fontSize: '13px',
    boxSizing: 'border-box' as const,
  }

  const fieldId = `${blockId}-${field.key}`

  switch (field.type) {
    case 'text':
    case 'url': {
      const isEmpty = field.required && !(value as string)
      return (
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor={fieldId} style={{ fontSize: '12px', display: 'block', marginBottom: '0.2rem' }}>
            {field.label}
            {field.required && <span style={{ color: '#c0392b', marginLeft: '2px' }}>*</span>}
          </label>
          <input
            id={fieldId}
            type={field.type === 'url' ? 'url' : 'text'}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            style={{ ...inputStyle, ...(isEmpty ? { borderColor: '#c0392b' } : {}) }}
          />
        </div>
      )
    }

    case 'textarea': {
      const isEmpty = field.required && !(value as string)
      return (
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor={fieldId} style={{ fontSize: '12px', display: 'block', marginBottom: '0.2rem' }}>
            {field.label}
            {field.required && <span style={{ color: '#c0392b', marginLeft: '2px' }}>*</span>}
          </label>
          <textarea
            id={fieldId}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', ...(isEmpty ? { borderColor: '#c0392b' } : {}) }}
          />
        </div>
      )
    }

    case 'boolean':
      return (
        <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id={fieldId}
            checked={(value as boolean) ?? false}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label htmlFor={fieldId} style={{ fontSize: '12px' }}>{field.label}</label>
        </div>
      )

    case 'select': {
      const isEmpty = field.required && !(value as string)
      return (
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor={fieldId} style={{ fontSize: '12px', display: 'block', marginBottom: '0.2rem' }}>
            {field.label}
            {field.required && <span style={{ color: '#c0392b', marginLeft: '2px' }}>*</span>}
          </label>
          <select
            id={fieldId}
            value={(value as string) ?? field.defaultValue ?? ''}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...inputStyle, ...(isEmpty ? { borderColor: '#c0392b' } : {}) }}
          >
            <option value="">— Select —</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )
    }

    case 'icon': {
      const isEmpty = field.required && !(value as string)
      return (
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor={fieldId} style={{ fontSize: '12px', display: 'block', marginBottom: '0.2rem' }}>
            {field.label}
            {field.required && <span style={{ color: '#c0392b', marginLeft: '2px' }}>*</span>}
          </label>
          <input
            id={fieldId}
            type="text"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Star, Heart, ArrowRight"
            style={{ ...inputStyle, ...(isEmpty ? { borderColor: '#c0392b' } : {}) }}
          />
          <small style={{ fontSize: '11px', color: '#888' }}>Lucide icon name (PascalCase)</small>
        </div>
      )
    }

    case 'image': {
      const img = (value as { src: string; alt: string }) ?? { src: '', alt: '' }
      return (
        <div style={{ marginBottom: '0.75rem' }}>
          <p style={{ fontSize: '12px', margin: '0 0 0.2rem' }}>{field.label}</p>
          <ImageUploadField
            src={img.src}
            alt={img.alt}
            onChange={(src, alt) => onChange({ src, alt })}
          />
        </div>
      )
    }

    case 'array': {
      const items = (value as Record<string, unknown>[]) ?? []
      return (
        <div style={{ marginBottom: '0.75rem' }}>
          <p style={{ fontSize: '12px', margin: '0 0 0.2rem' }}>{field.label}</p>
          {items.map((item, i) => {
            const itemKey = (item._id as string) ?? `${fieldId}-item-${i}`
            return (
              <div
                key={itemKey}
                style={{ border: '1px solid #ddd', padding: '0.5rem', marginBottom: '0.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '11px', color: '#888' }}>Item {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...items]
                      next.splice(i, 1)
                      onChange(next)
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                </div>
                {field.fields?.map((subField) => (
                  <FieldEditor
                    key={subField.key}
                    field={subField}
                    value={(item as Record<string, unknown>)[subField.key]}
                    blockId={`${field.key}-${i}`}
                    onChange={(v) => {
                      const next = [...items]
                      next[i] = { ...item, [subField.key]: v }
                      onChange(next)
                    }}
                  />
                ))}
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => {
              const newItem: Record<string, unknown> = {}
              field.fields?.forEach((f) => {
                if (f.type === 'boolean') newItem[f.key] = false
                else if (f.type === 'image') newItem[f.key] = { src: '', alt: '' }
                else newItem[f.key] = f.defaultValue ?? ''
              })
              onChange([...items, newItem])
            }}
            style={{ padding: '0.3rem 0.75rem', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer' }}
          >
            + Add Item
          </button>
        </div>
      )
    }

    case 'blocks':
      return (
        <div style={{ marginBottom: '0.75rem' }}>
          <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{field.label} (nested blocks not yet editable)</p>
        </div>
      )

    default:
      return null
  }
}

function ImageUploadField({
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
      headers: {
        'Content-Type': file.type,
        'x-filename': file.name,
        'x-requested-with': 'XMLHttpRequest',
      },
      body: file,
    })

    const data = (await res.json()) as { url?: string }
    setUploading(false)
    if (res.ok && data.url) onChange(data.url, alt)
  }

  const inputStyle = { width: '100%', padding: '0.3rem', fontFamily: 'monospace', fontSize: '13px', border: '1px solid #ccc', boxSizing: 'border-box' as const }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} style={{ marginBottom: '0.3rem' }} />
      {uploading && <p style={{ fontSize: '12px' }}>Uploading...</p>}
      {src && (
        // biome-ignore lint/performance/noImgElement: admin-only preview thumbnail
        <img src={src} alt={alt} style={{ width: '100%', maxHeight: '100px', objectFit: 'cover', marginBottom: '0.3rem' }} />
      )}
      <input
        type="url"
        value={src}
        onChange={(e) => onChange(e.target.value, alt)}
        placeholder="Image URL"
        style={{ ...inputStyle, marginBottom: '0.3rem' }}
      />
      <input
        type="text"
        value={alt}
        onChange={(e) => onChange(src, e.target.value)}
        placeholder="Alt text"
        style={inputStyle}
      />
    </div>
  )
}
