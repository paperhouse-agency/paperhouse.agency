import type { Meta, StoryObj } from '@storybook/nextjs'
import { PeopleGridBlock } from './people-grid-block'

const meta: Meta<typeof PeopleGridBlock> = {
  title: 'Blocks/PeopleGridBlock',
  component: PeopleGridBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PeopleGridBlock>

const sampleMembers = [
  {
    name: 'Zubayer Hossain',
    role: 'Founder & Creative Director',
    image: { src: '/workspace_bw.png', alt: 'Zubayer Hossain' },
    ctaUrl: '#',
  },
  {
    name: 'Alex Rivera',
    role: 'Lead Product Designer',
    image: { src: '/paperhouse-banner.jpg', alt: 'Alex Rivera' },
    ctaUrl: '#',
  },
  {
    name: 'Jordan Kim',
    role: 'Senior Full-Stack Engineer',
    image: { src: '/workspace_bw.png', alt: 'Jordan Kim' },
    ctaUrl: '#',
  },
]

export const Default: Story = {
  args: {
    preheadingContent: 'THE TEAM',
    headingContent: 'The people behind <span>great work</span>',
    bodyContent:
      'A small, senior team — no juniors, no offshore handoffs. You work directly with the people doing the work.',
    members: sampleMembers,
  },
}

export const LargeTeam: Story = {
  args: {
    preheadingContent: 'OUR PEOPLE',
    headingContent: 'Meet the <span>studio</span>',
    members: [
      ...sampleMembers,
      {
        name: 'Sam Chen',
        role: 'Brand Strategist',
        image: { src: '/paperhouse-banner.jpg', alt: 'Sam Chen' },
        ctaUrl: '#',
      },
      {
        name: 'Taylor Osei',
        role: 'Motion Designer',
        image: { src: '/workspace_bw.png', alt: 'Taylor Osei' },
        ctaUrl: '#',
      },
      {
        name: 'Morgan Lee',
        role: 'Project Lead',
        image: { src: '/paperhouse-banner.jpg', alt: 'Morgan Lee' },
        ctaUrl: '#',
      },
    ],
  },
}

export const NoBody: Story = {
  args: {
    preheadingContent: 'TEAM',
    headingContent: 'Who we <span>are</span>',
    members: sampleMembers,
  },
}
