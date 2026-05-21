import { Button } from '@/components/button'
import { Image } from '@/components/image'

export interface CardGridArticle {
  image: {
    src: string
    alt: string
  }
  heading: string
  content: string
  ctaUrl?: string
}

export interface CardGridBlockProps {
  preheadingContent?: string
  headingContent: string
  bodyContent?: string
  articles: CardGridArticle[]
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

export function CardGridBlock({
  preheadingContent,
  headingContent,
  bodyContent,
  articles,
}: CardGridBlockProps) {
  return (
    <section className="py-15 px-5">
      <div className="wrapper mx-auto">
        <div className="bg-white rounded-[12px] shadow-[4px_4px_5px_rgba(0,0,0,0.05)] p-10 flex flex-col gap-2.5">
          {preheadingContent && (
            <p className="mono-wide text-primary">{preheadingContent}</p>
          )}
          <h2 className="heading-2 text-text">
            {parseHeading(headingContent)}
          </h2>
          {bodyContent && (
            <p className="body-large text-text max-w-1/2 mb-3">{bodyContent}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {articles.map((article) => (
              <div
                key={article.heading}
                className="flex flex-col gap-5 items-start"
              >
                <div className="relative w-full aspect-[440/293] rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={article.image.src}
                    alt={article.image.alt}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2.5 w-full">
                  <h3 className="heading-4 text-text">{article.heading}</h3>
                  <p className="body text-text/60 line-clamp-3">
                    {article.content}
                  </p>
                </div>

                <Button
                  variant="tertiary"
                  color="primary"
                  size="sm"
                  hasIcon
                  url={article.ctaUrl}
                >
                  READ MORE
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
