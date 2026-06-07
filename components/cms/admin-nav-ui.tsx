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
    <header className="flex items-center justify-between h-[62px] px-[26px] bg-[var(--chrome)] border-b border-[var(--chrome-border)] flex-none relative z-10">
      <div className="flex items-center gap-[28px]">
        <Link href="/admin/pages" className="flex items-center gap-[9px] no-underline">
          <span className="font-body font-bold text-[20px] tracking-[-0.015em] text-primary leading-none">paperhouse</span>
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--chrome-muted)] border border-[var(--chrome-border)] rounded-[4px] px-[6px] py-[3px] leading-none">CMS</span>
        </Link>

        <nav className="flex items-center gap-[4px]">
          <Link
            href="/admin/pages"
            className={`font-mono text-[12.5px] tracking-[0.06em] px-[14px] py-[7px] rounded-full cursor-pointer no-underline whitespace-nowrap transition-[background,color] duration-150 ${onPages ? 'bg-primary text-offwhite' : 'text-[var(--chrome-muted)] bg-transparent hover:text-[#1a1a1a] hover:bg-[rgba(26,26,26,0.06)]'}`}
          >
            Pages
          </Link>
          <Link
            href="/admin/media"
            className={`font-mono text-[12.5px] tracking-[0.06em] px-[14px] py-[7px] rounded-full cursor-pointer no-underline whitespace-nowrap transition-[background,color] duration-150 ${onMedia ? 'bg-primary text-offwhite' : 'text-[var(--chrome-muted)] bg-transparent hover:text-[#1a1a1a] hover:bg-[rgba(26,26,26,0.06)]'}`}
          >
            Media
          </Link>
          {showUsers && (
            <Link
              href="/admin/users"
              className={`font-mono text-[12.5px] tracking-[0.06em] px-[14px] py-[7px] rounded-full cursor-pointer no-underline whitespace-nowrap transition-[background,color] duration-150 ${onUsers ? 'bg-primary text-offwhite' : 'text-[var(--chrome-muted)] bg-transparent hover:text-[#1a1a1a] hover:bg-[rgba(26,26,26,0.06)]'}`}
            >
              Users
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-[12px]">
        {initials && (
          <span className="w-[30px] h-[30px] rounded-full bg-text text-offwhite font-mono text-[11px] inline-flex items-center justify-center font-medium flex-none tracking-[0.02em]">{initials}</span>
        )}
        <LogoutButton />
      </div>
    </header>
  )
}
