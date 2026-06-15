import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readNavigation, writeNavigation } from '@/libs/cms/storage'
import type { CmsNavigation } from '@/libs/cms/types'

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const navigation = await readNavigation()
  return NextResponse.json({ navigation })
}

export async function PUT(req: Request) {
  if (req.headers.get('x-requested-with') !== 'XMLHttpRequest') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await getSession()
  if (!(session.isLoggedIn && session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canPerform(session.role, 'manage_settings')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await req.json()) as CmsNavigation
  const nav: CmsNavigation = {
    header: { items: body.header?.items ?? [] },
    footer: {
      columns: body.footer?.columns ?? [],
      legal: body.footer?.legal ?? [],
    },
    updatedAt: new Date().toISOString(),
  }

  await writeNavigation(nav)
  return NextResponse.json({ navigation: nav })
}
