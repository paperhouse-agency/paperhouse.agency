import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { writePage, writeNavigation, readPage, readNavigation } from '@/libs/cms/storage'
import type { CmsNavigation, CmsPage } from '@/libs/cms/types'

// One-shot endpoint: seeds Vercel Postgres from content/*.json files.
// Safe to call multiple times — existing rows are not overwritten.
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

  const CONTENT_DIR = path.join(process.cwd(), 'content')
  const NON_PAGE_FILES = new Set(['navigation.json', 'users.json'])
  const seeded: string[] = []
  const skipped: string[] = []

  let entries: string[]
  try {
    entries = await fs.readdir(CONTENT_DIR)
  } catch {
    return NextResponse.json({ error: 'content/ directory not found' }, { status: 500 })
  }

  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue

    if (entry === 'navigation.json') {
      const raw = await fs.readFile(path.join(CONTENT_DIR, entry), 'utf-8')
      const nav = JSON.parse(raw) as CmsNavigation
      const existing = await readNavigation()
      if (existing.updatedAt === nav.updatedAt) {
        skipped.push('navigation')
        continue
      }
      await writeNavigation(nav)
      seeded.push('navigation')
      continue
    }

    if (NON_PAGE_FILES.has(entry)) continue

    const slug = entry.replace(/\.json$/, '')
    const raw = await fs.readFile(path.join(CONTENT_DIR, entry), 'utf-8')
    const page = JSON.parse(raw) as CmsPage

    const existing = await readPage(page.slug)
    if (existing) {
      skipped.push(slug)
      continue
    }

    await writePage(page)
    seeded.push(slug)
  }

  return NextResponse.json({ ok: true, seeded, skipped })
}
