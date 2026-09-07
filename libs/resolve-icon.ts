import {
  Code,
  Crosshair,
  Handshake,
  Lightbulb,
  type LucideIcon,
  Plane,
  Search,
  Shuffle,
} from 'lucide-react'

/**
 * Maps icon names used in `content/*.json` to Lucide components.
 *
 * Explicit rather than dynamic so only the icons actually used are bundled.
 * Add an entry here when content references a new icon.
 */
const ICONS: Record<string, LucideIcon> = {
  Code,
  Crosshair,
  Handshake,
  Lightbulb,
  Plane,
  Search,
  Shuffle,
}

export function resolveIcon(name: string): LucideIcon {
  const icon = ICONS[name]
  if (!icon) {
    throw new Error(
      `Unknown icon "${name}". Add it to libs/resolve-icon.ts to use it in content.`
    )
  }
  return icon
}
