import type { Meta, StoryObj } from '@storybook/nextjs'
import { FaqBlock } from './faq-block'

const meta: Meta<typeof FaqBlock> = {
  title: 'Blocks/FaqBlock',
  component: FaqBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FaqBlock>

const sampleFaqs = [
  {
    question: 'How long does a typical project take?',
    answer:
      "Most projects run between 4 and 12 weeks depending on scope. A brand identity sprint can be done in 2-3 weeks, while a full product build typically takes 8-12 weeks. We'll give you a clear timeline in the first discovery call.",
  },
  {
    question: 'What does your process look like?',
    answer:
      "We start with a discovery phase to deeply understand your goals, users, and constraints. Then we move through strategy, design, build, and launch — with close collaboration at every stage. You'll never be guessing what's happening.",
  },
  {
    question: 'Do you work with early-stage startups?',
    answer:
      "Yes — some of our best work has been with pre-seed and seed-stage companies. We're comfortable working with limited resources, tight timelines, and evolving requirements. We can help you prioritize ruthlessly.",
  },
  {
    question: "What's included in your retainer plans?",
    answer:
      'Retainers include a set number of design and development hours per month, a dedicated Slack channel, weekly check-ins, and priority scheduling. Ideal for companies that need ongoing support without hiring in-house.',
  },
  {
    question: 'Can you hand off to our internal team?',
    answer:
      'Absolutely. We document everything — Figma files, component libraries, CMS schemas, deployment configs — so your team can take over confidently. We also offer a 30-day transition period for questions.',
  },
]

export const Default: Story = {
  args: {
    preheadingContent: 'KNOWLEDGE BASE',
    headingContent: 'Questions, answered',
    bodyContent: "Can't find what you're looking for? Reach out and we'll get back within a day!",
    ctaLabel: 'Get In Touch',
    ctaUrl: '#contact',
    items: sampleFaqs,
  },
}

export const FewQuestions: Story = {
  args: {
    items: sampleFaqs.slice(0, 3),
  },
}

export const CustomLabels: Story = {
  args: {
    preheadingContent: 'SUPPORT',
    headingContent: 'Common questions',
    bodyContent: 'Still have questions? Our team typically responds within 2 business hours.',
    ctaLabel: 'Contact Us',
    ctaUrl: '#',
    items: sampleFaqs,
  },
}
