import { getSession } from '@/libs/cms/auth/session'
import { redirect } from 'next/navigation'
import { MediaManager } from '@/components/cms/media-manager'

export const metadata = { title: 'Media Library — Paperhouse CMS' }

export default async function MediaPage() {
  const session = await getSession()
  if (!session.isLoggedIn) redirect('/admin/login')

  return <MediaManager />
}
