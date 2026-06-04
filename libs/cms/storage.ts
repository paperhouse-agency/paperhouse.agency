import fs from 'node:fs/promises'
import path from 'node:path'
import { list, put } from '@vercel/blob'
import bcrypt from 'bcryptjs'
import type { CmsPage, CmsUser } from './types'

// ── Filesystem helpers (pages) ────────────────────────────────────────────────
// Pages are stored as content/{slug}.json (root slug → index.json)

const CONTENT_DIR = path.join(process.cwd(), 'content')

function validateSlug(slug: string) {
  if (slug !== '' && !/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid slug: "${slug}"`)
  }
  const resolved = path.resolve(CONTENT_DIR, `${slug === '' ? 'index' : slug}.json`)
  if (!resolved.startsWith(CONTENT_DIR + path.sep) && resolved !== path.join(CONTENT_DIR, 'index.json')) {
    throw new Error('Path traversal detected')
  }
}

function slugToFile(slug: string): string {
  const name = slug === '' || slug === '/' ? 'index' : slug
  return path.join(CONTENT_DIR, `${name}.json`)
}

async function readFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function writeFile(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// ── Blob helpers (users + images) ────────────────────────────────────────────

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

// ── Users (Vercel Blob) ───────────────────────────────────────────────────────

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

// ── Pages (filesystem) ────────────────────────────────────────────────────────

export interface CmsPageMeta {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  updatedAt: string
}

export async function listPages(): Promise<CmsPageMeta[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR)
    const pages: CmsPageMeta[] = []
    for (const entry of entries) {
      if (!entry.endsWith('.json')) continue
      const page = await readFile<CmsPage>(path.join(CONTENT_DIR, entry))
      if (!page) continue
      pages.push({
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        updatedAt: page.updatedAt,
      })
    }
    return pages.sort((a, b) => a.title.localeCompare(b.title))
  } catch {
    return []
  }
}

export async function readPage(slug: string): Promise<CmsPage | null> {
  validateSlug(slug)
  return readFile<CmsPage>(slugToFile(slug))
}

export async function readPageById(id: string): Promise<CmsPage | null> {
  const pages = await listPages()
  const meta = pages.find((p) => p.id === id)
  if (!meta) return null
  return readPage(meta.slug)
}

export async function writePage(page: CmsPage) {
  validateSlug(page.slug)
  await writeFile(slugToFile(page.slug), page)
}

export async function renamePage(oldSlug: string, page: CmsPage) {
  validateSlug(oldSlug)
  validateSlug(page.slug)
  // If slug changed, delete the old file and write at new path
  if (oldSlug !== page.slug && oldSlug !== '') {
    await fs.unlink(slugToFile(oldSlug)).catch(() => null)
  }
  await writePage(page)
}

export async function deletePage(slug: string) {
  validateSlug(slug)
  await fs.unlink(slugToFile(slug)).catch(() => null)
}
