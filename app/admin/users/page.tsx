import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readUsers } from '@/libs/cms/storage'
import { Link } from '@/components/link'
import { redirect } from 'next/navigation'
import { DeleteUserButton } from './(components)/delete-user-button'

export default async function UsersPage() {
  const session = await getSession()
  if (!(session.role && canPerform(session.role, 'manage_users'))) {
    redirect('/admin/pages' as string as never)
  }

  const users = await readUsers()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Users</h1>
        <Link href="/admin/users/new">+ New User</Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem 0.75rem' }}>Name</th>
            <th style={{ padding: '0.5rem 0.75rem' }}>Email</th>
            <th style={{ padding: '0.5rem 0.75rem' }}>Role</th>
            <th style={{ padding: '0.5rem 0.75rem' }}>2FA</th>
            <th style={{ padding: '0.5rem 0.75rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem 0.75rem' }}>{user.name}</td>
              <td style={{ padding: '0.5rem 0.75rem' }}>{user.email}</td>
              <td style={{ padding: '0.5rem 0.75rem' }}>{user.role}</td>
              <td style={{ padding: '0.5rem 0.75rem' }}>{user.totpEnrolled ? 'Enrolled' : 'Pending'}</td>
              <td style={{ padding: '0.5rem 0.75rem', display: 'flex', gap: '0.5rem' }}>
                <Link href={`/admin/users/${user.id}`}>Edit</Link>
                {user.id !== session.userId && (
                  <DeleteUserButton id={user.id} name={user.name} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
