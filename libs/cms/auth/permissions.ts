import type { UserRole } from '@/libs/cms/types'

type Action = 'create_page' | 'edit_page' | 'delete_page' | 'manage_users' | 'manage_settings'

const PERMISSIONS: Record<UserRole, Action[]> = {
  super_admin: ['create_page', 'edit_page', 'delete_page', 'manage_users', 'manage_settings'],
  marketing: ['create_page', 'edit_page', 'manage_settings'],
  editor: ['edit_page'],
}

export function canPerform(role: UserRole, action: Action): boolean {
  return PERMISSIONS[role]?.includes(action) ?? false
}
