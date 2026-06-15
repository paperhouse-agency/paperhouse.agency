import { getSession } from '@/libs/cms/auth/session'
import { canPerform } from '@/libs/cms/auth/permissions'
import { readNavigation } from '@/libs/cms/storage'
import { NavigationEditor } from '@/components/cms/navigation-editor'

export default async function NavigationPage() {
  const session = await getSession()
  const navigation = await readNavigation()
  const canEdit = session.role ? canPerform(session.role, 'manage_settings') : false

  return (
    <NavigationEditor
      initialNavigation={navigation}
      canEdit={canEdit}
    />
  )
}
