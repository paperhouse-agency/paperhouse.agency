import cn from 'clsx'
import type { ReactElement } from 'react'
import { createElement } from 'react'
import { Button } from '@/components/button'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type PreheadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

interface ContentWithButtonProps {
  preheadingType?: PreheadingTag
  preheadingContent?: string
  headingType?: HeadingTag
  headingContent: string
  headingClassName?: string
  bodyContent?: string
  bodyClassName?: string
  buttons?: Array<{
    label: string
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'neutral'
    hasIcon?: boolean
    onClick?: () => void
    url?: string
  }>
}

export function ContentWithButton({
  preheadingType = 'h6',
  preheadingContent,
  headingType = 'h2',
  headingContent,
  headingClassName,
  bodyContent,
  bodyClassName,
  buttons,
}: ContentWithButtonProps) {
  // Extract the highlighted word and handle newlines (format: "word1 word2 <span>highlighted</span> word3\nword4")
  const renderHeadingWithHighlight = (content: string) => {
    const parts = content.split(/(<span>.*?<\/span>)/g).filter(Boolean)
    let elementCounter = 0

    return parts.flatMap((part, partIndex) => {
      if (part.startsWith('<span>') && part.endsWith('</span>')) {
        const text = part.replace('<span>', '').replace('</span>', '')
        return (
          <span key={`highlight-${text}`} className="text-primary">
            {text}
          </span>
        )
      }

      // Split by newlines and insert <br /> tags
      const lines = part.split(/\\n|\n/)
      const result: ReactElement[] = []

      for (const line of lines) {
        if (line) {
          const sanitized = line.replace(/\s+/g, '-').slice(0, 20)
          const uniqueKey = `text-${sanitized}-${partIndex}-${elementCounter++}`
          result.push(<span key={uniqueKey}>{line}</span>)
        }
        // Add <br /> after each line except the last one
        if (line !== lines[lines.length - 1]) {
          const sanitized = line?.replace(/\s+/g, '-').slice(0, 10) || 'empty'
          const brKey = `br-${sanitized}-${partIndex}-${elementCounter++}`
          result.push(<br key={brKey} />)
        }
      }

      return result
    })
  }

  return (
    <div className="flex flex-col">
      {/* Heading first in DOM for SEO, but ordered second visually */}
      {createElement(
        headingType,
        {
          className: cn(
            'mb-6',
            preheadingContent ? 'order-2' : 'order-1',
            headingClassName || 'heading-2'
          ),
        },
        renderHeadingWithHighlight(headingContent)
      )}

      {/* Preheading second in DOM, but ordered first visually */}
      {preheadingContent &&
        createElement(
          preheadingType,
          {
            className: 'mono-wide text-primary uppercase order-1 mb-3',
          },
          preheadingContent
        )}

      {/* Body content ordered third */}
      {bodyContent && (
        <p
          className={cn(
            'body-large text-text/60 pb-6',
            preheadingContent ? 'order-3' : 'order-2',
            bodyClassName
          )}
        >
          {bodyContent}
        </p>
      )}

      {/* Buttons ordered last */}
      {buttons && buttons.length > 0 && (
        <div
          className={cn(
            'flex items-center justify-start gap-5',
            preheadingContent ? 'order-4' : 'order-3'
          )}
        >
          {buttons.map((button, buttonIndex) => (
            <Button
              key={`button-${buttonIndex}-${button.label}`}
              size={button.size || 'md'}
              color={button.color || 'primary'}
              hasIcon={button.hasIcon}
              onClick={button.onClick}
              url={button.url}
            >
              {button.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
