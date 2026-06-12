import type { Meta, StoryObj } from '@storybook/nextjs'
import { SectionBlock } from './section-block'

const meta: Meta<typeof SectionBlock> = {
  title: 'Blocks/SectionBlock',
  component: SectionBlock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      control: 'select',
      options: ['offwhite', 'bluishgray', 'white', 'text'],
    },
    paddingSize: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof SectionBlock>

export const OffWhite: Story = {
  args: { backgroundColor: 'offwhite', paddingSize: 'md' },
}

export const BluishGray: Story = {
  args: { backgroundColor: 'bluishgray', paddingSize: 'md' },
}

export const Dark: Story = {
  args: { backgroundColor: 'text', paddingSize: 'md' },
}

export const White: Story = {
  args: { backgroundColor: 'white', paddingSize: 'md' },
}

export const AllBackgrounds: Story = {
  render: () => (
    <div className="space-y-0">
      {(['offwhite', 'bluishgray', 'white', 'text'] as const).map((bg) => (
        <div key={bg} className={`py-10 px-8 ${bg === 'offwhite' ? 'bg-offwhite' : bg === 'bluishgray' ? 'bg-bluishgray' : bg === 'white' ? 'bg-white' : 'bg-text'}`}>
          <p className={`mono-wide ${bg === 'text' ? 'text-offwhite' : 'text-text'}`}>
            bg-{bg}
          </p>
          <p className={`body-small mt-1 ${bg === 'text' ? 'text-offwhite/60' : 'text-text/60'}`}>
            {bg === 'offwhite' && 'Page background — default section bg'}
            {bg === 'bluishgray' && 'Alternate section bg — every other section'}
            {bg === 'white' && 'Card surfaces — lifted above page bg'}
            {bg === 'text' && 'Dark sections — forms, CTAs, footers'}
          </p>
        </div>
      ))}
    </div>
  ),
}
