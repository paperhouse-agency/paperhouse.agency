import cn from 'clsx'

interface TagProps {
  children: string
  className?: string
}

export function Tag({ children, className }: TagProps) {
  return <p className={cn('mono-wide text-primary', className)}>{children}</p>
}
