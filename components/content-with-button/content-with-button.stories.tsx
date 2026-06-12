import type { Meta, StoryObj } from '@storybook/nextjs'
import { ContentWithButton } from './index'

const meta: Meta<typeof ContentWithButton> = {
  title: 'Components/ContentWithButton',
  component: ContentWithButton,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ContentWithButton>

export const Default: Story = {
  args: {
    preheadingContent: 'SECTION LABEL',
    headingContent: 'Build something worth <span>talking about</span>',
    bodyContent:
      'We design and build digital products that move people — combining strategy, craft, and technology into experiences that last.',
    buttons: [
      { label: 'Get Started', size: 'lg', color: 'primary', url: '#' },
      { label: 'See Our Work', size: 'lg', color: 'neutral', hasIcon: true, url: '#' },
    ],
  },
}

export const HeadingOnly: Story = {
  args: {
    headingContent: 'Heading without <span>preheading</span>',
  },
}

export const WithPreheadingAndBody: Story = {
  args: {
    preheadingContent: 'OUR APPROACH',
    headingContent: 'Three steps for your <span>Digital Growth!</span>',
    bodyContent:
      'We pair deep technical expertise with a design-first mindset to help ambitious companies ship products their users love.',
  },
}

export const WithMultilineHeading: Story = {
  args: {
    preheadingContent: 'THE PROCESS',
    headingContent: 'From idea\nto <span>launch</span>',
    bodyContent: 'Every project starts with a clear brief and ends with a product your customers keep coming back to.',
    buttons: [{ label: 'Learn More', size: 'md', color: 'primary', hasIcon: true, url: '#' }],
  },
}

export const SingleButton: Story = {
  args: {
    preheadingContent: 'READY TO START?',
    headingContent: "Let's build something <span>great</span> together",
    bodyContent: 'Book a free 30-minute discovery call. No pitch, no pressure.',
    buttons: [{ label: 'Schedule a Call', size: 'lg', color: 'primary', url: '#' }],
  },
}

export const Centered: Story = {
  render: () => (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
      <ContentWithButton
        preheadingContent="CENTERED LAYOUT"
        headingContent="Use a wrapper div to <span>center</span> content"
        bodyContent="ContentWithButton does not center text by default — wrap with flex flex-col items-center text-center."
        buttons={[
          { label: 'Primary CTA', size: 'lg', color: 'primary', url: '#' },
        ]}
      />
    </div>
  ),
}

export const OnDarkBackground: Story = {
  render: () => (
    <div className="bg-text p-10 rounded-lg">
      <ContentWithButton
        preheadingContent="DARK SECTION"
        headingContent="Content on <span>dark</span> background"
        bodyContent="The component adapts — primary orange and offwhite text work on dark backgrounds."
        headingClassName="heading-2 text-offwhite"
        bodyClassName="text-offwhite/60"
        buttons={[
          { label: 'Get Started', size: 'lg', color: 'primary', url: '#' },
          { label: 'Learn More', size: 'lg', color: 'neutral', hasIcon: true, url: '#' },
        ]}
      />
    </div>
  ),
}
