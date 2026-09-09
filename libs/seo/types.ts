/**
 * SEO/GEO types
 *
 * These mirror the `page_seo` and `site_seo` tables owned and migrated by HQ
 * (hq.paperhouse.agency). This app is a read-only consumer — it never creates
 * or alters those tables.
 */

export interface PageSeo {
  slug: string
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  noIndex?: boolean
  jsonLd?: Record<string, unknown> | null
  updatedAt?: string
}

export interface SiteSeo {
  orgName?: string
  orgLogo?: string
  socialUrls?: string[]
  defaultOg?: string
  allowAiCrawlers: boolean
  updatedAt?: string
}

/** Fallbacks used when the database is unreachable or has no row yet. */
export const SITE_SEO_FALLBACK: SiteSeo = {
  orgName: 'PaperHouse',
  allowAiCrawlers: true,
}
