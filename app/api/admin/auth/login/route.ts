import { NextResponse } from 'next/server'
import { checkRateLimit, clearRateLimit } from '@/libs/cms/auth/rate-limit'
import { findUserByEmail, verifyPassword } from '@/libs/cms/auth/credentials'
import { getSession } from '@/libs/cms/auth/session'
import { ensureRootUser } from '@/libs/cms/storage'

export async function POST(req: Request) {
  await ensureRootUser()

  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',').at(-1)!.trim() : 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  }

  const body = (await req.json()) as Record<string, string>
  const { email, password } = body
  if (!(email && password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const user = await findUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const session = await getSession()

  if (user.skipTotp) {
    session.isLoggedIn = true
    session.userId = user.id
    session.role = user.role
    session.pendingTotpUserId = undefined
    await session.save()
    clearRateLimit(ip)
    return NextResponse.json({ requiresTotp: false })
  }

  session.pendingTotpUserId = user.id
  session.isLoggedIn = false
  await session.save()

  return NextResponse.json({ requiresTotp: true, totpEnrolled: user.totpEnrolled })
}
