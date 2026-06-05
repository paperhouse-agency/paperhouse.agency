import { listPages } from '@/libs/cms/storage'
import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { PagesListClient } from './(components)/pages-list-client'

export default async function PagesPage() {
  const session = await getSession()
  const pages = await listPages()
  const canCreate = session.role ? canPerform(session.role, 'create_page') : false
  const canDelete = session.role ? canPerform(session.role, 'delete_page') : false
  const canDuplicate = canCreate

  return (
    <PagesListClient
      pages={pages}
      canCreate={canCreate}
      canDelete={canDelete}
      canDuplicate={canDuplicate}
    />
  )
}
