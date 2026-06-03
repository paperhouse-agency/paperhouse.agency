'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    <div style={{ maxWidth: '500px' }}>
      <h1>Edit User</h1>
      <p style={{ color: '#888', fontSize: '13px' }}>{user.email}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <br />
          <select id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #ccc' }}>
            <option value="editor">Editor</option>
            <option value="marketing">Marketing</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div>
          <label htmlFor="password">New Password (leave blank to keep current)</label>
          <br />
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #ccc' }} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {saved && <p style={{ color: 'green' }}>Saved.</p>}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', fontFamily: 'monospace' }}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" data-variant="secondary" onClick={() => router.push('/admin/users' as string as never)} style={{ padding: '0.5rem 1rem', fontFamily: 'monospace' }}>
            Back
          </button>
        </div>
      </form>
    </div>
  )
}
