import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { Link } from '@/components/link'
import { LogoutButton } from './logout-button'

export async function AdminNav() {
  const session = await getSession()
  if (!session.isLoggedIn) return null

  return (
    <nav className="admin-nav">
      <span className="admin-nav-brand">PaperHouse</span>
      <Link href="/admin/pages" className="admin-nav-link">Pages</Link>
      {session.role && canPerform(session.role, 'manage_users') && (
        <Link href="/admin/users" className="admin-nav-link">Users</Link>
      )}
      <span style={{ marginLeft: 'auto' }}>
        <LogoutButton />
      </span>
    </nav>
  )
}
