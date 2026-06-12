import type { Meta, StoryObj } from '@storybook/nextjs'
import { BentoStatsBlock } from './bento-stats-block'

const meta: Meta<typeof BentoStatsBlock> = {
  title: 'Blocks/BentoStatsBlock',
  component: BentoStatsBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BentoStatsBlock>

const defaultMetrics = {
  large: {
    value: '200+',
    heading: 'Projects delivered',
    content: 'Across SaaS, e-commerce, fintech, and brand identity.',
  },
  image1: { src: '/workspace_bw.png', alt: 'Team at work' },
  medium: {
    value: '98%',
    heading: 'Client satisfaction',
    content: 'Measured through post-project surveys.',
  },
  small: {
    value: '5★',
    heading: 'Average rating',
    content: "On every platform we're listed on.",
  },
  image2: { src: '/paperhouse-banner.jpg', alt: 'Paperhouse studio' },
}

export const Default: Story = {
  args: {
    preheadingContent: 'OUR TRACK RECORD',
    metrics: defaultMetrics,
  },
}

export const CustomPreheading: Story = {
  args: {
    preheadingContent: 'BY THE NUMBERS',
    metrics: defaultMetrics,
  },
}
