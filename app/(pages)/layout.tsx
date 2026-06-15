import type { PropsWithChildren } from 'react'
import { getNavigation } from '@/libs/cms/get-navigation'
import { Header } from './(components)/header'

export default async function PagesLayout({ children }: PropsWithChildren) {
  const navigation = await getNavigation()
  return (
    <>
      <Header navItems={navigation.header.items} />
      {children}
    </>
  )
}
