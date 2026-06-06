import type { UserRole } from '@/libs/cms/types'

type Action = 'create_page' | 'edit_page' | 'delete_page' | 'manage_users'

const PERMISSIONS: Record<UserRole, Action[]> = {
  super_admin: ['create_page', 'edit_page', 'delete_page', 'manage_users'],
  marketing: ['create_page', 'edit_page'],
  editor: ['edit_page'],
}

export function canPerform(role: UserRole, action: Action): boolean {
  return PERMISSIONS[role]?.includes(action) ?? false
}
