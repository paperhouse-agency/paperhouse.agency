import type { Meta, StoryObj } from '@storybook/nextjs'
import { BrandsBlock } from './brands-block'

const meta: Meta<typeof BrandsBlock> = {
  title: 'Blocks/BrandsBlock',
  component: BrandsBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BrandsBlock>

export const Default: Story = {}

export const CustomBrands: Story = {
  args: {
    items: [
      { name: 'Acme Corp' },
      { name: 'TechFlow' },
      { name: 'BuildCo' },
      { name: 'Launchpad' },
      { name: 'Nucleus' },
      { name: 'Orbit Labs' },
      { name: 'Meridian' },
      { name: 'Apex' },
    ],
  },
}

export const FewBrands: Story = {
  args: {
    items: [
      { name: 'Stripe' },
      { name: 'Vercel' },
      { name: 'Figma' },
      { name: 'Linear' },
    ],
  },
}
