import type { Meta, StoryObj } from '@storybook/nextjs'
import { FeatureCardsBlock } from './feature-cards-block'

const meta: Meta<typeof FeatureCardsBlock> = {
  title: 'Blocks/FeatureCardsBlock',
  component: FeatureCardsBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FeatureCardsBlock>

const sampleCards = [
  {
    label: 'BRAND IDENTITY',
    heading: 'Brands that stand out',
    content:
      'Strategic brand identity systems — logo, color, type, voice — that tell your story and convert strangers into fans.',
    ctaLabel: 'See Brand Work →',
    ctaUrl: '#',
    image: { src: '/paperhouse-banner.jpg', alt: 'Brand identity showcase' },
  },
  {
    label: 'WEB DESIGN',
    heading: 'Pixel-perfect interfaces',
    content:
      'Visually stunning, conversion-focused websites built for performance, accessibility, and scale.',
    ctaLabel: 'See Design Work →',
    ctaUrl: '#',
    image: { src: '/workspace_bw.png', alt: 'Web design showcase' },
  },
  {
    label: 'DEVELOPMENT',
    heading: 'Code built to last',
    content:
      'Next.js applications with server components, edge rendering, and the infrastructure to grow.',
    ctaLabel: 'See Dev Work →',
    ctaUrl: '#',
    image: { src: '/paperhouse-banner.jpg', alt: 'Development showcase' },
  },
]

export const Default: Story = {
  args: {
    preheadingContent: 'WHAT WE DO',
    headingContent: 'Services built for <span>ambitious</span> companies',
    bodyContent: 'From brand identity to full-stack product builds — we cover the full spectrum.',
    cards: sampleCards,
  },
}

export const NoPreheading: Story = {
  args: {
    headingContent: 'Our <span>core services</span>',
    cards: sampleCards,
  },
}

export const TwoCards: Story = {
  args: {
    preheadingContent: 'SPECIALISMS',
    headingContent: 'Where we <span>excel</span>',
    cards: sampleCards.slice(0, 2),
  },
}
