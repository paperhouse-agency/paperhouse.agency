import { Link } from '@/components/link'
import { Image } from '@/components/image'

export interface SolutionCard {
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

export interface SolutionsBlockProps {
  headingContent: string
  bodyContent?: string
  cards: SolutionCard[]
}

function parseHeading(content: string) {
  const parts = content.split(/(<span>.*?<\/span>)/g).filter(Boolean)
  return parts.map((part, i) => {
    if (part.startsWith('<span>') && part.endsWith('</span>')) {
      const text = part.replace('<span>', '').replace('</span>', '')
      return (
        <span key={i} className="text-primary">
          {text}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function SolutionsBlock({ headingContent, bodyContent, cards }: SolutionsBlockProps) {
  return (
    <section className="py-15 px-5">
      <div className="wrapper mx-auto">
        <div className="flex flex-col items-center text-center gap-2.5 mb-15">
          <h2 className="heading-2 text-text">{parseHeading(headingContent)}</h2>
          {bodyContent && (
            <p className="body-large text-text/60 max-w-[640px]">{bodyContent}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-lg shadow-[4px_4px_5px_rgba(0,0,0,0.05)] p-5 flex flex-col items-center gap-5"
            >
              <div className="flex flex-col gap-2.5 text-center w-full">
                <p className="mono-wide text-primary">{card.label}</p>
                <h3 className="heading-3 text-text">{card.heading}</h3>
                <p className="body text-text/60">{card.content}</p>
              </div>

              <Link
                href={card.ctaUrl}
                className="inline-flex items-center justify-center border border-text rounded-full px-3 py-1.5 body-small text-text whitespace-nowrap shrink-0"
              >
                {card.ctaLabel}
              </Link>

              <div className="relative w-full aspect-[413/260] rounded-lg overflow-hidden mt-auto">
                <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
