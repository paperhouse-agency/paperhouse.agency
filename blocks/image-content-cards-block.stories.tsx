import type { Meta, StoryObj } from '@storybook/nextjs'
import { Lightbulb, Shield, Zap, Globe, Code, Layers } from 'lucide-react'
import { ImageContentCardsBlock } from './image-content-cards-block'

const meta: Meta<typeof ImageContentCardsBlock> = {
  title: 'Blocks/ImageContentCardsBlock',
  component: ImageContentCardsBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ImageContentCardsBlock>

const sampleCards = [
  {
    icon: Lightbulb,
    heading: 'Strategy first',
    content: 'We start with deep discovery to understand your goals before touching design.',
  },
  {
    icon: Layers,
    heading: 'Design systems',
    content: 'Token-based systems that scale from a single component to an entire product.',
    alternate: true,
  },
  {
    icon: Code,
    heading: 'Clean code',
    content: 'Server-first Next.js architecture with type-safe APIs and minimal bundle size.',
  },
]

export const Default: Story = {
  args: {
    preheadingContent: 'HOW WE WORK',
    headingContent: 'Our approach to <span>great work</span>',
    bodyContent:
      'Every project at Paperhouse starts with honest conversation and ends with a product that exceeds expectations.',
    image: { src: '/workspace_bw.png', alt: 'Studio workspace' },
    cards: sampleCards,
    buttons: [
      { label: 'Learn More', size: 'lg', color: 'primary', url: '#' },
    ],
  },
}

export const WithMultipleButtons: Story = {
  args: {
    preheadingContent: 'THE METHOD',
    headingContent: 'Precision at every <span>step</span>',
    bodyContent: 'A repeatable creative process refined over hundreds of projects.',
    image: { src: '/paperhouse-banner.jpg', alt: 'Creative process' },
    cards: [
      { icon: Lightbulb, heading: 'Discover', content: 'Understand users, market, and constraints.' },
      { icon: Shield, heading: 'Define', content: 'Set clear goals and measurable success criteria.', alternate: true },
      { icon: Zap, heading: 'Deliver', content: 'Ship fast, iterate with feedback.' },
    ],
    buttons: [
      { label: 'Our Process', size: 'lg', color: 'primary', url: '#' },
      { label: 'See Case Studies', size: 'lg', color: 'neutral', hasIcon: true, url: '#' },
    ],
  },
}

export const DifferentImage: Story = {
  args: {
    preheadingContent: 'CAPABILITIES',
    headingContent: 'Full-stack <span>creative studio</span>',
    bodyContent: 'From brand to code — we bring every discipline in-house.',
    image: { src: '/paperhouse-banner.jpg', alt: 'Team capabilities' },
    cards: [
      { icon: Globe, heading: 'Brand & Identity', content: 'Logo, type, color, and voice systems.' },
      { icon: Layers, heading: 'UX & Product Design', content: 'Research-led design for digital products.', alternate: true },
      { icon: Code, heading: 'Engineering', content: 'Next.js, React, TypeScript, and more.' },
    ],
    buttons: [
      { label: 'View Services', size: 'lg', color: 'primary', url: '#' },
    ],
  },
}
