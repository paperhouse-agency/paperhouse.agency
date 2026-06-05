import { notFound } from 'next/navigation'
import { readPageById, readUsers, listPages } from '@/libs/cms/storage'
import { PageEditor } from '@/components/cms/page-editor'

export default async function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await readPageById(id)
  if (!page) notFound()

  // Fetch users and sibling pages in parallel for Settings tab dropdowns.
  // Failures are non-fatal — Settings tab degrades gracefully.
  const [users, allPages] = await Promise.all([
    readUsers().catch(() => []),
    listPages().catch(() => []),
  ])

  return (
    <PageEditor
      initialPage={page}
      authors={users.map((u) => ({ id: u.id, name: u.name }))}
      allPages={allPages
        .filter((p) => p.id !== page.id)
        .map((p) => ({ id: p.id, title: p.title, slug: p.slug }))}
    />
  )
}
