import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readUsers } from '@/libs/cms/storage'
import { Link } from '@/components/link'
import { redirect } from 'next/navigation'
import { DeleteUserButton } from './(components)/delete-user-button'

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
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function UsersPage() {
  const session = await getSession()
  if (!(session.role && canPerform(session.role, 'manage_users'))) {
    redirect('/admin/pages' as string as never)
  }

  const users = await readUsers()

  return (
    <div className="cms-page cms-page-users">
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
          <Link href="/admin/users/new" className="cms-btn cms-btn-primary">
            <span>+</span>
            New user
          </Link>
        </div>
      </div>

      <div className="cms-table-card">
        <div
          className="cms-table-head"
          style={{ gridTemplateColumns: 'minmax(0,2.2fr) 1fr 1fr 1fr auto' }}
        >
          <span className="cms-table-head-cell">User</span>
          <span className="cms-table-head-cell">Role</span>
          <span className="cms-table-head-cell">2FA</span>
          <span className="cms-table-head-cell">Actions</span>
          <span className="cms-table-head-cell" />
        </div>

        {users.map((user) => {
          const initials = getInitials(user.name)
          const avatarBg = AVATAR_COLORS[user.role] ?? '#2c2c33'
          return (
            <div
              key={user.id}
              className="cms-table-row cms-table-row--no-hover"
              style={{ gridTemplateColumns: 'minmax(0,2.2fr) 1fr 1fr 1fr auto' }}
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
                  <div
                    style={{
                      fontFamily: 'var(--font-heading, Georgia, serif)',
                      fontSize: 16,
                      fontWeight: 400,
                      color: 'var(--color-text)',
                    }}
                  >
                    {user.name}
                  </div>
                  <div className="cms-mono" style={{ marginTop: 2 }}>{user.email}</div>
                </div>
              </div>

              {/* Role */}
              <span>
                <span className={roleClass(user.role)}>{roleLabel(user.role)}</span>
              </span>

              {/* 2FA */}
              <span>
                <span className="cms-status-dot">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: user.totpEnrolled ? '#1f8a5b' : '#fa971a',
                      display: 'inline-block',
                      flex: 'none',
                    }}
                  />
                  {user.totpEnrolled ? 'Enrolled' : 'Pending'}
                </span>
              </span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Link href={`/admin/users/${user.id}`}>
                  <button
                    type="button"
                    className="cms-btn cms-btn-ghost"
                    style={{ height: 34, padding: '0 14px', fontSize: 12 }}
                  >
                    Edit
                  </button>
                </Link>
              </div>

              {/* Delete */}
              <div>
                {user.id !== session.userId && (
                  <DeleteUserButton id={user.id} name={user.name} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
