import { unstable_cache } from 'next/cache'
import type { CmsNavigation } from './types'

export const getNavigation = unstable_cache(
  async (): Promise<CmsNavigation> => {
    const { readNavigation } = await import('./storage')
    return readNavigation()
  },
  ['cms-navigation'],
  { tags: ['cms-navigation'] }
)
