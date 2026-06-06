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
        <div className="cms-media-mgr--picker">
          <div className="cms-media-picker-toolbar">
            <div className="cms-search" style={{ flex: 1 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…" />
            </div>
            <button type="button" className="cms-media-upload-trigger" onClick={() => setUploadOpen(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload
            </button>
          </div>
          <div className="cms-media-picker-body">
            {loading && <div className="cms-media-empty"><span className="cms-media-spinner" />Loading media…</div>}
            {!loading && error && <div className="cms-media-empty cms-media-empty--error">{error}</div>}
            {!(loading || error) && assets.length === 0 && <div className="cms-media-empty">No media yet. Upload your first image.</div>}
            {!(loading || error) && assets.length > 0 && filtered.length === 0 && <div className="cms-media-empty">No results for &ldquo;{search}&rdquo;</div>}
            {!(loading || error) && filtered.length > 0 && (
              <div className="cms-media-grid cms-media-grid--picker">
                {filtered.map((asset) => {
                  const isActive = asset.url === selectedUrl
                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: visual grid
                    // biome-ignore lint/a11y/noStaticElementInteractions: visual grid
                    <div key={asset.url} className={`cms-media-card${isActive ? ' cms-media-card--active' : ''}`} onClick={() => onSelect(asset)}>
                      <div className="cms-media-card-thumb">
                        {/* biome-ignore lint/performance/noImgElement: admin-only */}
                        <img src={asset.url} alt={fileName(asset.pathname)} loading="lazy" />
                        {isActive && (
                          <div className="cms-media-card-check">
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
      <div className="cms-media-page-wrap">

        {/* ── Header ── */}
        <div className="cms-media-page-top">
          <div className="cms-list-header">
            <div>
              <span className="cms-list-eyebrow">Assets</span>
              <h1 className="cms-list-title">Media<span className="dot">.</span></h1>
              <p className="cms-list-sub">
                {loading ? 'Loading…' : `${assets.length} file${assets.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="cms-list-actions">
              <div className="cms-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
                </svg>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…" />
              </div>
              <button type="button" className="cms-media-upload-trigger" onClick={() => setUploadOpen(true)}>
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
          <div className="cms-media-storage-bar">
            <div className="cms-media-storage-bar-top">
              <div className="cms-media-storage-bar-left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
                <span className="cms-media-storage-bar-label">Storage</span>
              </div>
              <span className="cms-media-storage-bar-text">
                {formatSize(storageUsed)} <span className="cms-media-storage-bar-of">of {formatSize(storageLimit)} used</span>
              </span>
            </div>
            <div className="cms-media-storage-track">
              <div className="cms-media-storage-fill" style={{ width: `${storagePercent}%` }} />
            </div>
          </div>
        )}

        {/* ── Filters + view toggle ── */}
        <div className="cms-media-filters-row">
          <div className="cms-media-filter-tabs">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`cms-media-filter-tab${filter === key ? ' cms-media-filter-tab--active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="cms-media-view-toggle">
            <button
              type="button"
              className={`cms-media-view-btn${view === 'grid' ? ' cms-media-view-btn--active' : ''}`}
              onClick={() => setView('grid')}
              title="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button
              type="button"
              className={`cms-media-view-btn${view === 'list' ? ' cms-media-view-btn--active' : ''}`}
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
        <div className="cms-media-page-body">
          <div className="cms-media-grid-area">

            {loading && <div className="cms-media-empty"><span className="cms-media-spinner" />Loading media…</div>}

            {!loading && error && (
              <div className="cms-media-empty cms-media-empty--error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {!(loading || error) && assets.length === 0 && (
              <div className="cms-media-empty cms-media-empty--upload">
                <div className="cms-media-empty-icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="cms-media-empty-title">No media yet</p>
                <p className="cms-media-empty-sub">Upload your first image to get started.</p>
                <button type="button" className="cms-media-upload-trigger" onClick={() => setUploadOpen(true)} style={{ marginTop: 4 }}>
                  Upload media
                </button>
              </div>
            )}

            {!(loading || error) && assets.length > 0 && filtered.length === 0 && (
              <div className="cms-media-empty">No results for &ldquo;{search || filter}&rdquo;</div>
            )}

            {/* Grid view */}
            {!(loading || error) && filtered.length > 0 && view === 'grid' && (
              <div className="cms-media-grid">
                {filtered.map((asset) => {
                  const isActive = asset.url === detail?.url
                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: visual grid
                    // biome-ignore lint/a11y/noStaticElementInteractions: visual grid
                    <div
                      key={asset.url}
                      className={`cms-media-card${isActive ? ' cms-media-card--active' : ''}`}
                      onClick={() => setDetail(isActive ? null : asset)}
                    >
                      <div className="cms-media-card-thumb">
                        {/* biome-ignore lint/performance/noImgElement: admin-only */}
                        <img src={asset.url} alt={fileName(asset.pathname)} loading="lazy" />
                        {isActive && (
                          <div className="cms-media-card-check">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                        {deleting === asset.url && (
                          <div className="cms-media-card-overlay">
                            <span className="cms-media-spinner cms-media-spinner--sm cms-media-spinner--light" />
                          </div>
                        )}
                      </div>
                      <div className="cms-media-card-info">
                        <span className="cms-media-card-name">{fileName(asset.pathname)}</span>
                        <div className="cms-media-card-meta">
                          <span>{formatSize(asset.size)}</span>
                          <span className="cms-media-card-meta-sep">·</span>
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
              <div className="cms-media-list">
                {filtered.map((asset) => {
                  const isActive = asset.url === detail?.url
                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: visual list row
                    // biome-ignore lint/a11y/noStaticElementInteractions: visual list row
                    <div
                      key={asset.url}
                      className={`cms-media-list-row${isActive ? ' cms-media-list-row--active' : ''}`}
                      onClick={() => setDetail(isActive ? null : asset)}
                    >
                      <div className="cms-media-list-thumb">
                        {/* biome-ignore lint/performance/noImgElement: admin-only */}
                        <img src={asset.url} alt={fileName(asset.pathname)} loading="lazy" />
                      </div>
                      <span className="cms-media-list-name">{fileName(asset.pathname)}</span>
                      <span className="cms-media-list-type">{asset.contentType.split('/')[1]?.toUpperCase()}</span>
                      <span className="cms-media-list-size">{formatSize(asset.size)}</span>
                      <span className="cms-media-list-date">{formatDate(asset.uploadedAt)}</span>
                      <div className="cms-media-list-actions">
                        <button
                          type="button"
                          className="cms-media-list-action-btn"
                          onClick={(e) => { e.stopPropagation(); handleCopy(asset.url) }}
                          title="Copy URL"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                        <button
                          type="button"
                          className="cms-media-list-action-btn cms-media-list-action-btn--danger"
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
        <div className="cms-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setDetail(null) }}>
          <div className="cms-media-detail-dialog">

            {/* Header */}
            <div className="cms-media-detail-dialog-header">
              <div>
                <span className="cms-upload-modal-eyebrow">File</span>
                <span className="cms-mono-label">{fileName(detail.pathname)}</span>
              </div>
              <button type="button" className="cms-sidebar-collapse-btn" onClick={() => setDetail(null)} title="Close">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Two-column body */}
            <div className="cms-media-detail-dialog-body">

              {/* Preview */}
              <div className="cms-media-detail-dialog-preview">
                {/* biome-ignore lint/performance/noImgElement: admin-only */}
                <img src={detail.url} alt={fileName(detail.pathname)} />
              </div>

              {/* Info */}
              <div className="cms-media-detail-dialog-info">
                <dl className="cms-media-detail-meta">
                  <div className="cms-media-detail-row"><dt>Size</dt><dd>{formatSize(detail.size)}</dd></div>
                  <div className="cms-media-detail-row"><dt>Uploaded</dt><dd>{formatDate(detail.uploadedAt)}</dd></div>
                  <div className="cms-media-detail-row"><dt>Type</dt><dd>{detail.contentType}</dd></div>
                </dl>

                <div className="cms-media-detail-url-box">
                  <span className="cms-media-detail-url-label">URL</span>
                  <span className="cms-media-detail-url-text" title={detail.url}>{detail.url}</span>
                  <button
                    type="button"
                    className={`cms-media-copy-btn${copied ? ' cms-media-copy-btn--copied' : ''}`}
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
                  className="cms-media-delete-btn"
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
