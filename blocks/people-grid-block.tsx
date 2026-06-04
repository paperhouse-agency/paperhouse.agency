import type { BlockSchema } from '@/libs/cms/block-schema'
import { TeamCard } from '@/components/molecules/team-card'

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
            <TeamCard key={`${member.name}-${i}`} {...member} />
          ))}
        </div>
      </div>
    </section>
  )
}


export const cmsSchema: BlockSchema = {
  type: 'people-grid',
  label: 'People Grid',
  icon: 'Users',
  fields: [
    { key: 'preheadingContent', label: 'Preheading', type: 'text' },
    { key: 'headingContent', label: 'Heading', type: 'text', required: true },
    { key: 'bodyContent', label: 'Body', type: 'textarea' },
    {
      key: 'members',
      label: 'Members',
      type: 'array',
      fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'role', label: 'Role', type: 'text', required: true },
        { key: 'image', label: 'Image', type: 'image', required: true },
        { key: 'ctaUrl', label: 'Profile URL', type: 'url' },
      ],
    },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'people-grid',
    preheadingContent: '',
    headingContent: '',
    bodyContent: '',
    members: [],
  }),
}
