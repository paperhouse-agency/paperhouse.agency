'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewUserPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('editor')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [totpUri, setTotpUri] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
      },
      body: JSON.stringify({ name, email, password, role }),
    })

    const data = (await res.json()) as Record<string, unknown>
    setLoading(false)

    if (!res.ok) {
      setError(data.error as string ?? 'Failed to create user')
      return
    }

    setTotpUri(data.totpUri as string)
  }

  if (totpUri) {
    return (
      <div>
        <h1>User Created</h1>
        <p>Share this authenticator setup with the new user:</p>
        <p style={{ wordBreak: 'break-all', background: '#f0f0f0', padding: '1rem' }}>{totpUri}</p>
        <p>They will be prompted to confirm enrollment on first login.</p>
        <button type="button" data-variant="secondary" onClick={() => router.push('/admin/users' as string as never)} style={{ padding: '0.5rem 1rem', fontFamily: 'monospace' }}>
          Back to Users
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1>New User</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <br />
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #ccc' }}>
            <option value="editor">Editor</option>
            <option value="marketing">Marketing</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', fontFamily: 'monospace' }}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
          <button type="button" data-variant="secondary" onClick={() => router.push('/admin/users' as string as never)} style={{ padding: '0.5rem 1rem', fontFamily: 'monospace' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
