import type { BlockSchema } from '@/libs/cms/block-schema'
import { ArticleCard } from '@/components/molecules/article-card'

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
    <section className="py-15 dt:px-5">
      <div className="wrapper mx-auto">
        <div className="bg-white -mx-5 dt:mx-0 dt:rounded-[12px] dt:shadow-[4px_4px_5px_rgba(0,0,0,0.05)] px-5 py-10 dt:p-10 flex flex-col gap-2.5">
          {preheadingContent && (
            <p className="mono-wide text-primary">{preheadingContent}</p>
          )}
          <h2 className="heading-2 text-text">
            {parseHeading(headingContent)}
          </h2>
          {bodyContent && (
            <p className="body-large text-text dt:max-w-1/2 mb-3">
              {bodyContent}
            </p>
          )}

          <div className="grid grid-cols-1 dt:grid-cols-3 gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.heading} {...article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


export const cmsSchema: BlockSchema = {
  type: 'card-grid',
  label: 'Card Grid',
  icon: 'Grid3X3',
  fields: [
    { key: 'preheadingContent', label: 'Preheading', type: 'text', placeholder: 'LATEST WORK', description: 'Optional label above the heading' },
    { key: 'headingContent', label: 'Heading', type: 'text', required: true, span: 'full' },
    { key: 'bodyContent', label: 'Body', type: 'textarea', span: 'full' },
    {
      key: 'articles',
      label: 'Articles',
      type: 'array',
      span: 'full',
      description: 'Each card links to a case study or article',
      fields: [
        { key: 'image', label: 'Image', type: 'image', span: 'full', required: true },
        { key: 'heading', label: 'Heading', type: 'text', required: true },
        { key: 'content', label: 'Description', type: 'textarea', span: 'full' },
        { key: 'ctaUrl', label: 'Link URL', type: 'url' },
      ],
    },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'card-grid',
    preheadingContent: '',
    headingContent: '',
    bodyContent: '',
    articles: [],
  }),
}
