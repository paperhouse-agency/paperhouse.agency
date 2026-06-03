import { notFound } from 'next/navigation'
import { readPageById } from '@/libs/cms/storage'
import { PageEditor } from './(components)/page-editor'

export default async function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await readPageById(id)
  if (!page) notFound()

  return <PageEditor initialPage={page} />
}
