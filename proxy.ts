import { unsealData } from 'iron-session'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { sessionOptions } from '@/libs/cms/auth/session-config'
import type { AdminSession } from '@/libs/cms/types'

const CMS_PUBLIC_PATHS = [
  '/admin/login',
  '/api/admin/auth/',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Maintenance mode
  if (process.env.MAINTENANCE_MODE === 'true') {
    const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET
    const bypassCookie = request.cookies.get('maintenance_bypass')?.value
    if (!(bypassSecret && bypassCookie === bypassSecret)) {
      return NextResponse.rewrite(new URL('/maintenance', request.url))
    }
  }

  // CMS auth guard
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const isPublic = CMS_PUBLIC_PATHS.some((p) => pathname.startsWith(p))
    if (!isPublic) {
      const cookieValue = request.cookies.get(sessionOptions.cookieName as string)?.value
      let isLoggedIn = false
      if (cookieValue) {
        try {
          const session = await unsealData<AdminSession>(cookieValue, {
            password: sessionOptions.password as string,
          })
          isLoggedIn = session.isLoggedIn ?? false
        } catch {
          isLoggedIn = false
        }
      }
      if (!isLoggedIn) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!maintenance|api/maintenance-bypass|_next/static|_next/image|favicon\\.ico).*)',
  ],
}
