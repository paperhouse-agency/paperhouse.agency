import type { Meta, StoryObj } from '@storybook/nextjs'
import { ArticleCard } from './index'

const meta: Meta<typeof ArticleCard> = {
  title: 'Components/Molecules/ArticleCard',
  component: ArticleCard,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ArticleCard>

export const Default: Story = {
  args: {
    image: { src: '/paperhouse-banner.jpg', alt: 'Project thumbnail' },
    heading: 'Redesigning the onboarding flow for a SaaS platform',
    content:
      'How we reduced drop-off by 42% by rethinking every step of the signup journey — from first touch to first value.',
    ctaUrl: '#',
  },
}

export const LongContent: Story = {
  args: {
    image: { src: '/workspace_bw.png', alt: 'Workspace' },
    heading: 'Building a design system from scratch in 6 weeks',
    content:
      'A case study on how we created a comprehensive design system for a fintech startup — covering tokens, components, patterns, and documentation — in record time without cutting corners on quality or accessibility.',
    ctaUrl: '#',
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 dt:grid-cols-3 gap-5 max-w-5xl">
      <ArticleCard
        image={{ src: '/paperhouse-banner.jpg', alt: 'Brand identity project' }}
        heading="Complete brand identity for a Series A startup"
        content="From naming and logo to full brand guidelines and website — delivered in 3 weeks."
        ctaUrl="#"
      />
      <ArticleCard
        image={{ src: '/workspace_bw.png', alt: 'Design system work' }}
        heading="Design system that scaled to 12 product teams"
        content="A token-based design system with 200+ components, living documentation, and a Figma library."
        ctaUrl="#"
      />
      <ArticleCard
        image={{ src: '/paperhouse-banner.jpg', alt: 'E-commerce project' }}
        heading="E-commerce rebuild with 3× conversion lift"
        content="We rebuilt the product pages, checkout flow, and cart experience for a DTC brand."
        ctaUrl="#"
      />
    </div>
  ),
}
