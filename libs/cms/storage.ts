import { list, put } from '@vercel/blob'
import bcrypt from 'bcryptjs'
import { getDb, sql } from './db'
import type { CmsNavigation, CmsPage, CmsUser } from './types'

// ── Page helpers ──────────────────────────────────────────────────────────────

export interface CmsPageMeta {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  updatedAt: string
  blockCount: number
  author?: string
}

export async function listPages(): Promise<CmsPageMeta[]> {
  await getDb()
  const { rows } = await sql`
    SELECT id, title, slug, status, settings, blocks, updated_at
    FROM pages
    ORDER BY title ASC
  `
  return rows.map((r) => ({
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    status: r.status as 'draft' | 'published',
    updatedAt: r.updated_at as string,
    blockCount: Array.isArray(r.blocks) ? (r.blocks as unknown[]).length : 0,
    author: (r.settings as CmsPage['settings'])?.author,
  }))
}

export async function readPage(slug: string): Promise<CmsPage | null> {
  await getDb()
  const name = slug === '' || slug === '/' ? 'index' : slug
  const { rows } = await sql`SELECT * FROM pages WHERE slug = ${name} LIMIT 1`
  return rows[0] ? rowToPage(rows[0]) : null
}

export async function readPageById(id: string): Promise<CmsPage | null> {
  await getDb()
  const { rows } = await sql`SELECT * FROM pages WHERE id = ${id} LIMIT 1`
  return rows[0] ? rowToPage(rows[0]) : null
}

export async function writePage(page: CmsPage): Promise<void> {
  await getDb()
  await sql`
    INSERT INTO pages (id, title, slug, status, seo, settings, blocks, created_at, updated_at)
    VALUES (
      ${page.id},
      ${page.title},
      ${page.slug},
      ${page.status},
      ${JSON.stringify(page.seo)}::jsonb,
      ${JSON.stringify(page.settings ?? null)}::jsonb,
      ${JSON.stringify(page.blocks)}::jsonb,
      ${page.createdAt},
      ${page.updatedAt}
    )
    ON CONFLICT (id) DO UPDATE SET
      title      = EXCLUDED.title,
      slug       = EXCLUDED.slug,
      status     = EXCLUDED.status,
      seo        = EXCLUDED.seo,
      settings   = EXCLUDED.settings,
      blocks     = EXCLUDED.blocks,
      updated_at = EXCLUDED.updated_at
  `
}

export async function renamePage(oldSlug: string, page: CmsPage): Promise<void> {
  await writePage(page)
}

export async function deletePage(slug: string): Promise<void> {
  await getDb()
  const name = slug === '' || slug === '/' ? 'index' : slug
  await sql`DELETE FROM pages WHERE slug = ${name}`
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  await getDb()
  const name = slug === '/' ? '' : slug
  const { rows } = excludeId
    ? await sql`SELECT id FROM pages WHERE slug = ${name} AND id != ${excludeId} LIMIT 1`
    : await sql`SELECT id FROM pages WHERE slug = ${name} LIMIT 1`
  return rows.length > 0
}


function rowToPage(r: Record<string, unknown>): CmsPage {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    status: r.status as 'draft' | 'published',
    seo: (r.seo as CmsPage['seo']) ?? {},
    settings: r.settings as CmsPage['settings'],
    blocks: (r.blocks as CmsPage['blocks']) ?? [],
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }
}

// ── Navigation ────────────────────────────────────────────────────────────────

const DEFAULT_NAVIGATION: CmsNavigation = {
  header: { items: [] },
  footer: { columns: [], legal: [] },
  updatedAt: new Date().toISOString(),
}

export async function readNavigation(): Promise<CmsNavigation> {
  await getDb()
  const { rows } = await sql`SELECT data FROM navigation WHERE id = 1 LIMIT 1`
  return rows[0] ? (rows[0].data as CmsNavigation) : DEFAULT_NAVIGATION
}

export async function writeNavigation(nav: CmsNavigation): Promise<void> {
  await getDb()
  await sql`
    INSERT INTO navigation (id, data, updated_at)
    VALUES (1, ${JSON.stringify(nav)}::jsonb, ${nav.updatedAt})
    ON CONFLICT (id) DO UPDATE SET
      data       = EXCLUDED.data,
      updated_at = EXCLUDED.updated_at
  `
}

// ── Users (Vercel Blob — unchanged) ──────────────────────────────────────────

const USERS_BLOB_PATH = 'content/users.json'

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  const { blobs } = await list({ prefix: pathname })
  const url = blobs.find((b) => b.pathname === pathname)?.url
  if (!url) return null
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json() as Promise<T>
}

async function writeBlobJson(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function readUsers(): Promise<CmsUser[]> {
  return (await readBlobJson<CmsUser[]>(USERS_BLOB_PATH)) ?? []
}

export async function writeUsers(users: CmsUser[]) {
  await writeBlobJson(USERS_BLOB_PATH, users)
}

export async function updateUser(updated: CmsUser) {
  const users = await readUsers()
  const idx = users.findIndex((u) => u.id === updated.id)
  if (idx >= 0) users[idx] = updated
  else users.push(updated)
  await writeUsers(users)
}

let rootEnsured = false

export async function ensureRootUser(): Promise<void> {
  if (rootEnsured) return
  const rootId = process.env.ROOT_USER_ID
  const rootPass = process.env.ROOT_USER_PASS
  if (!(rootId && rootPass)) return

  const users = await readUsers()
  if (users.find((u) => u.email === rootId)) {
    rootEnsured = true
    return
  }

  const passwordHash = await bcrypt.hash(rootPass, 12)
  const now = new Date().toISOString()
  const root: CmsUser = {
    id: 'root',
    email: rootId,
    name: 'Admin',
    role: 'super_admin',
    passwordHash,
    totpSecret: '',
    totpEnrolled: true,
    skipTotp: true,
    createdAt: now,
    updatedAt: now,
  }
  await writeUsers([...users, root])
  rootEnsured = true
}
