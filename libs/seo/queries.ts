import { sql } from '@vercel/postgres'
import { cacheLife, cacheTag } from 'next/cache'
import { type PageSeo, SITE_SEO_FALLBACK, type SiteSeo } from './types'

/**
 * Read-only SEO/GEO queries against the shared Neon database.
 *
 * HQ (hq.paperhouse.agency) owns these tables and their migrations — this app
 * only reads. Every read is cached indefinitely and tagged, so visitors never
 * hit the database; HQ purges a tag via `POST /api/revalidate` after a save.
 *
 * All reads fail soft: if the database is unreachable or a table does not exist
 * yet, callers fall back to the in-code defaults in `routes.ts` rather than
 * breaking the page.
 */

export const pageSeoTag = (slug: string) => `seo-page:${slug}`
export const SITE_SEO_TAG = 'seo-site'
export const SITEMAP_TAG = 'seo-sitemap'

export async function getPageSeo(slug: string): Promise<PageSeo | null> {
  'use cache'
  cacheTag(pageSeoTag(slug))
  cacheLife('max')

  try {
    const { rows } = await sql`
      SELECT slug, title, description, keywords, og_image, no_index, json_ld, updated_at
      FROM page_seo
      WHERE slug = ${slug}
      LIMIT 1
    `
    const row = rows[0]
    if (!row) return null

    return {
      slug: row.slug as string,
      title: (row.title as string) ?? undefined,
      description: (row.description as string) ?? undefined,
      keywords: (row.keywords as string[]) ?? undefined,
      ogImage: (row.og_image as string) ?? undefined,
      noIndex: (row.no_index as boolean) ?? false,
      jsonLd: (row.json_ld as Record<string, unknown>) ?? null,
      updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    }
  } catch (error) {
    console.warn(`[seo] page_seo read failed for "${slug}":`, error)
    return null
  }
}

export async function getSiteSeo(): Promise<SiteSeo> {
  'use cache'
  cacheTag(SITE_SEO_TAG)
  cacheLife('max')

  try {
    const { rows } = await sql`
      SELECT org_name, org_logo, social_urls, default_og, allow_ai_crawlers, updated_at
      FROM site_seo
      WHERE id = 'default'
      LIMIT 1
    `
    const row = rows[0]
    if (!row) return SITE_SEO_FALLBACK

    return {
      orgName: (row.org_name as string) ?? SITE_SEO_FALLBACK.orgName,
      orgLogo: (row.org_logo as string) ?? undefined,
      socialUrls: (row.social_urls as string[]) ?? undefined,
      defaultOg: (row.default_og as string) ?? undefined,
      allowAiCrawlers: (row.allow_ai_crawlers as boolean) ?? true,
      updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    }
  } catch (error) {
    console.warn('[seo] site_seo read failed:', error)
    return SITE_SEO_FALLBACK
  }
}

/** All SEO rows, for sitemap enrichment. Keyed by slug. */
export async function getAllPageSeo(): Promise<Record<string, PageSeo>> {
  'use cache'
  cacheTag(SITEMAP_TAG)
  cacheLife('max')

  try {
    const { rows } = await sql`
      SELECT slug, no_index, updated_at FROM page_seo
    `
    const map: Record<string, PageSeo> = {}
    for (const row of rows) {
      const slug = row.slug as string
      map[slug] = {
        slug,
        noIndex: (row.no_index as boolean) ?? false,
        updatedAt: row.updated_at ? String(row.updated_at) : undefined,
      }
    }
    return map
  } catch (error) {
    console.warn('[seo] page_seo bulk read failed:', error)
    return {}
  }
}
