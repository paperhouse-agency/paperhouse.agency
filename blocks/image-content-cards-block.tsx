'use client'
import type { BlockSchema } from '@/libs/cms/block-schema'

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


export const cmsSchema: BlockSchema = {
  type: 'image-content-cards',
  label: 'Image Content Cards',
  icon: 'Image',
  fields: [
    { key: 'preheadingContent', label: 'Preheading', type: 'text' },
    {
      key: 'headingType',
      label: 'Heading Type',
      type: 'select',
      options: [
        { value: 'h1', label: 'H1' },
        { value: 'h2', label: 'H2' },
        { value: 'h3', label: 'H3' },
        { value: 'h4', label: 'H4' },
        { value: 'h5', label: 'H5' },
        { value: 'h6', label: 'H6' },
      ],
      defaultValue: 'h2',
    },
    { key: 'headingContent', label: 'Heading', type: 'text', required: true },
    { key: 'bodyContent', label: 'Body', type: 'textarea' },
    {
      key: 'buttons',
      label: 'Buttons',
      type: 'array',
      fields: [
        { key: 'label', label: 'Label', type: 'text', required: true },
        { key: 'size', label: 'Size', type: 'select', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }] },
        { key: 'color', label: 'Color', type: 'select', options: [{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }, { value: 'neutral', label: 'Neutral' }] },
        { key: 'hasIcon', label: 'Has Icon', type: 'boolean' },
        { key: 'url', label: 'URL', type: 'url' },
      ],
    },
    {
      key: 'cards',
      label: 'Cards',
      type: 'array',
      fields: [
        { key: 'icon', label: 'Icon', type: 'icon', required: true },
        { key: 'heading', label: 'Heading', type: 'text', required: true },
        { key: 'content', label: 'Content', type: 'textarea' },
        { key: 'alternate', label: 'Alternate Style', type: 'boolean' },
      ],
    },
    { key: 'image', label: 'Image', type: 'image', required: true },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'image-content-cards',
    preheadingContent: '',
    headingType: 'h2' as const,
    headingContent: '',
    bodyContent: '',
    buttons: [],
    cards: [],
    image: { src: '', alt: '' },
  }),
}
