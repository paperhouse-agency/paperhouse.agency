import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function resolveIcon(name: string): LucideIcon {
  const icon = (LucideIcons as Record<string, unknown>)[name]
  return typeof icon === 'function' ? (icon as LucideIcon) : LucideIcons.HelpCircle
}
