import type { Meta, StoryObj } from '@storybook/nextjs'
import { Lightbulb, Rocket, Shield, Zap, Globe, Code } from 'lucide-react'
import { IconContentCard } from './index'

const meta: Meta<typeof IconContentCard> = {
  title: 'Components/IconContentCard',
  component: IconContentCard,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
  argTypes: {
    alternate: {
      control: 'boolean',
      description: 'Toggle secondary (blue) background mode',
    },
  },
}

export default meta
type Story = StoryObj<typeof IconContentCard>

export const Default: Story = {
  args: {
    icon: Lightbulb,
    heading: 'Innovation First',
    content: "We push the boundaries of what's possible, combining creativity with technical depth.",
    alternate: false,
  },
}

export const Alternate: Story = {
  args: {
    icon: Rocket,
    heading: 'Fast Delivery',
    content: 'Ship production-quality work in days, not months. Speed without sacrificing craft.',
    alternate: true,
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 dt:grid-cols-3 gap-5 max-w-3xl">
      <IconContentCard
        icon={Lightbulb}
        heading="Innovation"
        content="Breaking boundaries with creative technical solutions."
      />
      <IconContentCard
        icon={Shield}
        heading="Reliability"
        content="Rock-solid architecture you can ship to production with confidence."
      />
      <IconContentCard
        icon={Zap}
        heading="Performance"
        content="Sub-second load times, optimized bundles, and smooth animations."
        alternate
      />
    </div>
  ),
}

export const AllCards: Story = {
  render: () => (
    <div className="space-y-10 p-8 max-w-4xl">
      <div>
        <p className="mono-wide text-primary mb-5">Default (white bg)</p>
        <div className="grid grid-cols-3 gap-5">
          <IconContentCard icon={Lightbulb} heading="Innovation" content="Creative solutions that push boundaries." />
          <IconContentCard icon={Code} heading="Engineering" content="Clean, maintainable, and performant code." />
          <IconContentCard icon={Globe} heading="Scale" content="Built to grow with your business from day one." />
        </div>
      </div>
      <div>
        <p className="mono-wide text-primary mb-5">Alternate (secondary blue bg)</p>
        <div className="grid grid-cols-3 gap-5">
          <IconContentCard icon={Rocket} heading="Speed" content="Ship fast without sacrificing quality." alternate />
          <IconContentCard icon={Shield} heading="Security" content="Enterprise-grade protection baked in." alternate />
          <IconContentCard icon={Zap} heading="Performance" content="Optimized for every device and network." alternate />
        </div>
      </div>
    </div>
  ),
}
