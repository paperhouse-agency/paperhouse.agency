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
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <h1>Two-factor auth</h1>
        <p style={{ marginBottom: '1.25rem' }}>Enter the 6-digit code from your authenticator app.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-row">
            <label htmlFor="token">Code</label>
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
              style={{ letterSpacing: '0.25em', fontFamily: 'monospace' }}
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  )
}
