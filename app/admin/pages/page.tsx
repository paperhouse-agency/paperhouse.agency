import { listPages } from '@/libs/cms/storage'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { Link } from '@/components/link'
import { DeletePageButton } from './(components)/delete-page-button'
import { DuplicatePageButton } from './(components)/duplicate-page-button'

export default async function PagesPage() {
  const session = await getSession()
  const pages = await listPages()
  const canCreate = session.role ? canPerform(session.role, 'create_page') : false
  const canDelete = session.role ? canPerform(session.role, 'delete_page') : false
  const canDuplicate = canCreate

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ margin: 0 }}>Pages</h1>
        {canCreate && (
          <Link href="/admin/pages/new">
            <button type="button" data-variant="primary">+ New page</button>
          </Link>
        )}
      </div>

      {pages.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
          No pages yet. Create your first page.
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>File</th>
              <th>Status</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td>
                  <Link href={`/admin/pages/${page.id}`} style={{ fontWeight: 500 }}>
                    {page.title}
                  </Link>
                </td>
                <td>
                  <span className="admin-slug">
                    {page.slug === '' ? 'index' : page.slug}.json
                  </span>
                </td>
                <td>
                  <span className={`admin-badge admin-badge-${page.status}`}>
                    {page.status}
                  </span>
                </td>
                <td className="admin-muted">
                  {new Date(page.updatedAt).toLocaleDateString()}
                </td>
                <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <Link href={`/admin/pages/${page.id}`}>
                    <button type="button" data-variant="secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>Edit</button>
                  </Link>
                  {canDuplicate && <DuplicatePageButton id={page.id} />}
                  {canDelete && <DeletePageButton id={page.id} title={page.title} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
