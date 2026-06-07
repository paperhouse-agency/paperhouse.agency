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
    <div className="min-h-[100svh] flex items-center justify-center bg-[var(--workspace)] p-[24px]">
      <div className="bg-[var(--c-card)] border border-[var(--c-card-border)] rounded-[14px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-[40px] w-full max-w-[380px]">
        <div className="font-body font-bold text-[22px] tracking-[-0.015em] text-primary leading-none mb-[4px]">paperhouse</div>
        <h1 className="font-heading font-normal text-[26px] text-text m-0 mb-[6px] leading-[1.2]">Sign in</h1>
        <p className="font-body text-[14px] text-[var(--chrome-muted)] m-0 mb-[28px]">Sign in to manage your content.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="email" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]">Email</label>
            <input
              id="email"
              type="text"
              className="w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[8px] px-[14px] py-[11px] font-body text-[15px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="you@paperhouse.agency"
            />
          </div>
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="password" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]">Password</label>
            <input
              id="password"
              type="password"
              className="w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[8px] px-[14px] py-[11px] font-body text-[15px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-primary font-body text-[12px] mt-[4px] mb-0">{error}</p>}
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
