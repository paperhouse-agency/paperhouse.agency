'use client'

import { usePathname } from 'next/navigation'
import { Link } from '@/components/link'
import { LogoutButton } from './logout-button'

export function AdminNavUI({ showUsers, initials }: { showUsers: boolean; initials: string }) {
  const pathname = usePathname()

  const onUsers = pathname?.startsWith('/admin/users') ?? false
  const onMedia = pathname?.startsWith('/admin/media') ?? false
  const onPages = !(onUsers || onMedia)

  return (
    <header className="cms-nav">
      <div className="cms-nav-left">
        <Link href="/admin/pages" className="cms-nav-brand">
          <span className="cms-nav-wordmark">paperhouse</span>
          <span className="cms-nav-tag">CMS</span>
        </Link>

        <nav className="cms-nav-links">
          <Link
            href="/admin/pages"
            className={`cms-nav-pill${onPages ? ' active' : ''}`}
          >
            Pages
          </Link>
          <Link
            href="/admin/media"
            className={`cms-nav-pill${onMedia ? ' active' : ''}`}
          >
            Media
          </Link>
          {showUsers && (
            <Link
              href="/admin/users"
              className={`cms-nav-pill${onUsers ? ' active' : ''}`}
            >
              Users
            </Link>
          )}
        </nav>
      </div>

      <div className="cms-nav-right">
        {initials && (
          <span className="cms-nav-avatar">{initials}</span>
        )}
        <LogoutButton />
      </div>
    </header>
  )
}
