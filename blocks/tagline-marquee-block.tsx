import type { BlockSchema } from '@/libs/cms/block-schema'
import { Marquee } from '@/components/marquee'

const DEFAULT_ITEMS = [
  { label: 'Brand Identity' },
  { label: 'UI/UX Design' },
  { label: 'Web Development' },
  { label: 'Digital Strategy' },
  { label: 'Motion Design' },
  { label: 'SaaS Platforms' },
  { label: 'E-Commerce' },
  { label: 'CMS Architecture' },
]

function Separator() {
  return <span className="text-primary mx-4" aria-hidden>✦</span>
}

export interface TaglineMarqueeBlockProps {
  items?: Array<{ label: string }>
}

export function TaglineMarqueeBlock({ items = DEFAULT_ITEMS }: TaglineMarqueeBlockProps) {
  return (
    <div className="py-8 border-y border-text/10 overflow-hidden bg-bluishgray">
      <Marquee repeat={3} speed={0.6} scrollVelocity={true}>
        <div className="flex items-center pr-0">
          {items.map((item) => (
            <span key={item.label} className="flex items-center">
              <span className="heading-4 text-text whitespace-nowrap">{item.label}</span>
              <Separator />
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  )
}

export const cmsSchema: BlockSchema = {
  type: 'tagline-marquee',
  label: 'Tagline Marquee',
  icon: 'Repeat',
  fields: [
    {
      key: 'items',
      label: 'Marquee Items',
      type: 'array',
      span: 'full',
      description: 'Service tags scrolling across the banner',
      fields: [
        { key: 'label', label: 'Label', type: 'text', required: true, placeholder: 'e.g. Brand Identity' },
      ],
    },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'tagline-marquee',
    items: DEFAULT_ITEMS,
  }),
}
