import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { hashPassword } from '@/libs/cms/auth/credentials'
import { readUsers, writeUsers } from '@/libs/cms/storage'
import type { UserRole } from '@/libs/cms/types'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!(session.isLoggedIn && session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canPerform(session.role, 'manage_users')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const users = await readUsers()
  const user = users.find((u) => u.id === id)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { passwordHash: _, totpSecret: __, ...safe } = user
  return NextResponse.json(safe)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const { id } = await params
  const users = await readUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = (await req.json()) as Record<string, string>
  const { name, role, password } = body
  const user = users[idx]
  if (name) user.name = name
  if (role) user.role = role as UserRole
  if (password) user.passwordHash = await hashPassword(password)
  user.updatedAt = new Date().toISOString()

  await writeUsers(users)
  const { passwordHash: _, totpSecret: __, ...safe } = user
  return NextResponse.json(safe)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const { id } = await params
  if (id === session.userId) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  const users = await readUsers()
  const filtered = users.filter((u) => u.id !== id)
  if (filtered.length === users.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await writeUsers(filtered)
  return NextResponse.json({ ok: true })
}
