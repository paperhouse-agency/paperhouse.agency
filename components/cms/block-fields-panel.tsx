'use client'

import { useState } from 'react'
import { MediaPickerModal } from './media-picker-modal'
import type { MediaAsset } from './media-manager'
import { getBlockEntry } from '@/libs/cms/block-registry'
import type { FieldDef } from '@/libs/cms/block-registry'
import { useEditorStore } from '@/libs/cms/editor-store'
import type { BlockData } from '@/libs/cms/types'

const inputSmCls = 'w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)]'
const inputSmErrorCls = 'w-full bg-[var(--c-card)] border border-primary rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)]'
const textareaSmCls = 'w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)] resize-y min-h-[80px] leading-[1.5]'
const textareaSmErrorCls = 'w-full bg-[var(--c-card)] border border-primary rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)] resize-y min-h-[80px] leading-[1.5]'
const fieldLabelCls = 'font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]'
const fieldHintCls = 'font-body text-[12px] text-[var(--chrome-faint)] mt-[-2px] leading-[1.4]'

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
    <div className="grid grid-cols-2 gap-x-[20px] gap-y-[18px]">
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
    <div className={`flex flex-col gap-[8px]${isFullSpan ? ' col-span-2' : ''}`}>
      {children}
    </div>
  )
}

function FieldLabel({ field, htmlFor }: { field: FieldDef; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className={fieldLabelCls}>
      {field.label}
      {field.required && <span className="text-primary">*</span>}
    </label>
  )
}

function FieldHint({ field }: { field: FieldDef }) {
  if (!field.description) return null
  return <span className={fieldHintCls}>{field.description}</span>
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
            className={isEmpty ? inputSmErrorCls : inputSmCls}
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
            className={isEmpty ? textareaSmErrorCls : textareaSmCls}
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
            <span className={fieldHintCls}>{field.description}</span>
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
            className={`${isEmpty ? 'border-primary' : 'border-[var(--field-border)]'} w-full bg-[var(--c-card)] border rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary cursor-pointer appearance-auto`}
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
            className={isEmpty ? inputSmErrorCls : inputSmCls}
          />
          <span className={fieldHintCls}>Lucide icon name in PascalCase</span>
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
        <p className={`${fieldHintCls} italic`}>
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
    <div className="flex flex-col gap-[8px] mt-[4px]">
      {items.length === 0 && (
        <p className="text-[13px] text-[var(--chrome-muted)] italic font-body">No items yet.</p>
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
      <button
        type="button"
        className="w-full text-center px-[12px] py-[10px] bg-none border-[1.5px] border-dashed border-[var(--chrome-faint)] rounded-[10px] text-[13px] font-mono tracking-[0.04em] text-[var(--chrome-muted)] cursor-pointer transition-[border-color,color] duration-[120ms] hover:border-text hover:text-text"
        onClick={addItem}
      >
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
    <div className="border border-[var(--c-card-border)] rounded-[10px] overflow-hidden bg-[var(--c-card)]">
      <div className="flex items-center justify-between px-[14px] py-[9px] pr-[12px] bg-[var(--workspace)] border-b border-[var(--c-card-border)] gap-[8px]">
        <button
          type="button"
          className="flex items-center gap-[7px] bg-none border-none cursor-pointer p-0 font-mono flex-1 text-left min-w-0"
          onClick={() => setOpen(!open)}
        >
          <span className="text-[12px] text-[var(--chrome-muted)] flex-none">{open ? '▾' : '▸'}</span>
          <span className="font-mono text-[11.5px] text-[var(--chrome-muted)]">Item {index + 1}</span>
          {preview && (
            <span className="font-body text-[13px] text-text"> — {preview}</span>
          )}
        </button>
        <div className="flex gap-[2px] flex-none text-[var(--chrome-faint)]">
          <button
            type="button"
            className="bg-none border-none text-inherit cursor-pointer px-[6px] py-[3px] text-[13px] rounded-[4px] transition-[background,color] duration-100 font-body hover:bg-bluishgray hover:text-text disabled:opacity-25 disabled:cursor-not-allowed"
            title="Move up"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
          >
            ↑
          </button>
          <button
            type="button"
            className="bg-none border-none text-inherit cursor-pointer px-[6px] py-[3px] text-[13px] rounded-[4px] transition-[background,color] duration-100 font-body hover:bg-bluishgray hover:text-text disabled:opacity-25 disabled:cursor-not-allowed"
            title="Move down"
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
          >
            ↓
          </button>
          <button
            type="button"
            className="bg-none border-none text-inherit cursor-pointer px-[6px] py-[3px] text-[13px] rounded-[4px] transition-[background,color] duration-100 font-body hover:text-primary hover:bg-[rgba(255,77,0,0.08)]"
            title="Remove"
            onClick={onRemove}
          >
            ×
          </button>
        </div>
      </div>

      {open && (
        <div className="px-[16px] py-[14px] grid grid-cols-2 gap-x-[14px] gap-y-[12px]">
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
      <div className="flex gap-[14px] items-start">
        <div className="w-[80px] h-[70px] flex-none rounded-[8px] overflow-hidden border border-[var(--c-card-border)] bg-bluishgray flex items-center justify-center font-mono text-[10px] text-[var(--chrome-faint)]">
          {src ? (
            // biome-ignore lint/performance/noImgElement: admin-only thumbnail
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <span>No image</span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-[8px]">
          {src && (
            <p className="font-mono text-[11px] text-[var(--chrome-muted)] overflow-hidden text-ellipsis whitespace-nowrap max-w-full m-0" title={src}>
              {src.split('/').pop()}
            </p>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-[7px] self-start px-[14px] py-[7px] rounded-[7px] border border-[var(--c-card-border)] bg-[var(--c-card)] text-text font-mono text-[12px] tracking-[0.04em] cursor-pointer transition-[background] duration-[120ms] whitespace-nowrap hover:bg-[var(--workspace)]"
            onClick={() => setPickerOpen(true)}
          >
            {src ? 'Change image' : 'Choose image'}
          </button>
          <input
            type="text"
            value={alt}
            onChange={(e) => onChange(src, e.target.value)}
            placeholder="Alt text"
            className={inputSmCls}
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
