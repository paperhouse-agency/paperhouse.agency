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

interface Props {
  /** Picker mode: clicking an asset calls this and closes the modal */
  onSelect?: (asset: MediaAsset) => void
  /** Highlight this URL as currently selected */
  selectedUrl?: string
}

export function MediaManager({ onSelect, selectedUrl }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<MediaAsset | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const pickerMode = !!onSelect

  // biome-ignore lint/correctness/useExhaustiveDependencies: load on mount only
  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/media', { headers: { 'x-requested-with': 'XMLHttpRequest' } })
      const data = (await res.json()) as { blobs?: MediaAsset[]; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to load media')
      setAssets(data.blobs ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  function onUploaded(uploaded: MediaAsset[]) {
    setAssets((prev) => [...uploaded, ...prev])
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
      if (detail?.url === asset.url) setDetail(null)
    } finally {
      setDeleting(null)
    }
  }

  async function handleCopy() {
    if (!detail) return
    await navigator.clipboard.writeText(detail.url)
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

  const totalBytes = assets.reduce((sum, a) => sum + a.size, 0)
  const filtered = assets.filter((a) =>
    fileName(a.pathname).toLowerCase().includes(search.toLowerCase()),
  )

  /* ── Picker mode (inside modal) ──────────────────────────────── */
  if (pickerMode) {
    return (
      <>
        <div className="cms-media-mgr cms-media-mgr--picker">
          {/* Picker toolbar */}
          <div className="cms-media-picker-toolbar">
            <div className="cms-search" style={{ flex: 1 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files…"
              />
            </div>
            <button
              type="button"
              className="cms-media-upload-trigger"
              onClick={() => setUploadOpen(true)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload
            </button>
          </div>

          <div className="cms-media-picker-body">
            {loading && (
              <div className="cms-media-empty">
                <span className="cms-media-spinner" />
                Loading media…
              </div>
            )}
            {!loading && error && (
              <div className="cms-media-empty cms-media-empty--error">{error}</div>
            )}
            {!(loading || error) && assets.length === 0 && (
              <div className="cms-media-empty">No media yet. Upload your first image.</div>
            )}
            {!(loading || error) && assets.length > 0 && filtered.length === 0 && (
              <div className="cms-media-empty">No results for &ldquo;{search}&rdquo;</div>
            )}
            {!(loading || error) && filtered.length > 0 && (
              <div className="cms-media-grid cms-media-grid--picker">
                {filtered.map((asset) => {
                  const isActive = asset.url === selectedUrl
                  return (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: visual grid
                    // biome-ignore lint/a11y/noStaticElementInteractions: visual grid
                    <div
                      key={asset.url}
                      className={`cms-media-card${isActive ? ' cms-media-card--active' : ''}`}
                      onClick={() => onSelect(asset)}
                    >
                      <div className="cms-media-card-thumb">
                        {/* biome-ignore lint/performance/noImgElement: admin-only */}
                        <img src={asset.url} alt={fileName(asset.pathname)} loading="lazy" />
                        {isActive && (
                          <div className="cms-media-card-check">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
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

        {uploadOpen && (
          <UploadModal onClose={() => setUploadOpen(false)} onUploaded={onUploaded} />
        )}
      </>
    )
  }

  /* ── Full page mode ───────────────────────────────────────────── */
  return (
    <>
      <div className="cms-media-page-wrap">
        {/* ── Header (matches pages/users list pattern) ── */}
        <div className="cms-media-page-top">
          <div className="cms-list-header">
            <div>
              <span className="cms-list-eyebrow">Media</span>
              <h1 className="cms-list-title">Library<span className="dot">.</span></h1>
              <p className="cms-list-sub">
                {loading
                  ? 'Loading…'
                  : `${assets.length} file${assets.length !== 1 ? 's' : ''}${assets.length > 0 ? ` · ${formatSize(totalBytes)} used` : ''}`
                }
              </p>
            </div>
            <div className="cms-list-actions">
              <div className="cms-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files…"
                />
              </div>
              <button
                type="button"
                className="cms-media-upload-trigger"
                onClick={() => setUploadOpen(true)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload media
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="cms-media-page-body">
          {/* Grid area */}
          <div className="cms-media-grid-area">
            {loading && (
              <div className="cms-media-empty">
                <span className="cms-media-spinner" />
                Loading media…
              </div>
            )}

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
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="cms-media-empty-title">No media yet</p>
                <p className="cms-media-empty-sub">Upload your first image to get started.</p>
                <button
                  type="button"
                  className="cms-media-upload-trigger"
                  onClick={() => setUploadOpen(true)}
                  style={{ marginTop: 4 }}
                >
                  Upload media
                </button>
              </div>
            )}

            {!(loading || error) && assets.length > 0 && filtered.length === 0 && (
              <div className="cms-media-empty">
                No results for &ldquo;{search}&rdquo;
              </div>
            )}

            {!(loading || error) && filtered.length > 0 && (
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
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
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
          </div>
        </div>
      </div>

      {/* ── Detail panel — fixed right edge of viewport ── */}
      {detail && (
        <aside className="cms-media-detail">
          <div className="cms-media-detail-header">
            <span className="cms-media-detail-label">File details</span>
            <button
              type="button"
              className="cms-sidebar-collapse-btn"
              onClick={() => setDetail(null)}
              title="Close"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="cms-media-detail-preview">
            {/* biome-ignore lint/performance/noImgElement: admin-only */}
            <img src={detail.url} alt={fileName(detail.pathname)} />
          </div>

          <div className="cms-media-detail-body">
            <p className="cms-media-detail-filename">{fileName(detail.pathname)}</p>

            <dl className="cms-media-detail-meta">
              <div className="cms-media-detail-row">
                <dt>Size</dt>
                <dd>{formatSize(detail.size)}</dd>
              </div>
              <div className="cms-media-detail-row">
                <dt>Uploaded</dt>
                <dd>{formatDate(detail.uploadedAt)}</dd>
              </div>
              <div className="cms-media-detail-row">
                <dt>Type</dt>
                <dd>{detail.contentType}</dd>
              </div>
            </dl>

            <div className="cms-media-detail-url-box">
              <span className="cms-media-detail-url-label">URL</span>
              <span className="cms-media-detail-url-text" title={detail.url}>{detail.url}</span>
              <button
                type="button"
                className={`cms-media-copy-btn${copied ? ' cms-media-copy-btn--copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy URL
                  </>
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
        </aside>
      )}

      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
          onUploaded={onUploaded}
        />
      )}
    </>
  )
}
