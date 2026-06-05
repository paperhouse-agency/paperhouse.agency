import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readUsers } from '@/libs/cms/storage'
import { redirect } from 'next/navigation'
import { UsersListClient } from '@/components/cms/users-list-client'

export default async function UsersPage() {
  const session = await getSession()
  if (!(session.role && canPerform(session.role, 'manage_users'))) {
    redirect('/admin/pages' as string as never)
  }

  const users = await readUsers()

  return (
    <UsersListClient
      users={users}
      currentUserId={session.userId}
      canManage={true}
    />
  )
}
