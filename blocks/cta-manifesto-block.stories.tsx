import type { Meta, StoryObj } from '@storybook/nextjs'
import { CtaManifestoBlock } from './cta-manifesto-block'

const meta: Meta<typeof CtaManifestoBlock> = {
  title: 'Blocks/CtaManifestoBlock',
  component: CtaManifestoBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CtaManifestoBlock>

export const Default: Story = {}

export const CustomCopy: Story = {
  args: {
    preheadingContent: "LET'S COLLABORATE",
    headingLine1: "Have a project in mind?",
    headingLine2: "Let's make it happen.",
    primaryCta: { label: 'Book a Call', url: '#' },
    secondaryCta: { label: 'View Our Work', url: '#' },
  },
}

export const AggressiveCTA: Story = {
  args: {
    preheadingContent: 'LIMITED AVAILABILITY',
    headingLine1: "We only take 3 new clients",
    headingLine2: "per quarter. Apply now.",
    primaryCta: { label: 'Apply for a Spot', url: '#' },
    secondaryCta: { label: 'See Past Work', url: '#' },
  },
}
