'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
      body: JSON.stringify({ email, password }),
    })

    const data = (await res.json()) as Record<string, unknown>
    setLoading(false)

    if (!res.ok) {
      setError((data.error as string) ?? 'Invalid credentials')
      return
    }

    if (data.requiresTotp === false) {
      router.push('/admin/pages' as string as never)
    } else {
      router.push('/admin/login/totp' as string as never)
    }
  }

  return (
    <div className="cms-login-wrap">
      <div className="cms-login-card">
        <div className="cms-login-wordmark">paperhouse</div>
        <h1 className="cms-login-heading">Sign in</h1>
        <p className="cms-login-sub">Sign in to manage your content.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="cms-field">
            <label htmlFor="email" className="cms-field-label">Email</label>
            <input
              id="email"
              type="text"
              className="cms-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="you@paperhouse.agency"
            />
          </div>
          <div className="cms-field">
            <label htmlFor="password" className="cms-field-label">Password</label>
            <input
              id="password"
              type="password"
              className="cms-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="cms-error-msg">{error}</p>}
          <Button
            variant='default'
            color='neutral'
            size='md'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
