import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== 'true') return NextResponse.next()

  const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET
  const bypassCookie = request.cookies.get('maintenance_bypass')?.value

  if (bypassSecret && bypassCookie === bypassSecret) return NextResponse.next()

  return NextResponse.rewrite(new URL('/maintenance', request.url))
}

export const config = {
  matcher: [
    // Skip: maintenance page itself, bypass API, Next.js internals, static assets
    '/((?!maintenance|api/maintenance-bypass|_next/static|_next/image|favicon\\.ico).*)',
  ],
}
