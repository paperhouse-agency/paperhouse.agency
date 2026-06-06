import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readPageById, renamePage, deletePage, isSlugTaken, slugToRepoPath } from '@/libs/cms/storage'
import { isGitHubConfigured, commitFile, deleteFile } from '@/libs/cms/github'
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
  const { title, slug, status, seo, settings, blocks } = body

  if (slug !== undefined && slug !== existing.slug) {
    if (await isSlugTaken(slug, existing.id)) {
      return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 409 })
    }
  }

  // Record publishedAt timestamp on first publish
  const becomingPublished =
    status === 'published' && existing.status !== 'published'
  const publishedAt =
    becomingPublished && !existing.settings?.publishedAt
      ? new Date().toISOString()
      : existing.settings?.publishedAt

  const mergedSettings =
    settings !== undefined
      ? { ...existing.settings, ...settings, ...(publishedAt ? { publishedAt } : {}) }
      : publishedAt && !existing.settings?.publishedAt
        ? { ...existing.settings, publishedAt }
        : existing.settings

  const updated: CmsPage = {
    ...existing,
    ...(title !== undefined && { title }),
    ...(slug !== undefined && { slug }),
    ...(status !== undefined && { status }),
    ...(seo !== undefined && { seo }),
    ...(mergedSettings !== undefined && { settings: mergedSettings }),
    ...(blocks !== undefined && { blocks }),
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }

  await renamePage(existing.slug, updated)

  // Push to GitHub when status changes (publish or unpublish)
  const statusChanged = status !== undefined && status !== existing.status
  if (statusChanged && isGitHubConfigured()) {
    const action = updated.status === 'published' ? 'publish' : 'unpublish'
    const repoPath = slugToRepoPath(updated.slug)
    try {
      await commitFile(
        repoPath,
        JSON.stringify(updated, null, 2),
        `cms: ${action} "${updated.title}" (${repoPath})`,
      )
    } catch (err) {
      // GitHub push failing should not roll back the local save
      console.error('GitHub commit failed:', err)
    }
  }

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

  // Remove from GitHub repo so the build no longer includes it
  if (isGitHubConfigured()) {
    const repoPath = slugToRepoPath(existing.slug)
    try {
      await deleteFile(repoPath, `cms: delete "${existing.title}" (${repoPath})`)
    } catch (err) {
      console.error('GitHub delete failed:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
