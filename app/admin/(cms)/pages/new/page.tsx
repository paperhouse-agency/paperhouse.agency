'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/components/link'

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
    <div className="cms-form-wrap">
      <Link href="/admin/pages" className="cms-back-link">
        ← Pages
      </Link>
      <h1 className="cms-form-heading">New page</h1>
      <p className="cms-form-sub">Give it a name — you can add blocks next.</p>

      <div className="cms-card">
        <div className="cms-card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="cms-field">
              <label htmlFor="title" className="cms-field-label">
                Title <span className="cms-field-req">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="cms-input"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Case Studies"
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                id="is-homepage"
                type="checkbox"
                className="cms-toggle"
                checked={isHomepage}
                onChange={(e) => handleHomepageToggle(e.target.checked)}
              />
              <label
                htmlFor="is-homepage"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--chrome-muted)', cursor: 'pointer' }}
              >
                Set as homepage
              </label>
            </div>

            {!isHomepage && (
              <div className="cms-field">
                <label htmlFor="slug" className="cms-field-label">URL slug</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="cms-slug-seg">/</span>
                  <input
                    id="slug"
                    type="text"
                    className={`cms-input${slugWarning ? ' cms-input--error' : ''}`}
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugWarning('') }}
                    onBlur={(e) => checkSlug(e.target.value)}
                    required
                    pattern="[a-z0-9-]+"
                    placeholder="my-page"
                    style={{ flex: 1 }}
                  />
                </div>
                <span className="cms-field-hint">
                  Saved as content/{slug || 'slug'}.json
                </span>
                {slugWarning && (
                  <span className="cms-error-msg">{slugWarning}</span>
                )}
              </div>
            )}

            {isHomepage && (
              <p className="cms-muted-text">
                Saved as <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>content/index.json</code> — served at <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>/</code>
              </p>
            )}

            {error && <p className="cms-error-msg">{error}</p>}

            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button
                type="submit"
                className="cms-btn cms-btn-primary"
                disabled={loading || !!slugWarning}
              >
                {loading ? 'Creating…' : 'Create page'}
              </button>
              <button
                type="button"
                className="cms-btn cms-btn-ghost"
                onClick={() => router.push('/admin/pages' as string as never)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
