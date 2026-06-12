import type { Meta, StoryObj } from '@storybook/nextjs'
import { Search, Palette, Code, Rocket } from 'lucide-react'
import { NumberedStepsBlock } from './numbered-steps-block'

const meta: Meta<typeof NumberedStepsBlock> = {
  title: 'Blocks/NumberedStepsBlock',
  component: NumberedStepsBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NumberedStepsBlock>

const sampleSteps = [
  {
    icon: Search,
    number: '01',
    heading: 'Discover',
    content:
      'We start by deeply understanding your business, users, and goals through workshops and research.',
  },
  {
    icon: Palette,
    number: '02',
    heading: 'Design',
    content:
      'We translate insights into a clear creative direction — wireframes, prototypes, and visual systems.',
    alternate: true,
  },
  {
    icon: Code,
    number: '03',
    heading: 'Build',
    content:
      'Engineering takes over with server-first Next.js, TypeScript, and a component-driven approach.',
  },
  {
    icon: Rocket,
    number: '04',
    heading: 'Launch',
    content:
      'We deploy, monitor, and iterate — then hand off cleanly with documentation and training.',
    alternate: true,
  },
]

export const Default: Story = {
  args: {
    preheadingContent: 'THE PROCESS',
    headingContent: 'Four steps to a <span>great product</span>',
    bodyContent:
      "A clear, repeatable process refined over hundreds of projects. You always know where we are and what's next.",
    steps: sampleSteps,
  },
}

export const NoPreheading: Story = {
  args: {
    headingContent: 'How we <span>work</span>',
    bodyContent: 'Our creative process — from brief to launch.',
    steps: sampleSteps,
  },
}

export const ThreeSteps: Story = {
  args: {
    preheadingContent: 'OUR METHOD',
    headingContent: 'Simple, <span>effective</span> process',
    bodyContent: 'Three clear phases — no surprises, no handoff chaos.',
    steps: sampleSteps.slice(0, 3),
  },
}
