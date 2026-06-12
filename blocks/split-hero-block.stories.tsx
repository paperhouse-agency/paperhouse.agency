import type { Meta, StoryObj } from '@storybook/nextjs'
import { SplitHeroBlock } from './split-hero-block'

const meta: Meta<typeof SplitHeroBlock> = {
  title: 'Blocks/SplitHeroBlock',
  component: SplitHeroBlock,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SplitHeroBlock>

export const Default: Story = {
  args: {
    headingContent: 'We build digital products that <span>move people</span>',
    bodyContent:
      'Paperhouse is a full-stack creative studio — brand, design, and engineering under one roof.',
    videoPosterImage: { src: '/workspace_bw.png', alt: 'Studio workspace' },
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    buttons: [
      { label: 'Schedule a Meeting', size: 'lg', color: 'primary', url: '#' },
      { label: 'Explore Projects', size: 'lg', color: 'neutral', hasIcon: true, url: '#' },
    ],
  },
}

export const NoVideo: Story = {
  args: {
    headingContent: 'Strategy, design, and <span>engineering</span>',
    bodyContent: 'We work with ambitious companies to build products worth talking about.',
    videoPosterImage: { src: '/paperhouse-banner.jpg', alt: 'Paperhouse Agency' },
    buttons: [
      { label: 'Get Started', size: 'lg', color: 'primary', url: '#' },
    ],
  },
}

export const SingleButton: Story = {
  args: {
    headingContent: 'Your next great product <span>starts here</span>',
    bodyContent:
      'A boutique studio that punches well above its weight. We partner with founders, product teams, and agencies.',
    videoPosterImage: { src: '/workspace_bw.png', alt: 'Creative workspace' },
    videoUrl: '',
    buttons: [
      { label: 'See Our Work', size: 'lg', color: 'primary', hasIcon: true, url: '#' },
    ],
  },
}
