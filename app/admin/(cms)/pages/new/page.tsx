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
    <div className="py-[40px] px-[40px] pb-[60px] max-w-[560px] mx-auto w-full">
      <Link href="/admin/pages" className="inline-flex items-center gap-[6px] font-mono text-[12px] tracking-[0.08em] text-[var(--chrome-muted)] no-underline mb-[20px] transition-colors duration-[120ms] hover:text-text">
        ← Pages
      </Link>
      <h1 className="font-heading font-normal text-[32px] text-text m-0 mb-[24px]">New page</h1>
      <p className="font-body text-[14px] text-[var(--chrome-muted)] mt-[-16px] mb-[24px]">Give it a name — you can add blocks next.</p>

      <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
        <div className="px-[22px] py-[22px] flex flex-col gap-[20px]">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="flex flex-col gap-[8px]">
              <label htmlFor="title" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]">
                Title <span className="text-primary">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[8px] px-[14px] py-[11px] font-body text-[15px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)]"
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
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="slug" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]">URL slug</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="font-mono text-[13px] text-[var(--chrome-faint)] flex-none">/</span>
                  <input
                    id="slug"
                    type="text"
                    className={`w-full bg-[var(--c-card)] border rounded-[8px] px-[14px] py-[11px] font-body text-[15px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)]${slugWarning ? ' border-primary' : ' border-[var(--field-border)]'}`}
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugWarning('') }}
                    onBlur={(e) => checkSlug(e.target.value)}
                    required
                    pattern="[a-z0-9-]+"
                    placeholder="my-page"
                    style={{ flex: 1 }}
                  />
                </div>
                <span className="font-body text-[12px] text-[var(--chrome-faint)] mt-[-2px] leading-[1.4]">
                  Saved as content/{slug || 'slug'}.json
                </span>
                {slugWarning && (
                  <span className="text-primary font-body text-[12px] mt-[4px]">{slugWarning}</span>
                )}
              </div>
            )}

            {isHomepage && (
              <p className="text-[var(--chrome-muted)] text-[12px] font-body">
                Saved as <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>content/index.json</code> — served at <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>/</code>
              </p>
            )}

            {error && <p className="text-primary font-body text-[12px] mt-[4px] mb-0">{error}</p>}

            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-[8px] h-[42px] px-[20px] rounded-full font-mono text-[13px] tracking-[0.04em] cursor-pointer transition-[background] duration-150 whitespace-nowrap border-none bg-primary text-offwhite hover:not-disabled:bg-[#e54300] disabled:opacity-45 disabled:cursor-not-allowed"
                disabled={loading || !!slugWarning}
              >
                {loading ? 'Creating…' : 'Create page'}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-[8px] h-[42px] px-[18px] rounded-full font-mono text-[13px] tracking-[0.04em] cursor-pointer transition-[background,border-color] duration-150 whitespace-nowrap border border-[var(--c-card-border)] bg-transparent text-text hover:border-[#b8b5b0] hover:bg-[var(--workspace)]"
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
