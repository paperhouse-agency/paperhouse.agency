'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Link } from '@/components/link'
import { CmsSaveStatus } from './cms-save-status'

function UserDropdown({ initials, name }: { initials: string; name: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function handleSignOut() {
    await fetch('/api/admin/auth/logout', {
      method: 'POST',
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    })
    window.location.href = '/admin/login'
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[8px] h-[36px] pl-[5px] pr-[10px] rounded-full cursor-pointer border border-[var(--chrome-border)] bg-white"
      >
        <span className="w-[26px] h-[26px] rounded-full bg-primary text-white font-mono text-[10px] inline-flex items-center justify-center font-medium flex-none tracking-[0.02em]">
          {initials}
        </span>
        <span className="font-mono text-[12.5px] tracking-[0.04em] text-primary whitespace-nowrap">
          {name}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`text-[var(--chrome-muted)] flex-none transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] min-w-[140px] bg-white border border-[var(--chrome-border)] rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.10)] overflow-hidden z-50">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-[8px] px-[14px] py-[10px] font-mono text-[12.5px] tracking-[0.04em] text-primary cursor-pointer border-none bg-transparent text-left whitespace-nowrap"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export function AdminNavUI({ showUsers, showNavigation, initials, name }: { showUsers: boolean; showNavigation: boolean; initials: string; name: string }) {
  const pathname = usePathname()

  const onUsers = pathname?.startsWith('/admin/users') ?? false
  const onMedia = pathname?.startsWith('/admin/media') ?? false
  const onNavigation = pathname?.startsWith('/admin/slots') ?? false
  const onPages = !(onUsers || onMedia || onNavigation)

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
            className={`font-mono text-[12.5px] tracking-[0.06em] px-[14px] py-[7px] rounded-full cursor-pointer no-underline whitespace-nowrap transition-[background,color] duration-150 ${onPages ? '!bg-secondary !text-white' : 'text-[var(--chrome-muted)] bg-transparent hover:text-[#1a1a1a] hover:bg-[rgba(26,26,26,0.06)]'}`}
          >
            Pages
          </Link>
          <Link
            href="/admin/media"
            className={`font-mono text-[12.5px] tracking-[0.06em] px-[14px] py-[7px] rounded-full cursor-pointer no-underline whitespace-nowrap transition-[background,color] duration-150 ${onMedia ? '!bg-secondary !text-white' : 'text-[var(--chrome-muted)] bg-transparent hover:text-[#1a1a1a] hover:bg-[rgba(26,26,26,0.06)]'}`}
          >
            Media
          </Link>
          {showNavigation && (
            <Link
              href="/admin/slots"
              className={`font-mono text-[12.5px] tracking-[0.06em] px-[14px] py-[7px] rounded-full cursor-pointer no-underline whitespace-nowrap transition-[background,color] duration-150 ${onNavigation ? '!bg-secondary !text-white' : 'text-[var(--chrome-muted)] bg-transparent hover:text-[#1a1a1a] hover:bg-[rgba(26,26,26,0.06)]'}`}
            >
              Site Slots
            </Link>
          )}
          {showUsers && (
            <Link
              href="/admin/users"
              className={`font-mono text-[12.5px] tracking-[0.06em] px-[14px] py-[7px] rounded-full cursor-pointer no-underline whitespace-nowrap transition-[background,color] duration-150 ${onUsers ? '!bg-secondary !text-white' : 'text-[var(--chrome-muted)] bg-transparent hover:text-[#1a1a1a] hover:bg-[rgba(26,26,26,0.06)]'}`}
            >
              Users
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-[12px]">
        <CmsSaveStatus />
        {initials && <UserDropdown initials={initials} name={name} />}
      </div>
    </header>
  )
}
