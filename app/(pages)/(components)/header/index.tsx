'use client'

import cn from 'clsx'
import { useState } from 'react'

import { Button } from '@/components/button'
import { Link } from '@/components/link'

const EXPLORE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Process', href: '/process' },
]

const PRODUCTS = [
  {
    name: 'Habitly',
    description: 'Build lasting habits with science-backed tracking',
    href: '/products/habitly',
  },
  {
    name: 'Shifa',
    description: 'Modern healthcare management for clinics',
    href: '/products/shifa',
  },
]

const WORK_LINKS = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Case Studies', href: '/work' },
  { label: 'Industries', href: '/industries' },
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
            'mx-auto bg-white/80 backdrop-blur-md rounded-[25px] shadow-[4px_4px_24px_0_rgba(0,0,0,0.10)] overflow-hidden',
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

            {/* Center: logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-[100px] dt:px-0">
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

            {/* Right: CTA */}
            <Button variant="tertiary" color="neutral" size="sm" hasIcon className="mono uppercase">
              <span className="dt:hidden">TALK</span>
              <span className="hidden dt:inline">LET'S TALK</span>
            </Button>
          </div>

          {/* Mega menu */}
          <div
            className={cn(
              'overflow-y-auto',
              isOpen
                ? 'max-h-[calc(100dvh-72px)] dt:max-h-[600px] opacity-100 transition-[max-height,opacity] duration-250 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]'
                : 'max-h-0 opacity-0 transition-[max-height,opacity] duration-150 delay-0 ease-[cubic-bezier(0.16,1,0.3,1)]'
            )}
          >
            <div className="h-px bg-bluishgray mx-6" />
            <div className="grid grid-cols-2 dt:grid-cols-4 relative">

              {/* Column dividers — not full height */}
              <div className="hidden dt:block absolute left-1/4 top-6 bottom-6 w-px bg-bluishgray" />
              <div className="hidden dt:block absolute left-2/4 top-6 bottom-6 w-px bg-bluishgray" />
              <div className="hidden dt:block absolute left-3/4 top-6 bottom-6 w-px bg-bluishgray" />

              {/* Col 1: Explore */}
              <div className="px-6 py-6 dt:px-8 dt:py-7 border-b border-bluishgray dt:border-b-0">
                <p className="mono-wide text-[10px] text-text/35 mb-4 tracking-widest">Explore</p>
                <ul className="flex flex-col gap-2">
                  {EXPLORE_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="heading-4 text-text hover:text-primary transition-colors block"
                        onClick={close}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: Products */}
              <div className="px-6 py-6 dt:px-8 dt:py-7 border-b border-bluishgray dt:border-b-0">
                <p className="mono-wide text-[10px] text-text/35 mb-4 tracking-widest">Products</p>
                <ul className="flex flex-col gap-4">
                  {PRODUCTS.map((product) => (
                    <li key={product.name}>
                      <Link
                        href={product.href}
                        className="group block"
                        onClick={close}
                      >
                        <span className="heading-4 text-text group-hover:text-primary transition-colors block">
                          {product.name}
                        </span>
                        <span className="body-small text-text/50 mt-0.5 block">
                          {product.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Work */}
              <div className="px-6 py-6 dt:px-8 dt:py-7">
                <p className="mono-wide text-[10px] text-text/35 mb-4 tracking-widest">Work</p>
                <ul className="flex flex-col gap-2">
                  {WORK_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="heading-4 text-text hover:text-primary transition-colors block"
                        onClick={close}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4: Featured */}
              <div className="px-6 py-6 dt:px-8 dt:py-7 flex flex-col gap-3">
                <p className="mono-wide text-[10px] text-text/35 tracking-widest">Latest Product</p>
                <div className="flex-1 rounded-[14px] bg-secondary min-h-[120px] dt:min-h-[160px]">
                  <div className="p-5 h-full flex flex-col items-center justify-center gap-3 text-center">
                    <p className="heading-4 text-white">Habitly</p>
                    <div className="w-full rounded-[10px] overflow-hidden bg-white/10 aspect-[16/7]">
                      <img
                        src="https://placehold.co/400x175/ffffff/cccccc?text=Habitly"
                        alt="Habitly app preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <Button
                      variant="tertiary"
                      color="neutral"
                      size="sm"
                      hasIcon
                      className="mono uppercase text-white"
                      onClick={close}
                    >
                      Explore
                    </Button>
                  </div>
                </div>
              </div>

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
          'fixed top-0 left-0 w-screen h-screen z-[48] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={close}
        onKeyDown={(e) => e.key === 'Escape' && close()}
      />

      {/* Progressive blur — top */}
      <div className="fixed top-0 left-0 right-0 h-[120px] z-[49] pointer-events-none">
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 12%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 12%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 25%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 25%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 42%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 42%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 78%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 78%)' }} />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 95%)' }} />
      </div>

      {/* Progressive blur — bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-[120px] z-[49] pointer-events-none">
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
