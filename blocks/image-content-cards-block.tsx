'use client'

import dynamic from 'next/dynamic'
import type { LucideIcon } from 'lucide-react'
import { ContentWithButton } from '@/components/content-with-button'
import { Image } from '@/components/image'

const AnimatedCardsGrid = dynamic(
  () =>
    import('@/animations/animated-cards-grid').then((m) => m.AnimatedCardsGrid),
  { ssr: false }
)

export interface ButtonData {
  label: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'neutral'
  hasIcon?: boolean
  onClick?: () => void
  url?: string
}

export interface CardData {
  icon: LucideIcon
  heading: string
  content: string
  alternate?: boolean
}

export interface ImageData {
  src: string
  alt: string
}

export interface ImageContentCardsBlockProps {
  preheadingContent?: string
  headingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  headingContent: string
  bodyContent?: string
  buttons?: ButtonData[]
  cards: CardData[]
  image: ImageData
}

export function ImageContentCardsBlock({
  preheadingContent,
  headingType = 'h2',
  headingContent,
  bodyContent,
  buttons,
  cards,
  image,
}: ImageContentCardsBlockProps) {
  return (
    <section className="py-15 px-5 bg-bluishgray">
      <div className="wrapper mx-auto">
        <div className="grid grid-cols-1 dt:grid-cols-2 gap-15 items-center">
          <div className="hidden dt:block relative w-full aspect-[690/750]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-15">
            <ContentWithButton
              preheadingContent={preheadingContent}
              headingType={headingType}
              headingContent={headingContent}
              bodyContent={bodyContent}
              buttons={buttons}
            />

            <AnimatedCardsGrid cards={cards} />
          </div>
        </div>
      </div>
    </section>
  )
}
