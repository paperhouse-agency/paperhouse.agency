'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import type { CmsFooterColumn, CmsNavigation, CmsNavItem } from '@/libs/cms/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() {
  return crypto.randomUUID()
}

function emptyItem(): CmsNavItem {
  return { id: uid(), label: '', url: '', openInNewTab: false }
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function ItemRow({
  item,
  onChange,
  onDelete,
  disableDelete,
}: {
  item: CmsNavItem
  onChange: (updated: CmsNavItem) => void
  onDelete: () => void
  disableDelete?: boolean
}) {
  return (
    <div className="flex items-center gap-[10px] py-[10px] border-b border-[var(--c-card-border)] last:border-b-0">
      <input
        value={item.label}
        onChange={(e) => onChange({ ...item, label: e.target.value })}
        placeholder="Label"
        className="flex-[1.4] min-w-0 border border-[var(--c-card-border)] rounded-[8px] px-[12px] py-[7px] font-body text-[13.5px] text-text bg-[var(--workspace)] outline-none focus:border-[var(--color-text)] transition-colors placeholder:text-[var(--chrome-faint)]"
      />
      <input
        value={item.url}
        onChange={(e) => onChange({ ...item, url: e.target.value })}
        placeholder="URL or /path"
        className="flex-[2] min-w-0 border border-[var(--c-card-border)] rounded-[8px] px-[12px] py-[7px] font-mono text-[12.5px] text-text bg-[var(--workspace)] outline-none focus:border-[var(--color-text)] transition-colors placeholder:text-[var(--chrome-faint)]"
      />
      <Toggle
        checked={item.openInNewTab ?? false}
        onChange={(v) => onChange({ ...item, openInNewTab: v })}
        label="New tab"
        disabled={disableDelete}
      />
      <button
        type="button"
        title="Remove"
        disabled={disableDelete}
        onClick={onDelete}
        className="w-[30px] h-[30px] flex-none rounded-[7px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-[var(--chrome-muted)] cursor-pointer transition-[background,color,border-color] duration-100 hover:bg-[#fff5f4] hover:text-primary hover:border-[#ffc4bc] disabled:opacity-30 disabled:pointer-events-none"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
      </button>
    </div>
  )
}

function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <label className="flex items-center gap-[6px] cursor-pointer select-none group" style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex flex-none items-center rounded-full transition-colors duration-200 cursor-pointer"
        style={{
          width: 28,
          height: 16,
          background: checked ? 'var(--color-text)' : 'var(--c-card-border)',
        }}
      >
        <span
          className="absolute rounded-full bg-white transition-transform duration-200"
          style={{
            width: 12,
            height: 12,
            left: 2,
            transform: checked ? 'translateX(12px)' : 'translateX(0)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          }}
        />
      </span>
      <span className="font-mono text-[11.5px] text-[var(--chrome-muted)] whitespace-nowrap">{label}</span>
    </label>
  )
}

function SectionCard({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--c-card)] rounded-[14px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden mb-[28px]">
      <div className="px-[28px] py-[18px] border-b border-[var(--c-card-border)] bg-bluishgray flex items-center justify-between">
        {title}
      </div>
      <div className="px-[28px] py-[6px]">{children}</div>
    </div>
  )
}

function AddItemButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="py-[8px]">
      <Button variant="default" color="neutral" size="sm" hasIcon={false} onClick={onClick}>
        + Add item
      </Button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  initialNavigation: CmsNavigation
  canEdit: boolean
}

export function NavigationEditor({ initialNavigation, canEdit }: Props) {
  const router = useRouter()
  const [nav, setNav] = useState<CmsNavigation>(initialNavigation)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Header items ────────────────────────────────────────────────────────────

  function updateHeaderItem(idx: number, updated: CmsNavItem) {
    setNav((prev) => {
      const items = [...prev.header.items]
      items[idx] = updated
      return { ...prev, header: { items } }
    })
  }

  function deleteHeaderItem(idx: number) {
    setNav((prev) => {
      const items = prev.header.items.filter((_, i) => i !== idx)
      return { ...prev, header: { items } }
    })
  }

  function addHeaderItem() {
    setNav((prev) => ({
      ...prev,
      header: { items: [...prev.header.items, emptyItem()] },
    }))
  }

  // ── Footer columns ──────────────────────────────────────────────────────────

  function updateColumnHeading(colIdx: number, heading: string) {
    setNav((prev) => {
      const columns = prev.footer.columns.map((col, i) =>
        i === colIdx ? { ...col, heading } : col
      )
      return { ...prev, footer: { ...prev.footer, columns } }
    })
  }

  function updateColumnItem(colIdx: number, itemIdx: number, updated: CmsNavItem) {
    setNav((prev) => {
      const columns = prev.footer.columns.map((col, i) => {
        if (i !== colIdx) return col
        const items = [...col.items]
        items[itemIdx] = updated
        return { ...col, items }
      })
      return { ...prev, footer: { ...prev.footer, columns } }
    })
  }

  function deleteColumnItem(colIdx: number, itemIdx: number) {
    setNav((prev) => {
      const columns = prev.footer.columns.map((col, i) => {
        if (i !== colIdx) return col
        return { ...col, items: col.items.filter((_, j) => j !== itemIdx) }
      })
      return { ...prev, footer: { ...prev.footer, columns } }
    })
  }

  function addColumnItem(colIdx: number) {
    setNav((prev) => {
      const columns = prev.footer.columns.map((col, i) => {
        if (i !== colIdx) return col
        return { ...col, items: [...col.items, emptyItem()] }
      })
      return { ...prev, footer: { ...prev.footer, columns } }
    })
  }

  function deleteColumn(colIdx: number) {
    setNav((prev) => {
      const columns = prev.footer.columns.filter((_, i) => i !== colIdx)
      return { ...prev, footer: { ...prev.footer, columns } }
    })
  }

  function addColumn() {
    const col: CmsFooterColumn = { id: uid(), heading: '', items: [] }
    setNav((prev) => ({
      ...prev,
      footer: { ...prev.footer, columns: [...prev.footer.columns, col] },
    }))
  }

  // ── Footer legal ────────────────────────────────────────────────────────────

  function updateLegalItem(idx: number, updated: CmsNavItem) {
    setNav((prev) => {
      const legal = [...prev.footer.legal]
      legal[idx] = updated
      return { ...prev, footer: { ...prev.footer, legal } }
    })
  }

  function deleteLegalItem(idx: number) {
    setNav((prev) => ({
      ...prev,
      footer: { ...prev.footer, legal: prev.footer.legal.filter((_, i) => i !== idx) },
    }))
  }

  function addLegalItem() {
    setNav((prev) => ({
      ...prev,
      footer: { ...prev.footer, legal: [...prev.footer.legal, emptyItem()] },
    }))
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: JSON.stringify(nav),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to save')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="py-[40px] px-[40px] pb-[80px] max-w-[860px] mx-auto w-full">
      {/* Page header */}
      <div className="flex items-end justify-between gap-[24px] flex-wrap mb-[36px]">
        <div>
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary mb-[10px] block">Settings</span>
          <h1 className="font-heading font-normal text-[40px] leading-none text-text m-0">
            Navigation<span className="text-primary">.</span>
          </h1>
          <p className="font-body text-[15px] text-[var(--chrome-muted)] mt-[10px] mb-0">
            Manage header menu, footer columns, and legal links.
          </p>
        </div>
        {canEdit && (
          <div className="flex items-center gap-[12px]">
            {error && (
              <span className="font-mono text-[12px] text-primary">{error}</span>
            )}
            {saved && (
              <span className="font-mono text-[12px] text-[#1f8a5b]">Saved</span>
            )}
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-[8px] h-[38px] px-[20px] rounded-full bg-text text-offwhite font-mono text-[12.5px] tracking-[0.06em] cursor-pointer border-none transition-opacity duration-150 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </div>

      {/* ── Header Menu ── */}
      <SectionCard
        title={
          <>
            <div>
              <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] block mb-[2px]">Menu</span>
              <span className="font-heading text-[18px] text-text">Header</span>
            </div>
          </>
        }
      >
        {nav.header.items.map((item, idx) => (
          <ItemRow
            key={item.id}
            item={item}
            onChange={(updated) => updateHeaderItem(idx, updated)}
            onDelete={() => deleteHeaderItem(idx)}
            disableDelete={!canEdit}
          />
        ))}
        {nav.header.items.length === 0 && (
          <p className="font-body text-[13.5px] text-[var(--chrome-faint)] py-[12px]">No header items yet.</p>
        )}
        {canEdit && <AddItemButton onClick={addHeaderItem} />}
      </SectionCard>

      {/* ── Footer Columns ── */}
      <div className="mb-[4px] flex items-center justify-between">
        <div>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] block mb-[4px]">Menu</span>
          <span className="font-heading text-[18px] text-text">Footer columns</span>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={addColumn}
            className="inline-flex items-center gap-[6px] h-[34px] px-[16px] rounded-full border border-[var(--c-card-border)] bg-[var(--c-card)] font-mono text-[12px] tracking-[0.05em] text-[var(--chrome-muted)] cursor-pointer hover:text-text hover:border-[#b8b5b0] transition-[color,border-color] duration-100"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            Add column
          </button>
        )}
      </div>

      <div className="grid gap-[16px] mb-[28px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {nav.footer.columns.map((col, colIdx) => (
          <div key={col.id} className="bg-[var(--c-card)] rounded-[14px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
            <div className="px-[20px] py-[14px] border-b border-[var(--c-card-border)] bg-bluishgray flex items-center gap-[10px]">
              <input
                value={col.heading}
                onChange={(e) => updateColumnHeading(colIdx, e.target.value)}
                placeholder="Column heading"
                disabled={!canEdit}
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-heading text-[15px] text-text placeholder:text-[var(--chrome-faint)] disabled:pointer-events-none"
              />
              {canEdit && (
                <button
                  type="button"
                  title="Delete column"
                  onClick={() => deleteColumn(colIdx)}
                  className="flex-none w-[26px] h-[26px] rounded-[6px] inline-flex items-center justify-center text-[var(--chrome-muted)] cursor-pointer transition-[color] duration-100 hover:text-primary"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                </button>
              )}
            </div>
            <div className="px-[20px]">
              {col.items.map((item, itemIdx) => (
                <div key={item.id} className="flex items-center gap-[8px] py-[8px] border-b border-[var(--c-card-border)] last:border-b-0">
                  <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                    <input
                      value={item.label}
                      onChange={(e) => updateColumnItem(colIdx, itemIdx, { ...item, label: e.target.value })}
                      placeholder="Label"
                      disabled={!canEdit}
                      className="w-full border border-[var(--c-card-border)] rounded-[6px] px-[9px] py-[5px] font-body text-[12.5px] text-text bg-[var(--workspace)] outline-none focus:border-[var(--color-text)] transition-colors placeholder:text-[var(--chrome-faint)] disabled:opacity-60"
                    />
                    <input
                      value={item.url}
                      onChange={(e) => updateColumnItem(colIdx, itemIdx, { ...item, url: e.target.value })}
                      placeholder="URL or /path"
                      disabled={!canEdit}
                      className="w-full border border-[var(--c-card-border)] rounded-[6px] px-[9px] py-[5px] font-mono text-[11.5px] text-text bg-[var(--workspace)] outline-none focus:border-[var(--color-text)] transition-colors placeholder:text-[var(--chrome-faint)] disabled:opacity-60"
                    />
                    <Toggle
                      checked={item.openInNewTab ?? false}
                      onChange={(v) => updateColumnItem(colIdx, itemIdx, { ...item, openInNewTab: v })}
                      label="New tab"
                      disabled={!canEdit}
                    />
                  </div>
                  {canEdit && (
                    <button
                      type="button"
                      title="Remove"
                      onClick={() => deleteColumnItem(colIdx, itemIdx)}
                      className="flex-none w-[26px] h-[26px] rounded-[6px] inline-flex items-center justify-center text-[var(--chrome-muted)] cursor-pointer transition-[color] duration-100 hover:text-primary"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              ))}
              {canEdit && (
                <div className="py-[8px]">
                  <Button variant="default" color="neutral" size="sm" hasIcon={false} onClick={() => addColumnItem(colIdx)}>
                    + Add link
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {nav.footer.columns.length === 0 && (
          <p className="font-body text-[13.5px] text-[var(--chrome-faint)] col-span-full py-[4px]">No footer columns yet.</p>
        )}
      </div>

      {/* ── Footer Legal ── */}
      <SectionCard
        title={
          <div>
            <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] block mb-[2px]">Footer</span>
            <span className="font-heading text-[18px] text-text">Legal links</span>
          </div>
        }
      >
        {nav.footer.legal.map((item, idx) => (
          <ItemRow
            key={item.id}
            item={item}
            onChange={(updated) => updateLegalItem(idx, updated)}
            onDelete={() => deleteLegalItem(idx)}
            disableDelete={!canEdit}
          />
        ))}
        {nav.footer.legal.length === 0 && (
          <p className="font-body text-[13.5px] text-[var(--chrome-faint)] py-[12px]">No legal links yet.</p>
        )}
        {canEdit && <AddItemButton onClick={addLegalItem} />}
      </SectionCard>
    </div>
  )
}
