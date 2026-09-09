import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Endpoints HQ calls to manage SEO/GEO. They must keep working during
 * maintenance mode — otherwise a publish from HQ is silently rewritten to the
 * maintenance page and the cache is never purged.
 */
const MAINTENANCE_EXEMPT = ['/api/revalidate', '/api/routes']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Maintenance mode — skipped in local dev and Vercel preview environments
  const isDevOrPreview =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview'

  if (
    process.env.MAINTENANCE_MODE === 'true' &&
    !isDevOrPreview &&
    !MAINTENANCE_EXEMPT.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!maintenance|_next/static|_next/image|favicon\\.ico).*)'],
}
