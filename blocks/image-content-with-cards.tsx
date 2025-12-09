'use client'

import type { LucideIcon } from 'lucide-react'
import { AnimatedCardsGrid } from '@/animations/animated-cards-grid'
import { ContentWithButton } from '@/components/content-with-button'
import { Image } from '@/components/image'

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

export interface ImageContentWithCardsProps {
  preheadingContent?: string
  headingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  headingContent: string
  bodyContent?: string
  buttons?: ButtonData[]
  cards: CardData[]
  image: ImageData
}

export function ImageContentWithCards({
  preheadingContent,
  headingType = 'h2',
  headingContent,
  bodyContent,
  buttons,
  cards,
  image,
}: ImageContentWithCardsProps) {
  return (
    <section className="py-15 px-5 bg-bluishgray">
      <div className="wrapper mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-center">
          {/* Left side - Image (hidden on mobile) */}
          <div className="hidden md:block relative w-full aspect-690/750">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </div>

          {/* Right side - Content and Cards */}
          <div className="flex flex-col gap-15">
            <ContentWithButton
              preheadingContent={preheadingContent}
              headingType={headingType}
              headingContent={headingContent}
              bodyContent={bodyContent}
              buttons={buttons}
            />

            {/* Animated Cards Grid */}
            <AnimatedCardsGrid cards={cards} />
          </div>
        </div>
      </div>
    </section>
  )
}
