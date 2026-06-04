'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const RESERVED = ['index', 'api', 'admin', '_next', 'static']

export default function NewPagePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isHomepage, setIsHomepage] = useState(false)
  const [error, setError] = useState('')
  const [slugWarning, setSlugWarning] = useState('')
  const [loading, setLoading] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isHomepage && (!slug || slug === slugify(title))) {
      setSlug(slugify(value))
    }
  }

  function handleHomepageToggle(checked: boolean) {
    setIsHomepage(checked)
    setSlugWarning('')
    if (checked) {
      setSlug('')
    } else {
      setSlug(slugify(title) || '')
    }
  }

  async function checkSlug(value: string) {
    if (!value || isHomepage) return
    if (RESERVED.includes(value)) {
      setSlugWarning('This slug is reserved.')
      return
    }
    const res = await fetch(`/api/admin/pages?slugCheck=${encodeURIComponent(value)}`)
    const data = (await res.json()) as { taken?: boolean }
    setSlugWarning(data.taken ? 'A page with this slug already exists.' : '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const finalSlug = isHomepage ? '' : slug
    if (!isHomepage && RESERVED.includes(finalSlug)) {
      setError('Slug is reserved')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
      body: JSON.stringify({ title, slug: finalSlug }),
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="is-homepage"
                type="checkbox"
                className="f-toggle"
                checked={isHomepage}
                onChange={(e) => handleHomepageToggle(e.target.checked)}
              />
              <label htmlFor="is-homepage" className="f-toggle-label">Set as homepage</label>
            </div>
          </div>

          {!isHomepage && (
            <div className="form-row">
              <label htmlFor="slug">Slug</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="admin-slug" style={{ flexShrink: 0 }}>/</span>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugWarning('') }}
                  onBlur={(e) => checkSlug(e.target.value)}
                  required
                  pattern="[a-z0-9-]+"
                  placeholder="my-page"
                  style={{ flex: 1 }}
                />
              </div>
              <small className="admin-muted" style={{ marginTop: '4px', display: 'block' }}>
                Saved as content/{slug || 'slug'}.json
              </small>
              {slugWarning && (
                <small style={{ color: '#c0392b', marginTop: '4px', display: 'block' }}>
                  {slugWarning}
                </small>
              )}
            </div>
          )}

          {isHomepage && (
            <p className="admin-muted" style={{ margin: 0 }}>
              Saved as <code>content/index.json</code> — served at <code>/</code>
            </p>
          )}

          {error && <p className="admin-error">{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <button type="submit" disabled={loading || !!slugWarning}>
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
