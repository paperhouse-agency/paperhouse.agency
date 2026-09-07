import type { PropsWithChildren } from 'react'
import { NAVIGATION } from '@/content/navigation'
import { Header } from './(components)/header'

export default function PagesLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header navItems={NAVIGATION.header.items} />
      {children}
    </>
  )
}
