'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/components/link'
import { Button } from '@/components/button'
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
  if (role === 'super_admin') return 'inline-block rounded-full py-[4px] px-[12px] font-mono text-[11px] tracking-[0.08em] uppercase bg-[rgba(255,77,0,0.1)] text-primary'
  if (role === 'marketing') return 'inline-block rounded-full py-[4px] px-[12px] font-mono text-[11px] tracking-[0.08em] uppercase bg-[rgba(75,116,159,0.16)] text-secondary'
  return 'inline-block rounded-full py-[4px] px-[12px] font-mono text-[11px] tracking-[0.08em] uppercase bg-[rgba(250,151,26,0.18)] text-[#c0760a]'
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
    <div className="py-[40px] px-[40px] pb-[60px] max-w-[1100px] mx-auto w-full">
      {/* List header */}
      <div className="flex items-end justify-between gap-[24px] flex-wrap mb-[26px]">
        <div>
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary mb-[10px] block">Team &amp; access</span>
          <h1 className="font-heading font-normal text-[40px] leading-none text-text m-0">
            Users<span className="text-primary">.</span>
          </h1>
          <p className="font-body text-[15px] text-[var(--chrome-muted)] mt-[10px] mb-0">
            {users.length} member{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          {/* Search */}
          <div className="flex items-center gap-[9px] h-[42px] px-[16px] rounded-full bg-[var(--c-card)] border border-[var(--c-card-border)] text-[var(--chrome-faint)]" style={{ minWidth: 240 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search people"
              className="border-none bg-transparent outline-none flex-1 font-body text-[14px] text-text min-w-0 placeholder:text-[var(--chrome-faint)]"
            />
          </div>
          {canManage && (
            <Button url="/admin/users/new" size="sm">
              New user
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--c-card)] rounded-[12px] border border-[var(--c-card-border)] shadow-[var(--c-card-shadow)] overflow-hidden">
        <div className="grid gap-[16px] px-[24px] py-[14px] border-b border-[var(--c-card-border)] bg-bluishgray" style={{ gridTemplateColumns: USER_COLS }}>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">User</span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Role</span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Status</span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Member since</span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--chrome-muted)] text-right" />
        </div>

        {shown.length === 0 && (
          <div className="py-[40px] px-[24px] text-center font-body text-[14px] text-[var(--chrome-muted)]">
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
              className="grid gap-[16px] items-center px-[24px] py-[15px] border-b border-[var(--c-card-border)] last:border-b-0 cursor-default"
              style={{ gridTemplateColumns: USER_COLS }}
            >
              {/* User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                <span
                  className="rounded-full flex-none font-mono inline-flex items-center justify-center font-medium tracking-[0.02em] text-white"
                  style={{ width: 38, height: 38, background: avatarBg, fontSize: 13 }}
                >
                  {initials}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: 16, fontWeight: 400, color: 'var(--color-text)' }}>
                    {user.name}
                  </div>
                  <div className="font-mono text-[12px] text-[var(--chrome-muted)]" style={{ marginTop: 2 }}>{user.email}</div>
                </div>
              </div>

              {/* Role */}
              <span>
                <span className={roleClass(user.role)}>{roleLabel(user.role)}</span>
              </span>

              {/* Status */}
              <span className="inline-flex items-center gap-[8px] font-body text-[13.5px] text-[var(--chrome-muted)]">
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
                  <button type="button" className="w-[32px] h-[32px] rounded-[7px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-[var(--chrome-muted)] cursor-pointer text-[14px] font-body transition-[background,color,border-color] duration-100 hover:bg-[var(--workspace)] hover:border-[#b8b5b0] hover:text-text" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" /><path d="M2 14h4M10 8h4M18 16h4" /></svg>
                  </button>
                </Link>
                {canManage && user.id !== currentUserId && (
                  <button
                    type="button"
                    className="w-[32px] h-[32px] rounded-[7px] inline-flex items-center justify-center border border-[var(--c-card-border)] bg-[var(--c-card)] text-[var(--chrome-muted)] cursor-pointer text-[14px] font-body transition-[background,color,border-color] duration-100 hover:bg-[#fff5f4] hover:text-primary hover:border-[#ffc4bc]"
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
