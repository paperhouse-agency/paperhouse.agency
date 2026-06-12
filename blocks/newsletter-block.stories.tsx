import type { Meta, StoryObj } from '@storybook/nextjs'
import { NewsletterBlock } from './newsletter-block'

const meta: Meta<typeof NewsletterBlock> = {
  title: 'Blocks/NewsletterBlock',
  component: NewsletterBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NewsletterBlock>

export const Default: Story = {}

export const CustomCopy: Story = {
  args: {
    preheadingContent: 'STAY IN THE LOOP',
    headingContent: 'Design & dev insights, twice a month',
    bodyContent: 'Practical thoughts on building better digital products. No fluff. Unsubscribe anytime.',
  },
}

export const MinimalCopy: Story = {
  args: {
    preheadingContent: 'NEWSLETTER',
    headingContent: 'Subscribe for updates',
    bodyContent: 'Join our mailing list.',
  },
}
