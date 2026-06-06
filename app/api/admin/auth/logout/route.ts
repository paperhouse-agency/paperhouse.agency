import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'

export async function POST() {
  const session = await getSession()
  session.destroy()
  return NextResponse.json({ ok: true })
}
