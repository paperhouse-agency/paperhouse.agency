import type { Meta, StoryObj } from '@storybook/nextjs'
import { CardGridBlock } from './card-grid-block'

const meta: Meta<typeof CardGridBlock> = {
  title: 'Blocks/CardGridBlock',
  component: CardGridBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CardGridBlock>

const sampleArticles = [
  {
    image: { src: '/paperhouse-banner.jpg', alt: 'Brand identity project' },
    heading: 'Complete brand identity for a Series A startup',
    content:
      'From naming and logo to full brand guidelines and website — delivered in 3 weeks, ready for launch.',
    ctaUrl: '#',
  },
  {
    image: { src: '/workspace_bw.png', alt: 'Design system' },
    heading: 'Design system that scaled to 12 product teams',
    content:
      'A token-based design system with 200+ components, living documentation, and a shared Figma library.',
    ctaUrl: '#',
  },
  {
    image: { src: '/paperhouse-banner.jpg', alt: 'E-commerce' },
    heading: 'E-commerce rebuild with 3× conversion lift',
    content:
      'We rebuilt the product pages, checkout flow, and cart experience for a high-volume DTC brand.',
    ctaUrl: '#',
  },
]

export const Default: Story = {
  args: {
    preheadingContent: 'RECENT WORK',
    headingContent: 'Projects that speak for <span>themselves</span>',
    bodyContent: 'A selection of work from our studio — spanning brand, product, and web.',
    articles: sampleArticles,
  },
}

export const NoBody: Story = {
  args: {
    preheadingContent: 'CASE STUDIES',
    headingContent: "What we've <span>built</span>",
    articles: sampleArticles,
  },
}

export const SixCards: Story = {
  args: {
    preheadingContent: 'OUR PORTFOLIO',
    headingContent: "Work we're <span>proud of</span>",
    bodyContent: "Every project is a collaboration. Here's what we've shipped together.",
    articles: [
      ...sampleArticles,
      {
        image: { src: '/workspace_bw.png', alt: 'Mobile app' },
        heading: 'Mobile app for a wellness startup',
        content: 'iOS and Android app design with a custom component system.',
        ctaUrl: '#',
      },
      {
        image: { src: '/paperhouse-banner.jpg', alt: 'SaaS platform' },
        heading: 'SaaS dashboard redesign',
        content: 'Turning a complex data product into a joy to use.',
        ctaUrl: '#',
      },
      {
        image: { src: '/workspace_bw.png', alt: 'Landing page' },
        heading: 'Launch landing page with 18% signup rate',
        content: 'A high-converting landing page built and shipped in 5 days.',
        ctaUrl: '#',
      },
    ],
  },
}
