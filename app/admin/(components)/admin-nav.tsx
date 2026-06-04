import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { AdminNavUI } from './admin-nav-ui'

export async function AdminNav() {
  const session = await getSession()
  if (!session.isLoggedIn) return null

  const showUsers = session.role ? canPerform(session.role, 'manage_users') : false

  return <AdminNavUI showUsers={showUsers} />
}
