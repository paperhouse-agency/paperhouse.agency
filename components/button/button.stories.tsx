import type { Meta, StoryObj } from '@storybook/nextjs'
import { Button } from './index'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'tertiary', 'outline'],
      description: 'Button style variant',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral'],
      description: 'Button color scheme',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    hasIcon: {
      control: 'boolean',
      description: 'Show arrow icon',
    },
    isExternal: {
      control: 'boolean',
      description: 'Open link in new tab',
    },
    content: {
      control: 'text',
      description: 'Button text content',
    },
    url: {
      control: 'text',
      description: 'Link destination',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// Default Stories
export const Default: Story = {
  args: {
    content: 'Click me',
    url: '#',
  },
}

export const WithIcon: Story = {
  args: {
    content: 'Learn More',
    url: '#',
    hasIcon: true,
  },
}

// Variants
export const Tertiary: Story = {
  args: {
    content: 'View All',
    url: '#',
    variant: 'tertiary',
  },
}

export const Outline: Story = {
  args: {
    content: 'Secondary Action',
    url: '#',
    variant: 'outline',
  },
}

// Colors
export const Primary: Story = {
  args: {
    content: 'Primary Button',
    url: '#',
    color: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    content: 'Secondary Button',
    url: '#',
    color: 'secondary',
  },
}

export const Neutral: Story = {
  args: {
    content: 'Neutral Button',
    url: '#',
    color: 'neutral',
  },
}

// Sizes
export const Small: Story = {
  args: {
    content: 'Small Button',
    url: '#',
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    content: 'Medium Button',
    url: '#',
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    content: 'Large Button',
    url: '#',
    size: 'large',
  },
}

// With Icons
export const SmallWithIcon: Story = {
  args: {
    content: 'Small',
    url: '#',
    size: 'small',
    hasIcon: true,
  },
}

export const MediumWithIcon: Story = {
  args: {
    content: 'Medium',
    url: '#',
    size: 'medium',
    hasIcon: true,
  },
}

export const LargeWithIcon: Story = {
  args: {
    content: 'Large',
    url: '#',
    size: 'large',
    hasIcon: true,
  },
}

// External Link
export const ExternalLink: Story = {
  args: {
    content: 'Visit Website',
    url: 'https://example.com',
    isExternal: true,
    hasIcon: true,
  },
}

// Showcase All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      {/* Default Variants */}
      <section>
        <h3 className="heading-5 mb-4">Default Variant</h3>
        <div className="flex flex-wrap gap-4">
          <Button content="Primary" url="#" color="primary" />
          <Button content="Secondary" url="#" color="secondary" />
          <Button content="Neutral" url="#" color="neutral" />
        </div>
      </section>

      {/* Default with Icons */}
      <section>
        <h3 className="heading-5 mb-4">Default with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button content="Primary" url="#" color="primary" hasIcon />
          <Button content="Secondary" url="#" color="secondary" hasIcon />
          <Button content="Neutral" url="#" color="neutral" hasIcon />
        </div>
      </section>

      {/* Outline Variants */}
      <section>
        <h3 className="heading-5 mb-4">Outline Variant</h3>
        <div className="flex flex-wrap gap-4">
          <Button content="Primary" url="#" variant="outline" color="primary" />
          <Button
            content="Secondary"
            url="#"
            variant="outline"
            color="secondary"
          />
          <Button content="Neutral" url="#" variant="outline" color="neutral" />
        </div>
      </section>

      {/* Outline with Icons */}
      <section>
        <h3 className="heading-5 mb-4">Outline with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button
            content="Primary"
            url="#"
            variant="outline"
            color="primary"
            hasIcon
          />
          <Button
            content="Secondary"
            url="#"
            variant="outline"
            color="secondary"
            hasIcon
          />
          <Button
            content="Neutral"
            url="#"
            variant="outline"
            color="neutral"
            hasIcon
          />
        </div>
      </section>

      {/* Tertiary Variants */}
      <section>
        <h3 className="heading-5 mb-4">Tertiary Variant (Mono Wide)</h3>
        <div className="flex flex-wrap gap-4">
          <Button
            content="Primary"
            url="#"
            variant="tertiary"
            color="primary"
          />
          <Button
            content="Secondary"
            url="#"
            variant="tertiary"
            color="secondary"
          />
          <Button
            content="Neutral"
            url="#"
            variant="tertiary"
            color="neutral"
          />
        </div>
      </section>

      {/* Tertiary with Icons */}
      <section>
        <h3 className="heading-5 mb-4">Tertiary with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button
            content="Primary"
            url="#"
            variant="tertiary"
            color="primary"
            hasIcon
          />
          <Button
            content="Secondary"
            url="#"
            variant="tertiary"
            color="secondary"
            hasIcon
          />
          <Button
            content="Neutral"
            url="#"
            variant="tertiary"
            color="neutral"
            hasIcon
          />
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3 className="heading-5 mb-4">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button content="Small" url="#" size="small" />
          <Button content="Medium" url="#" size="medium" />
          <Button content="Large" url="#" size="large" />
        </div>
      </section>

      {/* Sizes with Icons */}
      <section>
        <h3 className="heading-5 mb-4">Sizes with Icons</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button content="Small" url="#" size="small" hasIcon />
          <Button content="Medium" url="#" size="medium" hasIcon />
          <Button content="Large" url="#" size="large" hasIcon />
        </div>
      </section>
    </div>
  ),
}

// Dark Background
export const OnDarkBackground: Story = {
  render: () => (
    <div className="bg-black p-8 space-y-4">
      <Button content="Primary" url="#" color="primary" />
      <Button content="With Icon" url="#" color="primary" hasIcon />
      <Button content="Outline" url="#" variant="outline" color="primary" />
      <Button content="Tertiary" url="#" variant="tertiary" color="primary" />
    </div>
  ),
}
