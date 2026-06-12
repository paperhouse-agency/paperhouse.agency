import type { Meta, StoryObj } from '@storybook/nextjs'
import { TeamCard } from './index'

const meta: Meta<typeof TeamCard> = {
  title: 'Components/Molecules/TeamCard',
  component: TeamCard,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TeamCard>

export const Default: Story = {
  args: {
    name: 'Zubayer Hossain',
    role: 'Founder & Creative Director',
    image: { src: '/workspace_bw.png', alt: 'Zubayer Hossain' },
    ctaUrl: '#',
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 dt:grid-cols-3 gap-5 max-w-4xl">
      <TeamCard
        name="Alex Rivera"
        role="Lead Product Designer"
        image={{ src: '/workspace_bw.png', alt: 'Alex Rivera' }}
        ctaUrl="#"
      />
      <TeamCard
        name="Jordan Kim"
        role="Senior Engineer"
        image={{ src: '/paperhouse-banner.jpg', alt: 'Jordan Kim' }}
        ctaUrl="#"
      />
      <TeamCard
        name="Sam Chen"
        role="Brand Strategist"
        image={{ src: '/workspace_bw.png', alt: 'Sam Chen' }}
        ctaUrl="#"
      />
    </div>
  ),
}
