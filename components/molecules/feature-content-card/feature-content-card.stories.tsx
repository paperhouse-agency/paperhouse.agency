import type { Meta, StoryObj } from '@storybook/nextjs'
import { FeatureContentCard } from './index'

const meta: Meta<typeof FeatureContentCard> = {
  title: 'Components/Molecules/FeatureContentCard',
  component: FeatureContentCard,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FeatureContentCard>

export const Default: Story = {
  args: {
    label: 'WEB DESIGN',
    heading: 'Pixel-perfect interfaces',
    content:
      'We craft visually stunning, conversion-focused websites that are fast, accessible, and built to scale.',
    ctaLabel: 'See Design Work →',
    ctaUrl: '#',
    image: { src: '/paperhouse-banner.jpg', alt: 'Web design showcase' },
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 dt:grid-cols-3 gap-5 max-w-5xl">
      <FeatureContentCard
        label="BRAND IDENTITY"
        heading="Brands that stand out"
        content="Strategic brand identity systems that tell your story and resonate with your audience."
        ctaLabel="See Brand Work →"
        ctaUrl="#"
        image={{ src: '/paperhouse-banner.jpg', alt: 'Brand identity' }}
      />
      <FeatureContentCard
        label="WEB DEVELOPMENT"
        heading="Code built for speed"
        content="Next.js applications with server components, edge rendering, and sub-second load times."
        ctaLabel="See Dev Work →"
        ctaUrl="#"
        image={{ src: '/workspace_bw.png', alt: 'Development work' }}
      />
      <FeatureContentCard
        label="UX STRATEGY"
        heading="Design that converts"
        content="User experience design grounded in research, testing, and measurable outcomes."
        ctaLabel="See UX Work →"
        ctaUrl="#"
        image={{ src: '/paperhouse-banner.jpg', alt: 'UX strategy' }}
      />
    </div>
  ),
}
