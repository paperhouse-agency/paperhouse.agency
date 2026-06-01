import { Button } from '@/components/button'
import { Image } from '@/components/image'

export interface TeamMember {
  name: string
  role: string
  image: { src: string; alt: string }
  ctaUrl?: string
}

export interface PeopleGridBlockProps {
  preheadingContent?: string
  headingContent: string
  bodyContent?: string
  members: TeamMember[]
}

function parseHeading(content: string) {
  const parts = content.split(/(<span>.*?<\/span>)/g).filter(Boolean)
  return parts.map((part) => {
    if (part.startsWith('<span>') && part.endsWith('</span>')) {
      const text = part.replace('<span>', '').replace('</span>', '')
      return (
        <span key={part} className="text-primary">
          {text}
        </span>
      )
    }
    return <span key={part}>{part}</span>
  })
}

export function PeopleGridBlock({
  preheadingContent = 'TEAM',
  headingContent,
  bodyContent,
  members,
}: PeopleGridBlockProps) {
  return (
    <section className="py-15 px-5">
      <div className="wrapper mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2.5">
          {preheadingContent && (
            <p className="mono-wide text-primary">{preheadingContent}</p>
          )}
          <h2 className="heading-2 text-text">
            {parseHeading(headingContent)}
          </h2>
          {bodyContent && (
            <p className="body-large text-text/60 max-w-xl">{bodyContent}</p>
          )}
        </div>

        <div className="grid grid-cols-1 dt:grid-cols-4 gap-5">
          {members.map((member, i) => (
            <div
              key={`${member.name}-${i}`}
              className="flex flex-col gap-5 items-start"
            >
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={member.image.src}
                  alt={member.image.alt}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-2.5 flex-1">
                <p className="heading-4 text-text">{member.name}</p>
                <p className="body-large text-text/60">{member.role}</p>
              </div>

              <Button
                variant="tertiary"
                color="primary"
                size="sm"
                hasIcon
                url={member.ctaUrl}
              >
                READ MORE
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
