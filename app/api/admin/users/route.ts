import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { hashPassword } from '@/libs/cms/auth/credentials'
import { generateTotpSecret, getTotpUri } from '@/libs/cms/auth/totp'
import { readUsers, writeUsers } from '@/libs/cms/storage'
import type { CmsUser, UserRole } from '@/libs/cms/types'

export async function GET() {
  const session = await getSession()
  if (!(session.isLoggedIn && session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canPerform(session.role, 'manage_users')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await readUsers()
  const safe = users.map(({ passwordHash: _, totpSecret: __, ...u }) => u)
  return NextResponse.json(safe)
}

export async function POST(req: Request) {
  if (req.headers.get('x-requested-with') !== 'XMLHttpRequest') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await getSession()
  if (!(session.isLoggedIn && session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canPerform(session.role, 'manage_users')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await req.json()) as Record<string, string>
  const { email, password, name, role } = body
  if (!(((email && password ) && name ) && role)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const users = await readUsers()
  if (users.find((u) => u.email === email)) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)
  const totpSecret = generateTotpSecret()
  const now = new Date().toISOString()
  const user: CmsUser = {
    id: crypto.randomUUID(),
    email,
    name,
    role: role as UserRole,
    passwordHash,
    totpSecret,
    totpEnrolled: false,
    createdAt: now,
    updatedAt: now,
  }

  await writeUsers([...users, user])
  const totpUri = getTotpUri(email, totpSecret)
  const { passwordHash: _, totpSecret: __, ...safeUser } = user
  return NextResponse.json({ ...safeUser, totpUri }, { status: 201 })
}
