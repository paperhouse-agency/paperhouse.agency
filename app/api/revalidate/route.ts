import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import {
  pageSeoTag,
  SITE_SEO_TAG,
  SITEMAP_TAG,
} from '@/libs/seo/queries'
import { getRoute } from '@/libs/seo/routes'

/**
 * Cache invalidation endpoint called by HQ (hq.paperhouse.agency) after a
 * marketing user saves SEO/GEO data.
 *
 * Without this, cached metadata (`cacheLife('max')`) would never refresh and
 * edits would not go live. HQ must surface a failure here to the editor.
 *
 * POST /api/revalidate
 *   headers: { authorization: `Bearer ${REVALIDATE_SECRET}` }
 *   body:    { slug: '/' } | { scope: 'site' }
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET

  if (!secret) {
    console.error('[revalidate] REVALIDATE_SECRET is not configured')
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { slug?: string; scope?: string }
  try {
    body = (await request.json()) as { slug?: string; scope?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const revalidated: string[] = []
  // Matches cacheLife('max') used by the tagged readers in libs/seo/queries.
  const PROFILE = 'max'

  if (body.scope === 'site') {
    // Site-wide settings feed robots.txt, JSON-LD, and every page's metadata.
    revalidateTag(SITE_SEO_TAG, PROFILE)
    revalidateTag(SITEMAP_TAG, PROFILE)
    revalidated.push(SITE_SEO_TAG, SITEMAP_TAG)
  } else if (body.slug) {
    if (!getRoute(body.slug)) {
      return NextResponse.json(
        { error: `Unknown route: ${body.slug}` },
        { status: 400 }
      )
    }
    revalidateTag(pageSeoTag(body.slug), PROFILE)
    revalidateTag(SITEMAP_TAG, PROFILE)
    revalidated.push(pageSeoTag(body.slug), SITEMAP_TAG)
  } else {
    return NextResponse.json(
      { error: 'Provide either { slug } or { scope: "site" }' },
      { status: 400 }
    )
  }

  return NextResponse.json({ revalidated, at: new Date().toISOString() })
}
