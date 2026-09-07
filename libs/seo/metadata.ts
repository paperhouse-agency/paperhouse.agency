import type { Metadata } from 'next'
import { generatePageMetadata } from '@/libs/metadata'
import { getPageSeo, getSiteSeo } from './queries'
import { getRoute } from './routes'

/**
 * Build a route's metadata from HQ-managed SEO data, falling back to the
 * in-code defaults in `routes.ts` for any field HQ has not set.
 *
 * Usage in a route:
 *   export const generateMetadata = () => buildMetadata('/')
 */
export async function buildMetadata(slug: string): Promise<Metadata> {
  const route = getRoute(slug)
  const [seo, site] = await Promise.all([getPageSeo(slug), getSiteSeo()])

  const title = seo?.title || route?.defaults.title
  const metadata = generatePageMetadata({
    title,
    description: seo?.description || route?.defaults.description,
    keywords: seo?.keywords,
    image: { url: seo?.ogImage || site.defaultOg },
    url: slug,
    siteName: site.orgName,
    noIndex: seo?.noIndex ?? false,
  })

  // The root layout defines a `%s - PaperHouse` title template. Marketing sets
  // the exact title in HQ (with a character counter), so bypass the template —
  // otherwise the brand is appended twice and the counter lies.
  if (title) {
    metadata.title = { absolute: title }
    if (metadata.openGraph) metadata.openGraph.title = { absolute: title }
    if (metadata.twitter) metadata.twitter.title = { absolute: title }
  }

  return metadata
}
