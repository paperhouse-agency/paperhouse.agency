'use client'

import cn from 'clsx'
import { useState } from 'react'

import { Navigation } from '@/app/(pages)/(components)/navigation'
import { Button } from '@/components/button'
import { Image } from '@/components/image'
import { Link } from '@/components/link'

// Hamburger menu button component
function HamburgerMenu({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="p-2 rounded-md md:hidden"
      onClick={onClick}
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
    >
      <div className="relative w-6 h-6 flex flex-col justify-center">
        <span
          className={cn(
            'block h-0.5 w-6 bg-current transition-all duration-300 absolute',
            isOpen ? 'rotate-45' : '-translate-y-1'
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-6 bg-current transition-all duration-300',
            isOpen ? 'opacity-0' : 'opacity-100'
          )}
        />
        <span
          className={cn(
            'block h-0.5 w-6 bg-current transition-all duration-300 absolute',
            isOpen ? '-rotate-45' : 'translate-y-1'
          )}
        />
      </div>
    </button>
  )
}

// Drawer component for mobile navigation
function Drawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigationLinks = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT US' },
    { href: '/services', label: 'SERVICES' },
    { href: '/blog', label: 'BLOG' },
  ]

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useSemanticElements: Backdrop div is appropriate for overlay */}
      <div
        role="button"
        tabIndex={0}
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose()
          }
        }}
        aria-label="Close navigation menu"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-5 h-full flex flex-col">
          {/* Logo in drawer */}
          <div className="flex items-center h-[30px] mb-8">
            <Image
              src="/logo.png"
              alt="PaperHouse Agency"
              width={130}
              height={30}
              block
              priority
              unoptimized
            />
          </div>

          {/* Navigation links */}
          <nav className="flex-1">
            <ul className="space-y-4">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 px-3 text-text hover:text-primary transition-colors"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Divider */}
          <div className="my-4 h-px bg-bluishgray w-full" />

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              variant="default"
              color="neutral"
              size="sm"
              className="mono uppercase w-full justify-center"
              onClick={onClose}
            >
              BOOK A MEETING
            </Button>
            <Button
              variant="default"
              color="primary"
              size="sm"
              className="mono uppercase w-full justify-center"
              onClick={onClose}
            >
              LOGIN
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  return (
    <>
      <header className="w-full p-5">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto p-5 bg-white rounded-lg shadow-[4px_4px_16px_0_rgba(0,0,0,0.08)]">
          {/* Logo */}
          <div className="flex items-center h-[30px]">
            <Image
              src="/logo.png"
              alt="PaperHouse Agency"
              width={130}
              height={30}
              block
              unoptimized
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <Navigation />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="default"
              color="neutral"
              size="sm"
              className="mono uppercase"
            >
              BOOK A MEETING
            </Button>
            <Button
              variant="default"
              color="primary"
              size="sm"
              className="mono uppercase"
            >
              LOGIN
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <HamburgerMenu isOpen={isDrawerOpen} onClick={toggleDrawer} />
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}
