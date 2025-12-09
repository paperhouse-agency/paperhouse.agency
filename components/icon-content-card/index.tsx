import type { LucideIcon } from 'lucide-react'

interface IconContentCardProps {
  icon: LucideIcon
  heading: string
  content: string
  alternate?: boolean
  headingClassName?: string
}

export function IconContentCard({
  icon: Icon,
  heading,
  content,
  alternate = false,
  headingClassName,
}: IconContentCardProps) {
  return (
    <div
      className={`group flex flex-col items-start gap-2.5 p-5 rounded-lg border transition-colors duration-300 ${
        alternate ? 'bg-secondary border-secondary' : 'bg-white border-text/60'
      }`}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-bluishgray transition-colors duration-300">
        <Icon
          size={24}
          className={`transition-colors duration-300 ${
            alternate ? 'text-secondary' : 'text-text/60'
          }`}
        />
      </div>
      <h5
        className={`heading-5 transition-colors duration-300 ${
          alternate ? 'text-offwhite' : 'text-text'
        } ${headingClassName || ''}`}
      >
        {heading}
      </h5>
      <p
        className={`body-small transition-colors duration-300 ${
          alternate ? 'text-offwhite/80' : 'text-text/60'
        }`}
      >
        {content}
      </p>
    </div>
  )
}
