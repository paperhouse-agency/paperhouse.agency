import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readUsers } from '@/libs/cms/storage'
import { EditUserForm } from '@/components/cms/edit-user-form'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!(session.role && canPerform(session.role, 'manage_users'))) {
    redirect('/admin/pages' as string as never)
  }

  const { id } = await params
  const users = await readUsers()
  const user = users.find((u) => u.id === id)
  if (!user) notFound()

  const { passwordHash: _, totpSecret: __, ...safeUser } = user
  return <EditUserForm user={safeUser} />
}
