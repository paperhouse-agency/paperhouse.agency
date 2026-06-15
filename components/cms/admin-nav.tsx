import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readUsers } from '@/libs/cms/storage'
import { AdminNavUI } from './admin-nav-ui'

export async function AdminNav() {
  const session = await getSession()
  if (!session.isLoggedIn) return null

  const showUsers = session.role ? canPerform(session.role, 'manage_users') : false
  const showNavigation = session.role ? canPerform(session.role, 'manage_settings') : false

  let initials = ''
  if (session.userId) {
    try {
      const users = await readUsers()
      const user = users.find((u) => u.id === session.userId)
      if (user) {
        initials = user.name
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      }
    } catch {
      // non-fatal — nav renders without avatar if blob is unavailable
    }
  }

  return <AdminNavUI showUsers={showUsers} showNavigation={showNavigation} initials={initials} />
}
