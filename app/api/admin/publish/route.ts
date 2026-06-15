import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'

export async function POST(req: Request) {
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

  revalidateTag('cms-navigation')
  revalidateTag('cms-pages')

  return NextResponse.json({ ok: true })
}
