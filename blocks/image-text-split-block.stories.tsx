import type { Meta, StoryObj } from '@storybook/nextjs'
import { ImageTextSplitBlock } from './image-text-split-block'

const meta: Meta<typeof ImageTextSplitBlock> = {
  title: 'Blocks/ImageTextSplitBlock',
  component: ImageTextSplitBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ImageTextSplitBlock>

export const Default: Story = {}

export const CustomContent: Story = {
  args: {
    image: { src: '/paperhouse-banner.jpg', alt: 'Paperhouse Studio' },
    heading: 'Our Studio\nPhilosophy',
    bodyContent:
      'We believe the best digital products come from close collaboration between designers, engineers, and strategists. Every decision we make is grounded in real user needs — not trends or assumptions.',
    ctaLabel: 'Meet the Team',
    ctaUrl: '/about',
  },
}

export const NoImage: Story = {
  args: {
    image: undefined,
    heading: 'Built on\nTrust & Craft',
    bodyContent:
      'Fifteen years of combined experience building digital products for startups, scale-ups, and established brands.',
    ctaLabel: 'Our Story',
    ctaUrl: '#',
  },
}
