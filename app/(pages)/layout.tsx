import type { PropsWithChildren } from 'react'
import { Preloader } from '@/components/preloader'
import { NAVIGATION } from '@/content/navigation'
import { Header } from './(components)/header'

export default function PagesLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Preloader />
      <Header navItems={NAVIGATION.header.items} />
      {children}
    </>
  )
}
