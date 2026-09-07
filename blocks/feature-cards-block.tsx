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
