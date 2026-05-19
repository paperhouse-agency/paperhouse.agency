import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET

  if (!bypassSecret || token !== bypassSecret) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set('maintenance_bypass', bypassSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
  return response
}
