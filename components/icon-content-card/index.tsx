import type { LucideIcon } from 'lucide-react'

interface IconContentCardProps {
  icon: LucideIcon
  heading: string
  content: string
  alternate?: boolean
}

export function IconContentCard({
  icon: Icon,
  heading,
  content,
  alternate = false,
}: IconContentCardProps) {
  return (
    <div
      className={`group flex flex-col items-start gap-2.5 p-5 rounded-lg border transition-colors duration-300 ${
        alternate
          ? 'bg-white/50 border-text/60 hover:bg-secondary hover:border-secondary'
          : 'bg-white/50 border-text/60'
      }`}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-bluishgray transition-colors duration-300">
        <Icon
          size={24}
          className={`transition-colors duration-300 ${
            alternate ? 'text-text group-hover:text-offwhite' : 'text-text'
          }`}
        />
      </div>
      <h5
        className={`heading-5 transition-colors duration-300 ${
          alternate ? 'text-text group-hover:text-offwhite' : 'text-text'
        }`}
      >
        {heading}
      </h5>
      <p
        className={`body-small transition-colors duration-300 ${
          alternate
            ? 'text-text/60 group-hover:text-offwhite/80'
            : 'text-text/60'
        }`}
      >
        {content}
      </p>
    </div>
  )
}
