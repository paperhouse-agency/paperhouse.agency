'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'
import { Link } from '@/components/link'

const LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT US' },
  { href: '/services', label: 'SERVICES' },
  { href: '/blog', label: 'BLOG' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-8 mono">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn('link', pathname === link.href && 'underline')}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
