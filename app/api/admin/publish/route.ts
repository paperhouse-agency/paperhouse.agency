import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { isGitHubConfigured, commitAllFiles } from '@/libs/cms/github'

const CONTENT_DIR = path.join(process.cwd(), 'content')

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

  if (!isGitHubConfigured()) {
    return NextResponse.json({ error: 'GitHub is not configured' }, { status: 503 })
  }

  const entries = await fs.readdir(CONTENT_DIR)
  const files: { path: string; content: string }[] = []

  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue
    const content = await fs.readFile(path.join(CONTENT_DIR, entry), 'utf-8')
    files.push({ path: `content/${entry}`, content })
  }

  if (files.length === 0) {
    return NextResponse.json({ error: 'No content files found' }, { status: 400 })
  }

  await commitAllFiles(files, 'cms: publish all content')

  return NextResponse.json({ ok: true, committed: files.map((f) => f.path) })
}
