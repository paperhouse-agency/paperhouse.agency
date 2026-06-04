import type { BlockSchema } from '@/libs/cms/block-schema'
import { FeatureContentCard } from '@/components/molecules/feature-content-card'

export interface FeatureCard {
  label: string
  heading: string
  content: string
  ctaLabel: string
  ctaUrl?: string
  image: {
    src: string
    alt: string
  }
}

export interface FeatureCardsBlockProps {
  preheadingContent?: string
  headingContent: string
  bodyContent?: string
  cards: FeatureCard[]
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

export function FeatureCardsBlock({
  preheadingContent,
  headingContent,
  bodyContent,
  cards,
}: FeatureCardsBlockProps) {
  return (
    <section className="py-15 px-5">
      <div className="wrapper mx-auto">
        <div className="flex flex-col items-center text-center gap-2.5 mb-15">
          {preheadingContent && (
            <p className="mono-wide text-primary">{preheadingContent}</p>
          )}
          <h2 className="heading-2 text-text">
            {parseHeading(headingContent)}
          </h2>
          {bodyContent && (
            <p className="body-large text-text/60 max-w-[640px]">
              {bodyContent}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 dt:grid-cols-3 gap-5">
          {cards.map((card) => (
            <FeatureContentCard key={card.label} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}


export const cmsSchema: BlockSchema = {
  type: 'feature-cards',
  label: 'Feature Cards',
  icon: 'CreditCard',
  fields: [
    { key: 'preheadingContent', label: 'Preheading', type: 'text', placeholder: 'WHAT WE DO' },
    { key: 'headingContent', label: 'Heading', type: 'text', required: true, span: 'full', description: 'Wrap text in <span> for accent color' },
    { key: 'bodyContent', label: 'Body', type: 'textarea', span: 'full' },
    {
      key: 'cards',
      label: 'Cards',
      type: 'array',
      span: 'full',
      fields: [
        { key: 'label', label: 'Label', type: 'text', required: true, placeholder: 'Design' },
        { key: 'heading', label: 'Heading', type: 'text', required: true, span: 'full' },
        { key: 'content', label: 'Description', type: 'textarea', span: 'full' },
        { key: 'ctaLabel', label: 'CTA Label', type: 'text', required: true, placeholder: 'Learn more' },
        { key: 'ctaUrl', label: 'CTA URL', type: 'url' },
        { key: 'image', label: 'Image', type: 'image', span: 'full', required: true },
      ],
    },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'feature-cards',
    preheadingContent: '',
    headingContent: '',
    bodyContent: '',
    cards: [],
  }),
}
