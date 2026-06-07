'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import type { UserRole } from '@/libs/cms/types'

interface SafeUser {
  id: string
  name: string
  email: string
  role: UserRole
  totpEnrolled: boolean
  createdAt: string
  updatedAt: string
}

export function EditUserForm({ user }: { user: SafeUser }) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [role, setRole] = useState(user.role)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)

    const body: Record<string, string> = { name, role }
    if (password) body.password = password

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
      },
      body: JSON.stringify(body),
    })

    const data = (await res.json()) as Record<string, unknown>
    setLoading(false)

    if (!res.ok) {
      setError(data.error as string ?? 'Update failed')
      return
    }

    setSaved(true)
    setPassword('')
  }

  return (
    <div className="py-[40px] px-[40px] pb-[60px] max-w-[1200px] mx-auto w-full">
      <div className="flex items-end justify-between gap-[24px] flex-wrap mb-[26px]">
        <div>
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary mb-[10px] block">Team &amp; access</span>
          <h1 className="font-heading font-normal text-[40px] leading-none text-text m-0">Edit user<span className="text-primary">.</span></h1>
          <p className="font-body text-[15px] text-[var(--chrome-muted)] mt-[10px] mb-0">{user.email}</p>
        </div>
      </div>

      <div style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
            <div className="px-[22px] py-[18px] border-b border-[var(--c-card-border)]">
              <h3 className="font-heading font-normal text-[19px] m-0 text-text">Account details</h3>
            </div>
            <div className="px-[22px] py-[22px] flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="name" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]">Name <span className="text-primary">*</span></label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label htmlFor="role" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary cursor-pointer appearance-auto"
                >
                  <option value="editor">Editor</option>
                  <option value="marketing">Marketing</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex flex-col gap-[8px]">
                <label htmlFor="password" className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] flex items-center gap-[3px]">New password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  className="w-full bg-[var(--c-card)] border border-[var(--field-border)] rounded-[6px] px-[10px] py-[8px] font-body text-[13.5px] text-text outline-none transition-[border-color] duration-150 focus:border-primary placeholder:text-[var(--chrome-faint)]"
                  placeholder="Leave blank to keep current"
                />
              </div>

              {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-primary)' }}>{error}</p>}
              {saved && <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#1f8a5b' }}>Changes saved.</p>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              color="neutral"
              onClick={() => router.push('/admin/users' as string as never)}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
