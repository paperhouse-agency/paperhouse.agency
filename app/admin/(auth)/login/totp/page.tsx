'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TotpPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth/totp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
      body: JSON.stringify({ token }),
    })

    const data = (await res.json()) as Record<string, unknown>
    setLoading(false)

    if (!res.ok) {
      setError((data.error as string) ?? 'Invalid code')
      return
    }

    router.push('/admin/pages' as string as never)
  }

  return (
    <div className="min-h-[100svh] flex items-center justify-center bg-[var(--workspace)] p-[24px]">
      <div className="bg-[var(--c-card)] border border-[var(--c-card-border)] rounded-[12px] p-[2.5rem] w-full max-w-[380px]">
        <h1 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontWeight: 400, fontSize: 24, margin: '0 0 1.5rem', color: 'var(--color-text)' }}>Two-factor auth</h1>
        <p style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-body, sans-serif)', fontSize: 14, color: 'var(--chrome-muted)' }}>Enter the 6-digit code from your authenticator app.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="token" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Code</label>
            <input
              id="token"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              autoComplete="one-time-code"
              className="w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[8px] px-[14px] py-[11px] font-body text-[15px] text-text outline-none transition-[border-color] duration-150 focus:border-primary"
              style={{ letterSpacing: '0.25em', fontFamily: 'monospace' }}
            />
          </div>
          {error && <p className="text-primary font-body text-[13px] mt-[4px] mb-0">{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  )
}
