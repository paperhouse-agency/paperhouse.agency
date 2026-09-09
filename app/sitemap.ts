import type { MetadataRoute } from 'next'
import { getAllPageSeo } from '@/libs/seo/queries'
import { ROUTES } from '@/libs/seo/routes'

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:3000'

/**
 * The route list comes from code (content is code); HQ-managed SEO data only
 * enriches it — `no_index` rows are dropped, `updated_at` sets lastModified.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seoBySlug = await getAllPageSeo()

  return ROUTES.filter((route) => route.sitemap)
    .filter((route) => !seoBySlug[route.slug]?.noIndex)
    .map((route) => {
      const updatedAt = seoBySlug[route.slug]?.updatedAt
      return {
        url: route.slug === '/' ? APP_BASE_URL : `${APP_BASE_URL}${route.slug}`,
        lastModified: updatedAt ? new Date(updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: route.slug === '/' ? 1 : 0.7,
      }
    })
}
