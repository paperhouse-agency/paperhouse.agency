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

  const publishedCount = pages.filter((p) => p.status === 'published').length
  const draftCount = pages.filter((p) => p.status === 'draft').length

  return (
    <div className="cms-page">
      <div className="cms-list-header">
        <div>
          <span className="cms-list-eyebrow">Content</span>
          <h1 className="cms-list-title">
            Pages<span className="dot">.</span>
          </h1>
          <p className="cms-list-sub">
            {pages.length} page{pages.length !== 1 ? 's' : ''} · {publishedCount} published · {draftCount} draft{draftCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="cms-list-actions">
          {canCreate && (
            <Link href="/admin/pages/new" className="cms-btn cms-btn-primary">
              <span>+</span>
              New page
            </Link>
          )}
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="cms-table-card">
          <div className="cms-table-empty">
            No pages yet. Create your first page.
          </div>
        </div>
      ) : (
        <div className="cms-table-card">
          <div
            className="cms-table-head"
            style={{ gridTemplateColumns: 'minmax(0,2.2fr) 1.2fr 0.9fr 0.8fr 1.4fr auto' }}
          >
            <span className="cms-table-head-cell">Page</span>
            <span className="cms-table-head-cell">URL</span>
            <span className="cms-table-head-cell">Status</span>
            <span className="cms-table-head-cell">Updated</span>
            <span className="cms-table-head-cell" />
            <span className="cms-table-head-cell" />
          </div>

          {pages.map((page) => {
            const isHome = page.slug === '' || page.slug === 'index'
            return (
              <div
                key={page.id}
                className="cms-table-row"
                style={{ gridTemplateColumns: 'minmax(0,2.2fr) 1.2fr 0.9fr 0.8fr 1.4fr auto' }}
              >
                {/* Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                      <Link
                        href={`/admin/pages/${page.id}`}
                        style={{
                          fontFamily: 'var(--font-heading, Georgia, serif)',
                          fontSize: 16,
                          fontWeight: 400,
                          color: 'var(--color-text)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {page.title}
                      </Link>
                      {isHome && <span className="cms-badge cms-badge-home">Homepage</span>}
                    </div>
                  </div>
                </div>

                {/* URL */}
                <span className="cms-mono" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isHome ? '/' : `/${page.slug}`}
                </span>

                {/* Status */}
                <span>
                  <span className={`cms-badge cms-badge-${page.status === 'published' ? 'pub' : 'draft'}`}>
                    {page.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </span>

                {/* Updated */}
                <span className="cms-text-muted" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5 }}>
                  {new Date(page.updatedAt).toLocaleDateString()}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Link href={`/admin/pages/${page.id}`}>
                    <button
                      type="button"
                      className="cms-btn cms-btn-ghost"
                      style={{ height: 34, padding: '0 14px', fontSize: 12 }}
                    >
                      Edit
                    </button>
                  </Link>
                  {canDuplicate && <DuplicatePageButton id={page.id} />}
                </div>

                {/* Delete */}
                <div>
                  {canDelete && <DeletePageButton id={page.id} title={page.title} />}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
