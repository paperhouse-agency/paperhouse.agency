'use client'

import { Navigation } from '@/app/(pages)/(components)/navigation'
import { Button } from '@/components/button'
import { Image } from '@/components/image'

export function Header() {
  return (
    <header className="w-full p-5">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto p-5 bg-white rounded-lg shadow-[4px_4px_16px_0_rgba(0,0,0,0.08)]">
        <div className="flex items-center h-[30px]">
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

        <Navigation />

        <div className="flex items-center gap-3">
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
      </div>
    </header>
  )
}
