import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { listPages, writePage } from '@/libs/cms/storage'
import type { CmsPage } from '@/libs/cms/types'

export async function GET() {
  const pages = await listPages()
  return NextResponse.json({ pages })
}

export async function POST(req: Request) {
  if (req.headers.get('x-requested-with') !== 'XMLHttpRequest') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await getSession()
  if (!(session.isLoggedIn && session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canPerform(session.role, 'create_page')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await req.json()) as Record<string, string>
  const { title, slug } = body
  if (!(title && slug)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const RESERVED = ['index', 'api', 'admin', '_next', 'static']
  if (RESERVED.includes(slug)) {
    return NextResponse.json({ error: 'Slug is reserved' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const page: CmsPage = {
    id: crypto.randomUUID(),
    title,
    slug,
    status: 'draft',
    seo: {},
    blocks: [],
    createdAt: now,
    updatedAt: now,
  }

  await writePage(page)
  return NextResponse.json(page, { status: 201 })
}
