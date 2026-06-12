import type { Meta, StoryObj } from '@storybook/nextjs'
import { TaglineMarqueeBlock } from './tagline-marquee-block'

const meta: Meta<typeof TaglineMarqueeBlock> = {
  title: 'Blocks/TaglineMarqueeBlock',
  component: TaglineMarqueeBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TaglineMarqueeBlock>

export const Default: Story = {}

export const ServicesMarquee: Story = {
  args: {
    items: [
      { label: 'Brand Identity' },
      { label: 'UI/UX Design' },
      { label: 'Web Development' },
      { label: 'Digital Strategy' },
      { label: 'Motion Design' },
      { label: 'SaaS Platforms' },
      { label: 'E-Commerce' },
      { label: 'CMS Architecture' },
    ],
  },
}

export const IndustriesMarquee: Story = {
  args: {
    items: [
      { label: 'Fintech' },
      { label: 'Healthcare' },
      { label: 'E-Commerce' },
      { label: 'SaaS' },
      { label: 'Web3' },
      { label: 'Consumer Apps' },
    ],
  },
}

export const ValuesMarquee: Story = {
  args: {
    items: [
      { label: 'Craft Over Haste' },
      { label: 'Honest Collaboration' },
      { label: 'Ship Fast' },
      { label: 'No Bloat' },
      { label: 'Pixel Perfect' },
      { label: 'Always Iterating' },
    ],
  },
}
