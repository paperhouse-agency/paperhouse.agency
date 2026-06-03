'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const RESERVED = ['index', 'api', 'admin', '_next', 'static']

export default function NewPagePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [slugWarning, setSlugWarning] = useState('')
  const [loading, setLoading] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slug || slug === slugify(title)) setSlug(slugify(value))
  }

  async function handleSlugBlur() {
    if (!slug) return
    if (RESERVED.includes(slug)) {
      setSlugWarning('This slug is reserved and cannot be used.')
      return
    }
    try {
      const res = await fetch('/api/admin/pages')
      if (!res.ok) return
      const data = (await res.json()) as { pages: Array<{ slug: string }> }
      const exists = data.pages.some((p) => p.slug === slug)
      setSlugWarning(exists ? 'A page with this slug already exists.' : '')
    } catch {
      // ignore network errors on blur check
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (RESERVED.includes(slug)) {
      setError('Slug is reserved')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
      body: JSON.stringify({ title, slug }),
    })

    const data = (await res.json()) as Record<string, unknown>
    setLoading(false)

    if (!res.ok) {
      setError((data.error as string) ?? 'Failed to create page')
      return
    }

    router.push(`/admin/pages/${data.id as string}` as string as never)
  }

  return (
    <div style={{ maxWidth: '480px' }}>
      <div className="admin-page-header">
        <h1 style={{ margin: 0 }}>New page</h1>
      </div>
      <div className="admin-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-row">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="My page"
            />
          </div>
          <div className="form-row">
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugWarning('') }}
              onBlur={handleSlugBlur}
              required
              pattern="[a-z0-9-]*"
              placeholder="my-page"
            />
            <small className="admin-muted" style={{ marginTop: '4px', display: 'block' }}>
              Saved as content/{slug || 'slug'}.json
            </small>
            {slugWarning && (
              <small style={{ color: '#c0392b', marginTop: '4px', display: 'block' }}>
                {slugWarning}
              </small>
            )}
          </div>
          {error && <p className="admin-error">{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create page'}
            </button>
            <button
              type="button"
              data-variant="secondary"
              onClick={() => router.push('/admin/pages' as string as never)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}
