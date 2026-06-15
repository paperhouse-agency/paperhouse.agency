'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/components/link'
import { Button } from '@/components/button'
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
    <div className="py-[40px] px-[40px] pb-[60px] max-w-[1200px] mx-auto w-full">
      {/* List header */}
      <div className="flex items-end justify-between gap-[24px] flex-wrap mb-[26px]">
        <div>
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary mb-[10px] block">Content</span>
          <h1 className="font-heading font-normal text-[40px] leading-none text-text m-0">
            Pages<span className="text-primary">.</span>
          </h1>
          <p className="font-body text-[15px] text-[var(--chrome-muted)] mt-[10px] mb-0">
            {pages.length} page{pages.length !== 1 ? 's' : ''} · {publishedCount} published · {draftCount} draft{draftCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          {/* Search */}
          <div className="flex items-center gap-[9px] h-[42px] px-[16px] rounded-full bg-[var(--c-card)] border border-[var(--c-card-border)] text-[var(--chrome-faint)]" style={{ minWidth: 240 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pages"
              className="border-none bg-transparent outline-none flex-1 font-body text-[14px] text-text min-w-0 placeholder:text-[var(--chrome-faint)]"
            />
          </div>
          {canCreate && (
            <Button variant="default" url="/admin/pages/new" size="sm">
              New page
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
        <div className="grid gap-[16px] px-[24px] py-[14px] border-b border-[var(--c-card-border)] bg-bluishgray" style={{ gridTemplateColumns: PAGE_COLS }}>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Page</span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">URL</span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Status</span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Blocks</span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Last edited</span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] text-right" />
        </div>

        {shown.length === 0 && (
          <div className="py-[40px] px-[24px] text-center font-body text-[14px] text-[var(--chrome-muted)]">
            {q ? `No pages match "${q}".` : 'No pages yet. Create your first page.'}
          </div>
        )}

        {shown.map((page) => {
          const isHome = page.slug === '' || page.slug === 'index'
          return (
            <div
              key={page.id}
              className="grid gap-[16px] items-center px-[24px] py-[15px] border-b border-[var(--c-card-border)] last:border-b-0 cursor-pointer transition-[background] duration-100 hover:bg-[#faf9f7]"
              style={{ gridTemplateColumns: PAGE_COLS }}
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
                    {isHome && (
                      <span className="inline-flex items-center gap-[6px] rounded-full py-[4px] px-[11px] font-mono text-[11px] tracking-[0.1em] uppercase whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-current before:flex-none bg-[rgba(255,77,0,0.1)] text-primary">
                        Homepage
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* URL */}
              <span className="font-mono text-[12px] text-[var(--chrome-muted)]" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isHome ? '/' : `/${page.slug}`}
              </span>

              {/* Status */}
              <span>
                <span className={`inline-flex items-center gap-[6px] rounded-full py-[4px] px-[11px] font-mono text-[11px] tracking-[0.1em] uppercase whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-current before:flex-none ${page.status === 'published' ? 'bg-[rgba(31,138,91,0.12)] text-[#1f8a5b]' : 'bg-bluishgray text-[var(--chrome-muted)]'}`}>
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
                    className="w-[32px] h-[32px] rounded-[7px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-[var(--chrome-muted)] cursor-pointer text-[14px] font-body transition-[background,color,border-color] duration-100 hover:bg-[var(--workspace)] hover:border-[#b8b5b0] hover:text-text"
                    title="Duplicate"
                    onClick={() => handleDuplicate(page.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    className="w-[32px] h-[32px] rounded-[7px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-[var(--chrome-muted)] cursor-pointer text-[14px] font-body transition-[background,color,border-color] duration-100 hover:bg-[#fff5f4] hover:text-primary hover:border-[#ffc4bc]"
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
