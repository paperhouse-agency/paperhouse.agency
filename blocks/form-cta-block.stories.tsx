import type { Meta, StoryObj } from '@storybook/nextjs'
import { FormCtaBlock } from './form-cta-block'

const meta: Meta<typeof FormCtaBlock> = {
  title: 'Blocks/FormCtaBlock',
  component: FormCtaBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormCtaBlock>

export const Default: Story = {}

export const CustomCopy: Story = {
  args: {
    headingLine1: 'Ready to start?',
    headingLine2: "Tell us",
    bodyContent:
      "Drop us a message and we'll get back to you within one business day.",
  },
}

export const MinimalCopy: Story = {
  args: {
    headingLine1: 'Work with us.',
    headingLine2: "Contact",
    bodyContent: "We're always looking for interesting new projects.",
  },
}
