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
    <div className="cms-page">
      <div className="cms-list-header">
        <div>
          <span className="cms-list-eyebrow">Team &amp; access</span>
          <h1 className="cms-list-title">Edit user<span className="dot">.</span></h1>
          <p className="cms-list-sub">{user.email}</p>
        </div>
      </div>

      <div style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="cms-card">
            <div className="cms-card-header">
              <h3 className="cms-card-title">Account details</h3>
            </div>
            <div className="cms-card-body">
              <div className="cms-field cms-field-full">
                <label htmlFor="name" className="cms-field-label">Name <span className="cms-field-req">*</span></label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="cms-input cms-input--sm"
                />
              </div>

              <div className="cms-field cms-field-full">
                <label htmlFor="role" className="cms-field-label">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="cms-select cms-select--sm"
                >
                  <option value="editor">Editor</option>
                  <option value="marketing">Marketing</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="cms-field cms-field-full">
                <label htmlFor="password" className="cms-field-label">New password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  className="cms-input cms-input--sm"
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
