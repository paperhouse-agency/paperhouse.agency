import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readPageById, writePage } from '@/libs/cms/storage'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!(session.isLoggedIn && session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canPerform(session.role, 'create_page')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const original = await readPageById(id)
  if (!original) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const now = new Date().toISOString()
  const copy = {
    ...original,
    id: crypto.randomUUID(),
    title: `${original.title} (copy)`,
    slug: `${original.slug}-copy`,
    status: 'draft' as const,
    createdAt: now,
    updatedAt: now,
  }

  await writePage(copy)
  return NextResponse.json(copy, { status: 201 })
}
