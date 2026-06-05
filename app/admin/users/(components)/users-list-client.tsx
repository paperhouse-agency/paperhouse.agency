'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/components/link'
import type { CmsUser } from '@/libs/cms/types'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`
  return new Date(iso).toLocaleDateString()
}

const USER_COLS = 'minmax(0,2.4fr) 1fr 1.1fr 1.3fr auto'

const AVATAR_COLORS: Record<string, string> = {
  super_admin: '#ff4d00',
  marketing: '#4b749f',
  editor: '#fa971a',
}

function roleClass(role: string) {
  if (role === 'super_admin') return 'cms-role-pill cms-role-super-admin'
  if (role === 'marketing') return 'cms-role-pill cms-role-marketing'
  return 'cms-role-pill cms-role-editor'
}

function roleLabel(role: string) {
  if (role === 'super_admin') return 'Super Admin'
  if (role === 'marketing') return 'Marketing'
  return 'Editor'
}

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

interface Props {
  users: CmsUser[]
  currentUserId?: string
  canManage: boolean
}

export function UsersListClient({ users, currentUserId, canManage }: Props) {
  const [q, setQ] = useState('')
  const router = useRouter()

  const shown = users.filter((u) =>
    (u.name + ' ' + u.email + ' ' + u.role).toLowerCase().includes(q.toLowerCase())
  )

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    })
    router.refresh()
  }

  return (
    <div className="cms-page cms-page-users">
      {/* List header */}
      <div className="cms-list-header">
        <div>
          <span className="cms-list-eyebrow">Team &amp; access</span>
          <h1 className="cms-list-title">
            Users<span className="dot">.</span>
          </h1>
          <p className="cms-list-sub">
            {users.length} member{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="cms-list-actions">
          {/* Search */}
          <div className="cms-search" style={{ minWidth: 240 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search people"
            />
          </div>
          {canManage && (
            <Link href="/admin/users/new" className="cms-btn cms-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 5.5a3.5 3.5 0 0 1 0 6.5M22 20a6.5 6.5 0 0 0-4.5-6.2" /></svg>
              New user
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="cms-table-card">
        <div className="cms-table-head" style={{ gridTemplateColumns: USER_COLS }}>
          <span className="cms-table-head-cell">User</span>
          <span className="cms-table-head-cell">Role</span>
          <span className="cms-table-head-cell">Status</span>
          <span className="cms-table-head-cell">Member since</span>
          <span className="cms-table-head-cell" />
        </div>

        {shown.length === 0 && (
          <div className="cms-table-empty">
            {q ? `No people match "${q}".` : 'No users yet.'}
          </div>
        )}

        {shown.map((user) => {
          const initials = getInitials(user.name)
          const avatarBg = AVATAR_COLORS[user.role] ?? '#2c2c33'
          const isActive = user.totpEnrolled || user.skipTotp
          return (
            <div
              key={user.id}
              className="cms-table-row cms-table-row--no-hover"
              style={{ gridTemplateColumns: USER_COLS }}
            >
              {/* User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                <span
                  className="cms-avatar"
                  style={{ width: 38, height: 38, background: avatarBg, fontSize: 13 }}
                >
                  {initials}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: 16, fontWeight: 400, color: 'var(--color-text)' }}>
                    {user.name}
                  </div>
                  <div className="cms-mono" style={{ marginTop: 2 }}>{user.email}</div>
                </div>
              </div>

              {/* Role */}
              <span>
                <span className={roleClass(user.role)}>{roleLabel(user.role)}</span>
              </span>

              {/* Status */}
              <span className="cms-status-dot">
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isActive ? '#1f8a5b' : '#fa971a',
                  display: 'inline-block', flex: 'none',
                }} />
                {isActive ? 'Active' : 'Pending 2FA'}
              </span>

              {/* Member since */}
              <span style={{ fontFamily: 'var(--font-body, sans-serif)', fontSize: 13.5, color: 'var(--chrome-muted)' }}>
                {relativeTime(user.createdAt)}
              </span>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link href={`/admin/users/${user.id}`} title="Edit user">
                  <button type="button" className="cms-block-action" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" /><path d="M2 14h4M10 8h4M18 16h4" /></svg>
                  </button>
                </Link>
                {canManage && user.id !== currentUserId && (
                  <button
                    type="button"
                    className="cms-block-action cms-block-action--danger"
                    title="Delete"
                    onClick={() => handleDelete(user.id, user.name)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
