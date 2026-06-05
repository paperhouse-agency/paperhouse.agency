'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/components/link'
import type { CmsPageMeta } from '@/libs/cms/storage'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`
  return new Date(iso).toLocaleDateString()
}

const PAGE_COLS = 'minmax(0,2.3fr) 1.3fr 0.9fr 0.7fr 1.5fr auto'

interface Props {
  pages: CmsPageMeta[]
  canCreate: boolean
  canDelete: boolean
  canDuplicate: boolean
}

export function PagesListClient({ pages, canCreate, canDelete, canDuplicate }: Props) {
  const [q, setQ] = useState('')
  const router = useRouter()
  const publishedCount = pages.filter((p) => p.status === 'published').length
  const draftCount = pages.filter((p) => p.status === 'draft').length
  const shown = pages.filter((p) =>
    (p.title + ' ' + (p.slug || '/')).toLowerCase().includes(q.toLowerCase())
  )

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await fetch(`/api/admin/pages/${id}`, {
      method: 'DELETE',
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    })
    router.refresh()
  }

  async function handleDuplicate(id: string) {
    const res = await fetch(`/api/admin/pages/${id}/duplicate`, {
      method: 'POST',
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    })
    if (res.ok) router.refresh()
  }

  return (
    <div className="cms-page">
      {/* List header */}
      <div className="cms-list-header">
        <div>
          <span className="cms-list-eyebrow">Content</span>
          <h1 className="cms-list-title">
            Pages<span className="dot">.</span>
          </h1>
          <p className="cms-list-sub">
            {pages.length} page{pages.length !== 1 ? 's' : ''} · {publishedCount} published · {draftCount} draft{draftCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="cms-list-actions">
          {/* Search */}
          <div className="cms-search" style={{ minWidth: 240 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pages"
            />
          </div>
          {canCreate && (
            <Link href="/admin/pages/new" className="cms-btn cms-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              New page
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="cms-table-card">
        <div className="cms-table-head" style={{ gridTemplateColumns: PAGE_COLS }}>
          <span className="cms-table-head-cell">Page</span>
          <span className="cms-table-head-cell">URL</span>
          <span className="cms-table-head-cell">Status</span>
          <span className="cms-table-head-cell">Blocks</span>
          <span className="cms-table-head-cell">Last edited</span>
          <span className="cms-table-head-cell" />
        </div>

        {shown.length === 0 && (
          <div className="cms-table-empty">
            {q ? `No pages match "${q}".` : 'No pages yet. Create your first page.'}
          </div>
        )}

        {shown.map((page) => {
          const isHome = page.slug === '' || page.slug === 'index'
          return (
            <div
              key={page.id}
              className="cms-table-row"
              style={{ gridTemplateColumns: PAGE_COLS, cursor: 'pointer' }}
              onClick={() => router.push(`/admin/pages/${page.id}`)}
            >
              {/* Page title + icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                <span style={{
                  width: 38, height: 38, borderRadius: 9, flex: 'none',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--color-bluishgray)', color: 'var(--chrome-muted)',
                }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--font-heading, Georgia, serif)',
                      fontSize: 16,
                      fontWeight: 400,
                      color: 'var(--color-text)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {page.title}
                    </span>
                    {isHome && <span className="cms-badge cms-badge-home">Homepage</span>}
                  </div>
                </div>
              </div>

              {/* URL */}
              <span className="cms-mono" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isHome ? '/' : `/${page.slug}`}
              </span>

              {/* Status */}
              <span>
                <span className={`cms-badge cms-badge-${page.status === 'published' ? 'pub' : 'draft'}`}>
                  {page.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </span>

              {/* Blocks count */}
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13.5, color: 'var(--color-text)' }}>
                {page.blockCount}
              </span>

              {/* Last edited */}
              <span style={{ fontFamily: 'var(--font-body, sans-serif)', fontSize: 13.5, color: 'var(--chrome-muted)' }}>
                {relativeTime(page.updatedAt)}
                {page.author && (
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--chrome-faint)' }}>
                    by {page.author}
                  </span>
                )}
              </span>

              {/* Actions — stopPropagation so row click doesn't fire */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={(e) => e.stopPropagation()}
              >
                {canDuplicate && (
                  <button
                    type="button"
                    className="cms-block-action"
                    title="Duplicate"
                    onClick={() => handleDuplicate(page.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    className="cms-block-action cms-block-action--danger"
                    title="Delete"
                    onClick={() => handleDelete(page.id, page.title)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
