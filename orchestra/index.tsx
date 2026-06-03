'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Cmdo } from './cmdo'
import Orchestra from './orchestra'

const Stats = dynamic(() => import('./stats').then(({ Stats }) => Stats), {
  ssr: false,
})

const GridDebugger = dynamic(
  () => import('./grid').then(({ GridDebugger }) => GridDebugger),
  { ssr: false }
)

const Minimap = dynamic(
  () => import('./minimap').then(({ Minimap }) => Minimap),
  { ssr: false }
)

export function OrchestraTools() {
  const pathname = usePathname()
  const { stats, grid, dev, minimap, screenshot } = useOrchestra()

  useEffect(() => {
    document.documentElement.classList.toggle('dev', Boolean(dev))
  }, [dev])

  useEffect(() => {
    document.documentElement.classList.toggle('screenshot', Boolean(screenshot))
  }, [screenshot])

  if (process.env.NODE_ENV !== 'development') return null
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <Cmdo />
      {stats && <Stats />}
      {grid && <GridDebugger />}
      {minimap && <Minimap />}
    </>
  )
}

export function useOrchestra() {
  const [state, setState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    return Orchestra.subscribe(
      (state) => state,
      (state) => setState(state),
      {
        fireImmediately: true,
      }
    )
  }, [])

  return state
}
