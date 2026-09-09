import { type NextRequest, NextResponse } from 'next/server'
import { ROUTES } from '@/libs/seo/routes'

/**
 * Route discovery for HQ.
 *
 * Page content is code in this repo, so HQ cannot learn the list of editable
 * pages from the database — it asks here instead, then offers each route's SEO
 * fields to marketing.
 *
 * GET /api/routes
 *   headers: { authorization: `Bearer ${REVALIDATE_SECRET}` }
 */
export async function GET(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET

  if (!secret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    routes: ROUTES.map(({ slug, label, sitemap, defaults }) => ({
      slug,
      label,
      sitemap,
      defaults,
    })),
  })
}
