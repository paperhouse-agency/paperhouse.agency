import { getPageSeo, getSiteSeo } from '@/libs/seo/queries'

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:3000'

/**
 * Renders JSON-LD structured data for a route.
 *
 * Organization schema comes from the site-wide settings HQ manages; a page can
 * override or extend it with its own `json_ld` object. Both reads share the
 * same cache as `generateMetadata`, so this adds no extra database cost.
 */
export async function JsonLd({ slug }: { slug: string }) {
  const [site, page] = await Promise.all([getSiteSeo(), getPageSeo(slug)])

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.orgName,
    url: APP_BASE_URL,
    ...(site.orgLogo && { logo: site.orgLogo }),
    ...(site.socialUrls?.length && { sameAs: site.socialUrls }),
  }

  const graph = page?.jsonLd ? [organization, page.jsonLd] : [organization]

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      type="application/ld+json"
    />
  )
}
