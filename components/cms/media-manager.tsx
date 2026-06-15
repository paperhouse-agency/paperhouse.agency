'use client'

import { useState, useEffect } from 'react'
import { UploadModal } from './upload-modal'

export interface MediaAsset {
  url: string
  pathname: string
  size: number
  uploadedAt: string
  contentType: string
}

type FilterType = 'all' | 'images' | 'videos' | 'documents'
type ViewMode = 'grid' | 'list'

interface Props {
  onSelect?: (asset: MediaAsset) => void
  selectedUrl?: string
}

const uploadTriggerCls = 'inline-flex items-center gap-[7px] h-[40px] px-[18px] rounded-full border-none bg-primary text-white font-mono text-[12px] tracking-[0.05em] font-medium whitespace-nowrap cursor-pointer transition-[background] duration-[120ms] hover:bg-[#e54300]'
const spinnerCls = 'inline-block w-[20px] h-[20px] rounded-full border-2 border-[var(--chrome-border)] border-t-[var(--chrome-muted)] flex-none animate-[cms-spin_0.7s_linear_infinite]'
const emptyBaseCls = 'flex flex-col items-center justify-center gap-[8px] min-h-[300px] font-body text-[13.5px] text-[var(--chrome-muted)] text-center'

export function MediaManager({ onSelect, selectedUrl }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [view, setView] = useState<ViewMode>('grid')
  const [detail, setDetail] = useState<MediaAsset | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [storageUsed, setStorageUsed] = useState(0)
  const [storageLimit, setStorageLimit] = useState(500 * 1024 * 1024)

  const pickerMode = !!onSelect

  // biome-ignore lint/correctness/useExhaustiveDependencies: load on mount only
  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!detail) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setDetail(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [detail])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/media', { headers: { 'x-requested-with': 'XMLHttpRequest' } })
      const data = (await res.json()) as {
        blobs?: MediaAsset[]
        storageUsed?: number
        storageLimit?: number
        error?: string
      }
      if (!res.ok) throw new Error(data.error ?? 'Failed to load media')
      setAssets(data.blobs ?? [])
      setStorageUsed(data.storageUsed ?? 0)
      setStorageLimit(data.storageLimit ?? 500 * 1024 * 1024)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  function onUploaded(uploaded: MediaAsset[]) {
    setAssets((prev) => [...uploaded, ...prev])
    setStorageUsed((prev) => prev + uploaded.reduce((s, a) => s + a.size, 0))
    setUploadOpen(false)
    if (uploaded.length === 1) setDetail(uploaded[0])
  }

  async function handleDelete(asset: MediaAsset) {
    if (!confirm(`Delete "${fileName(asset.pathname)}"? This cannot be undone.`)) return
    setDeleting(asset.url)
    try {
      await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
        body: JSON.stringify({ url: asset.url }),
      })
      setAssets((prev) => prev.filter((a) => a.url !== asset.url))
      setStorageUsed((prev) => prev - asset.size)
      if (detail?.url === asset.url) setDetail(null)
    } finally {
      setDeleting(null)
    }
  }

  async function handleCopy(url?: string) {
    await navigator.clipboard.writeText(url ?? detail?.url ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function fileName(pathname: string) {
    return pathname.split('/').pop() ?? pathname
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function filterAssets(list: MediaAsset[]): MediaAsset[] {
    return list.filter((a) => {
      if (filter === 'images') return a.contentType.startsWith('image/')
      if (filter === 'videos') return a.contentType.startsWith('video/')
      if (filter === 'documents') return !a.contentType.startsWith('image/') && !a.contentType.startsWith('video/')
      return true
    })
  }

  const storagePercent = Math.min(100, (storageUsed / storageLimit) * 100)
  const filtered = filterAssets(
    assets.filter((a) => fileName(a.pathname).toLowerCase().includes(search.toLowerCase()))
  )

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'images', label: 'Images' },
    { key: 'videos', label: 'Videos' },
    { key: 'documents', label: 'Documents' },
  ]

  /* ── Picker mode ─────────────────────────────────────────────── */
  if (pickerMode) {
    return (
      <>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-[12px] px-[16px] py-[12px] border-b border-[var(--chrome-border)] flex-none">
            <div className="flex items-center gap-[9px] h-[42px] px-[16px] rounded-full bg-[var(--c-card)] border border-[var(--c-card-border)] text-[var(--chrome-faint)]" style={{ flex: 1 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…" className="border-none bg-transparent outline-none flex-1 font-body text-[14px] text-text min-w-0 placeholder:text-[var(--chrome-faint)]" />
            </div>
            <button type="button" className={uploadTriggerCls} onClick={() => setUploadOpen(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-[16px]">
            {loading && <div className={emptyBaseCls}><span className={spinnerCls} />Loading media…</div>}
            {!loading && error && <div className={`${emptyBaseCls} text-primary`}>{error}</div>}
            {!(loading || error) && assets.length === 0 && <div className={emptyBaseCls}>No media yet. Upload your first image.</div>}
            {!(loading || error) && assets.length > 0 && filtered.length === 0 && <div className={emptyBaseCls}>No results for &ldquo;{search}&rdquo;</div>}
            {!(loading || error) && filtered.length > 0 && (
              <div className="grid gap-[10px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))' }}>
                {filtered.map((asset) => {
                  const isActive = asset.url === selectedUrl
                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: visual grid
                    // biome-ignore lint/a11y/noStaticElementInteractions: visual grid
                    <div
                      key={asset.url}
                      className={`rounded-[10px] border-[1.5px] bg-[var(--c-card)] cursor-pointer overflow-hidden transition-[border-color,box-shadow,transform] duration-[120ms] hover:-translate-y-px hover:border-[rgba(26,26,26,0.22)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] ${isActive ? 'border-primary shadow-[0_0_0_3px_rgba(255,77,0,0.12)]' : 'border-[var(--chrome-border)]'}`}
                      onClick={() => onSelect(asset)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--chrome)] border-b border-[var(--chrome-border)]">
                        {/* biome-ignore lint/performance/noImgElement: admin-only */}
                        <img src={asset.url} alt={fileName(asset.pathname)} loading="lazy" className="w-full h-full object-cover block" />
                        {isActive && (
                          <div className="absolute top-[8px] right-[8px] w-[22px] h-[22px] rounded-full bg-primary text-white flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onUploaded={onUploaded} />}
      </>
    )
  }

  /* ── Full page mode ───────────────────────────────────────────── */
  return (
    <>
      <div className="py-[40px] px-[40px] pb-[60px] max-w-[1200px] mx-auto w-full">

        {/* ── Header ── */}
        <div className="mb-[28px]">
          <div className="flex items-end justify-between gap-[24px] flex-wrap mb-[26px]">
            <div>
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary mb-[10px] block">Assets</span>
              <h1 className="font-heading font-normal text-[40px] leading-none text-text m-0">Media<span className="text-primary">.</span></h1>
              <p className="font-body text-[15px] text-[var(--chrome-muted)] mt-[10px] mb-0">
                {loading ? 'Loading…' : `${assets.length} file${assets.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center gap-[9px] h-[42px] px-[16px] rounded-full bg-[var(--c-card)] border border-[var(--c-card-border)] text-[var(--chrome-faint)]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
                </svg>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…" className="border-none bg-transparent outline-none flex-1 font-body text-[14px] text-text min-w-0 placeholder:text-[var(--chrome-faint)]" />
              </div>
              <button type="button" className={uploadTriggerCls} onClick={() => setUploadOpen(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload media
              </button>
            </div>
          </div>
        </div>

        {/* ── Storage bar ── */}
        {!loading && (
          <div className="rounded-[10px] px-[16px] py-[13px] bg-[var(--c-card)] shadow-[0_2px_8px_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.04)] mb-[20px]">
            <div className="flex items-center justify-between mb-[10px]">
              <div className="flex items-center gap-[8px] text-[var(--chrome-muted)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--chrome-muted)]">Storage</span>
              </div>
              <span className="font-mono text-[11.5px] text-text font-medium">
                {formatSize(storageUsed)} <span className="text-[var(--chrome-muted)] font-normal">of {formatSize(storageLimit)} used</span>
              </span>
            </div>
            <div className="h-[6px] bg-[var(--chrome)] rounded-full overflow-hidden border border-[var(--chrome-border)]">
              <div className="h-full bg-text rounded-full transition-[width] duration-[400ms] ease-[ease] min-w-[2px]" style={{ width: `${storagePercent}%` }} />
            </div>
          </div>
        )}

        {/* ── Filters + view toggle ── */}
        <div className="flex items-center justify-between mb-[20px]">
          <div className="flex items-center gap-[6px]">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`h-[32px] px-[14px] rounded-full border font-body text-[13px] cursor-pointer transition-[background,border-color,color] duration-[120ms] ${filter === key ? 'bg-text border-text text-white' : 'border-[var(--chrome-border)] bg-transparent text-[var(--chrome-muted)] hover:bg-[var(--c-card)] hover:text-text'}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-[2px] border border-[var(--chrome-border)] rounded-[8px] p-[3px] bg-[var(--c-card)]">
            <button
              type="button"
              className={`w-[30px] h-[28px] rounded-[6px] border-none flex items-center justify-center cursor-pointer transition-[background,color] duration-100 ${view === 'grid' ? 'bg-text text-white' : 'bg-transparent text-[var(--chrome-muted)] hover:text-text'}`}
              onClick={() => setView('grid')}
              title="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button
              type="button"
              className={`w-[30px] h-[28px] rounded-[6px] border-none flex items-center justify-center cursor-pointer transition-[background,color] duration-100 ${view === 'list' ? 'bg-text text-white' : 'bg-transparent text-[var(--chrome-muted)] hover:text-text'}`}
              onClick={() => setView('list')}
              title="List view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div>
          <div>

            {loading && <div className={emptyBaseCls}><span className={spinnerCls} />Loading media…</div>}

            {!loading && error && (
              <div className={`${emptyBaseCls} text-primary`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {!(loading || error) && assets.length === 0 && (
              <div className={`${emptyBaseCls} gap-[14px]`}>
                <div className="w-[64px] h-[64px] rounded-[16px] border-[1.5px] border-dashed border-[var(--chrome-border)] flex items-center justify-center text-[var(--chrome-muted)] bg-[var(--c-card)]">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="text-[15px] font-semibold text-text m-0">No media yet</p>
                <p className="text-[13px] text-[var(--chrome-muted)] m-0">Upload your first image to get started.</p>
                <button type="button" className={uploadTriggerCls} onClick={() => setUploadOpen(true)} style={{ marginTop: 4 }}>
                  Upload media
                </button>
              </div>
            )}

            {!(loading || error) && assets.length > 0 && filtered.length === 0 && (
              <div className={emptyBaseCls}>No results for &ldquo;{search || filter}&rdquo;</div>
            )}

            {/* Grid view */}
            {!(loading || error) && filtered.length > 0 && view === 'grid' && (
              <div className="grid gap-[14px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                {filtered.map((asset) => {
                  const isActive = asset.url === detail?.url
                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: visual grid
                    // biome-ignore lint/a11y/noStaticElementInteractions: visual grid
                    <div
                      key={asset.url}
                      className={`rounded-[10px] border-[1.5px] bg-[var(--c-card)] cursor-pointer overflow-hidden transition-[border-color,box-shadow,transform] duration-[120ms] hover:-translate-y-px hover:border-[rgba(26,26,26,0.22)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] ${isActive ? 'border-primary shadow-[0_0_0_3px_rgba(255,77,0,0.12)]' : 'border-[var(--chrome-border)]'}`}
                      onClick={() => setDetail(isActive ? null : asset)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--chrome)] border-b border-[var(--chrome-border)]">
                        {/* biome-ignore lint/performance/noImgElement: admin-only */}
                        <img src={asset.url} alt={fileName(asset.pathname)} loading="lazy" className="w-full h-full object-cover block transition-[transform] duration-200 hover:scale-[1.03]" />
                        {isActive && (
                          <div className="absolute top-[8px] right-[8px] w-[22px] h-[22px] rounded-full bg-primary text-white flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                        {deleting === asset.url && (
                          <div className="absolute inset-0 bg-[rgba(255,255,255,0.6)] flex items-center justify-center">
                            <span className="inline-block w-[14px] h-[14px] rounded-full border-2 border-[rgba(255,255,255,0.3)] border-t-white animate-[cms-spin_0.7s_linear_infinite] flex-none" />
                          </div>
                        )}
                      </div>
                      <div className="px-[11px] py-[9px] pb-[10px] flex flex-col gap-[3px]">
                        <span className="font-body text-[12px] font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap">{fileName(asset.pathname)}</span>
                        <div className="flex items-center gap-[5px] font-mono text-[10px] text-[var(--chrome-muted)] tracking-[0.03em]">
                          <span>{formatSize(asset.size)}</span>
                          <span className="opacity-45">·</span>
                          <span>{formatDate(asset.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* List view */}
            {!(loading || error) && filtered.length > 0 && view === 'list' && (
              <div className="flex flex-col border border-[var(--chrome-border)] rounded-[10px] overflow-hidden">
                {filtered.map((asset) => {
                  const isActive = asset.url === detail?.url
                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: visual list row
                    // biome-ignore lint/a11y/noStaticElementInteractions: visual list row
                    <div
                      key={asset.url}
                      className={`grid items-center gap-[12px] px-[14px] py-[10px] border-b border-[var(--chrome-border)] last:border-b-0 cursor-pointer transition-[background] duration-100 hover:bg-[var(--chrome)] ${isActive ? 'bg-[rgba(255,77,0,0.04)]' : ''}`}
                      style={{ gridTemplateColumns: '48px 1fr 80px 72px 110px 72px' }}
                      onClick={() => setDetail(isActive ? null : asset)}
                    >
                      <div className="w-[48px] h-[36px] rounded-[5px] overflow-hidden bg-[var(--chrome)] flex-none">
                        {/* biome-ignore lint/performance/noImgElement: admin-only */}
                        <img src={asset.url} alt={fileName(asset.pathname)} loading="lazy" className="w-full h-full object-cover block" />
                      </div>
                      <span className="font-body text-[13px] font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap">{fileName(asset.pathname)}</span>
                      <span className="font-mono text-[11px] text-[var(--chrome-muted)] tracking-[0.03em]">{asset.contentType.split('/')[1]?.toUpperCase()}</span>
                      <span className="font-mono text-[11px] text-[var(--chrome-muted)] tracking-[0.03em]">{formatSize(asset.size)}</span>
                      <span className="font-mono text-[11px] text-[var(--chrome-muted)] tracking-[0.03em]">{formatDate(asset.uploadedAt)}</span>
                      <div className="flex items-center justify-end gap-[4px]">
                        <button
                          type="button"
                          className="w-[28px] h-[28px] rounded-[6px] border border-[var(--chrome-border)] bg-transparent text-[var(--chrome-muted)] flex items-center justify-center cursor-pointer transition-[background,color,border-color] duration-100 hover:bg-[var(--c-card)] hover:text-text"
                          onClick={(e) => { e.stopPropagation(); handleCopy(asset.url) }}
                          title="Copy URL"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                        <button
                          type="button"
                          className="w-[28px] h-[28px] rounded-[6px] border border-[var(--chrome-border)] bg-transparent text-[var(--chrome-muted)] flex items-center justify-center cursor-pointer transition-[background,color,border-color] duration-100 hover:bg-[rgba(255,77,0,0.08)] hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-default"
                          onClick={(e) => { e.stopPropagation(); handleDelete(asset) }}
                          disabled={deleting === asset.url}
                          title="Delete"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Detail dialog ── */}
      {detail && (
        // biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop
        // biome-ignore lint/a11y/useKeyWithClickEvents: Escape handled via useEffect
        <div
          className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,0.45)] backdrop-blur-[4px] flex items-center justify-center p-[24px] animate-[cms-backdrop-in_0.15s_ease]"
          onClick={(e) => { if (e.target === e.currentTarget) setDetail(null) }}
        >
          <div className="bg-[var(--workspace)] rounded-[14px] shadow-[0_32px_80px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden animate-[cms-modal-in_0.2s_cubic-bezier(0.34,1.3,0.64,1)]" style={{ width: 'min(680px, 100%)', maxHeight: 'min(560px, 90svh)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-[22px] py-[14px] pr-[18px] border-b border-[var(--chrome-border)] flex-none bg-[var(--chrome)]">
              <div>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary block mb-[2px]">File</span>
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">{fileName(detail.pathname)}</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-[var(--chrome-muted)] cursor-pointer transition-[background,color] duration-[120ms] flex-none hover:bg-[rgba(26,26,26,0.08)] hover:text-text"
                onClick={() => setDetail(null)}
                title="Close"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Two-column body */}
            <div className="grid flex-1 min-h-0 overflow-hidden" style={{ gridTemplateColumns: '1fr 1fr' }}>

              {/* Preview */}
              <div className="bg-[var(--chrome)] border-r border-[var(--chrome-border)] flex items-center justify-center overflow-hidden">
                {/* biome-ignore lint/performance/noImgElement: admin-only */}
                <img src={detail.url} alt={fileName(detail.pathname)} className="max-w-full max-h-full object-contain block" />
              </div>

              {/* Info */}
              <div className="p-[20px] flex flex-col gap-[14px] overflow-y-auto">
                <dl className="border border-[var(--chrome-border)] rounded-[8px] overflow-hidden m-0">
                  <div className="flex items-center justify-between gap-[8px] px-[12px] py-[8px] border-b border-[var(--chrome-border)]">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--chrome-muted)] flex-none">Size</dt>
                    <dd className="font-body text-[12px] text-text text-right overflow-hidden text-ellipsis whitespace-nowrap m-0">{formatSize(detail.size)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-[8px] px-[12px] py-[8px] border-b border-[var(--chrome-border)]">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--chrome-muted)] flex-none">Uploaded</dt>
                    <dd className="font-body text-[12px] text-text text-right overflow-hidden text-ellipsis whitespace-nowrap m-0">{formatDate(detail.uploadedAt)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-[8px] px-[12px] py-[8px]">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--chrome-muted)] flex-none">Type</dt>
                    <dd className="font-body text-[12px] text-text text-right overflow-hidden text-ellipsis whitespace-nowrap m-0">{detail.contentType}</dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-[6px] px-[12px] py-[10px] bg-[var(--chrome)] rounded-[8px] border border-[var(--chrome-border)]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--chrome-muted)]">URL</span>
                  <span className="font-mono text-[10.5px] text-[var(--chrome-muted)] overflow-hidden text-ellipsis whitespace-nowrap block" title={detail.url}>{detail.url}</span>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-[5px] self-start h-[28px] px-[10px] rounded-[6px] border font-body text-[11.5px] font-medium text-text cursor-pointer transition-[background,border-color,color] duration-[120ms] ${copied ? 'bg-[#f0fdf4] border-[#86efac] text-[#16a34a]' : 'border-[var(--chrome-border)] bg-[var(--c-card)] hover:border-[rgba(26,26,26,0.22)]'}`}
                    onClick={() => handleCopy()}
                  >
                    {copied ? (
                      <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                    ) : (
                      <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy URL</>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  className="flex items-center justify-center h-[36px] rounded-[8px] border border-primary bg-transparent text-primary font-body text-[13px] font-medium cursor-pointer transition-[background,color] duration-[120ms] hover:enabled:bg-primary hover:enabled:text-white disabled:opacity-45 disabled:cursor-default"
                  onClick={() => handleDelete(detail)}
                  disabled={deleting === detail.url}
                >
                  {deleting === detail.url ? 'Deleting…' : 'Delete image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onUploaded={onUploaded} />}
    </>
  )
}
