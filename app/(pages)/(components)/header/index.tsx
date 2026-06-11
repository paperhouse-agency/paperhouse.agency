'use client'

import cn from 'clsx'
import { useState } from 'react'

import { Button } from '@/components/button'
import { Image } from '@/components/image'
import { Link } from '@/components/link'

const MEGA_MENU_COLS = [
  {
    title: 'Pages',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Work',
    links: [
      { label: 'Case Studies', href: '/work' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Industries', href: '/industries' },
      { label: 'Our Process', href: '/process' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-[18px] h-[18px] shrink-0 flex flex-col justify-center gap-[5px]">
      <span
        className={cn(
          'block h-0.5 w-full bg-current transition-all duration-300 ease-in-out origin-center',
          isOpen ? 'rotate-45 translate-y-[3.5px]' : ''
        )}
      />
      <span
        className={cn(
          'block h-0.5 w-full bg-current transition-all duration-300 ease-in-out origin-center',
          isOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
        )}
      />
    </div>
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((v) => !v)
  const close = () => setIsOpen(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-5">
        <div
          className={cn(
            'mx-auto bg-white rounded-[25px] shadow-[4px_4px_24px_0_rgba(0,0,0,0.10)] overflow-hidden',
            'transition-[max-width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            isOpen ? 'max-w-[1400px] delay-0' : 'max-w-[580px] delay-150'
          )}
        >
          {/* Top bar */}
          <div className="relative flex items-center justify-between ps-5 pe-4 py-4">
            {/* Left: menu toggle */}
            <button
              type="button"
              onClick={toggle}
              className="flex items-center gap-2.5 text-text w-fit"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <MenuIcon isOpen={isOpen} />
              <span className="mono">{isOpen ? 'CLOSE' : 'MENU'}</span>
            </button>

            {/* Center: logo — spans full bar, centers content, sits behind left/right controls */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img
                src="/PAPERHOUSE_ALT.svg"
                alt="PaperHouse Agency"
                className={cn('transition-opacity duration-150', isOpen ? 'opacity-0' : 'opacity-100')}
                style={{ maxHeight: '16px', width: 'auto' }}
              />
              <img
                src="/PAPERHOUSE.svg"
                alt="PaperHouse Agency"
                className={cn('absolute transition-opacity duration-150', isOpen ? 'opacity-100' : 'opacity-0')}
                style={{ maxHeight: '16px', width: 'auto' }}
              />
            </div>

            {/* Right: CTA buttons */}
            <Button variant="tertiary" color="neutral" size="sm" hasIcon className="mono uppercase">
              LET'S TALK
            </Button>
          </div>

          {/* Mega menu */}
          <div
            className={cn(
              'overflow-hidden',
              isOpen
                ? 'max-h-[600px] opacity-100 transition-[max-height,opacity] duration-250 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]'
                : 'max-h-0 opacity-0 transition-[max-height,opacity] duration-150 delay-0 ease-[cubic-bezier(0.16,1,0.3,1)]'
            )}
          >
            <div className="h-px bg-bluishgray mx-6" />
            <div className="grid grid-cols-4">
              {MEGA_MENU_COLS.map((col, i) => (
                <div
                  key={col.title}
                  className={cn(
                    'px-8 py-8',
                    i < MEGA_MENU_COLS.length - 1 && 'border-r border-bluishgray'
                  )}
                >
                  <p className="mono-wide text-text/40 mb-6">{col.title}</p>
                  <ul className="flex flex-col gap-4">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="heading-3 text-text hover:text-primary transition-colors block"
                          onClick={close}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        role="button"
        tabIndex={-1}
        aria-label="Close menu"
        className={cn(
          'fixed top-0 left-0 w-screen h-screen z-[48] bg-black/20 backdrop-blur-[2px] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        onClick={close}
        onKeyDown={(e) => e.key === 'Escape' && close()}
      />

      {/* Progressive blur — top */}
      <div className="fixed top-0 left-0 right-0 h-[220px] z-[49] pointer-events-none">
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 12%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 12%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 25%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 25%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 42%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 42%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 78%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 78%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 95%)' }} />
      </div>

      {/* Progressive blur — bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-[220px] z-[49] pointer-events-none">
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', maskImage: 'linear-gradient(to top, black 0%, transparent 12%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 12%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', maskImage: 'linear-gradient(to top, black 0%, transparent 25%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 25%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', maskImage: 'linear-gradient(to top, black 0%, transparent 42%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 42%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', maskImage: 'linear-gradient(to top, black 0%, transparent 60%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', maskImage: 'linear-gradient(to top, black 0%, transparent 78%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 78%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)', maskImage: 'linear-gradient(to top, black 0%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 95%)' }} />
      </div>
    </>
  )
}
