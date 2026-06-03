import type { LucideIcon } from 'lucide-react'
import cn from 'clsx'

interface IconAtomProps {
  icon: LucideIcon
  size?: number
  className?: string
  wrapperClassName?: string
}

export function IconAtom({
  icon: Icon,
  size = 20,
  className,
  wrapperClassName,
}: IconAtomProps) {
  return (
    <div
      className={cn(
        'w-12 h-12 rounded-full bg-bluishgray flex items-center justify-center shrink-0',
        wrapperClassName,
      )}
    >
      <Icon size={size} className={cn('text-text', className)} />
    </div>
  )
}
