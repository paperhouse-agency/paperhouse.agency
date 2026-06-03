import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readPageById, renamePage, deletePage } from '@/libs/cms/storage'
import type { CmsPage } from '@/libs/cms/types'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await readPageById(id)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(page)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (req.headers.get('x-requested-with') !== 'XMLHttpRequest') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await getSession()
  if (!(session.isLoggedIn && session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canPerform(session.role, 'edit_page')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const existing = await readPageById(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = (await req.json()) as Partial<CmsPage>
  const { title, slug, status, seo, blocks } = body
  const updated: CmsPage = {
    ...existing,
    ...(title !== undefined && { title }),
    ...(slug !== undefined && { slug }),
    ...(status !== undefined && { status }),
    ...(seo !== undefined && { seo }),
    ...(blocks !== undefined && { blocks }),
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }
  await renamePage(existing.slug, updated)
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (req.headers.get('x-requested-with') !== 'XMLHttpRequest') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await getSession()
  if (!(session.isLoggedIn && session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canPerform(session.role, 'delete_page')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const existing = await readPageById(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await deletePage(existing.slug)
  return NextResponse.json({ ok: true })
}
