import { NextResponse } from 'next/server'
import { clearRateLimit } from '@/libs/cms/auth/rate-limit'
import { getUserById } from '@/libs/cms/auth/credentials'
import { getSession } from '@/libs/cms/auth/session'
import { verifyTotp } from '@/libs/cms/auth/totp'
import { updateUser } from '@/libs/cms/storage'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session.pendingTotpUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as Record<string, string>
  const { token } = body
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const user = await getUserById(session.pendingTotpUserId)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const valid = await verifyTotp(token, user.totpSecret)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
  }

  if (!user.totpEnrolled) {
    await updateUser({ ...user, totpEnrolled: true, updatedAt: new Date().toISOString() })
  }

  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',').at(-1)!.trim() : 'unknown'
  clearRateLimit(ip)

  session.isLoggedIn = true
  session.userId = user.id
  session.role = user.role
  session.pendingTotpUserId = undefined
  await session.save()

  return NextResponse.json({ ok: true })
}
