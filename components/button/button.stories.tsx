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
    children: {
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
    children: 'Click me',
    url: '#',
  },
}

export const WithIcon: Story = {
  args: {
    children: 'Learn More',
    url: '#',
    hasIcon: true,
  },
}

// Variants
export const Tertiary: Story = {
  args: {
    children: 'View All',
    url: '#',
    variant: 'tertiary',
  },
}

export const Outline: Story = {
  args: {
    children: 'Secondary Action',
    url: '#',
    variant: 'outline',
  },
}

// Colors
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    url: '#',
    color: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    url: '#',
    color: 'secondary',
  },
}

export const Neutral: Story = {
  args: {
    children: 'Neutral Button',
    url: '#',
    color: 'neutral',
  },
}

// Sizes
export const Small: Story = {
  args: {
    children: 'Small Button',
    url: '#',
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    url: '#',
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    url: '#',
    size: 'large',
  },
}

// With Icons
export const SmallWithIcon: Story = {
  args: {
    children: 'Small',
    url: '#',
    size: 'small',
    hasIcon: true,
  },
}

export const MediumWithIcon: Story = {
  args: {
    children: 'Medium',
    url: '#',
    size: 'medium',
    hasIcon: true,
  },
}

export const LargeWithIcon: Story = {
  args: {
    children: 'Large',
    url: '#',
    size: 'large',
    hasIcon: true,
  },
}

// External Link
export const ExternalLink: Story = {
  args: {
    children: 'Visit Website',
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
          <Button url="#" color="primary">
            Primary
          </Button>
          <Button url="#" color="secondary">
            Secondary
          </Button>
          <Button url="#" color="neutral">
            Neutral
          </Button>
        </div>
      </section>

      {/* Default with Icons */}
      <section>
        <h3 className="heading-5 mb-4">Default with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button url="#" color="primary" hasIcon>
            Primary
          </Button>
          <Button url="#" color="secondary" hasIcon>
            Secondary
          </Button>
          <Button url="#" color="neutral" hasIcon>
            Neutral
          </Button>
        </div>
      </section>

      {/* Outline Variants */}
      <section>
        <h3 className="heading-5 mb-4">Outline Variant</h3>
        <div className="flex flex-wrap gap-4">
          <Button url="#" variant="outline" color="primary">
            Primary
          </Button>
          <Button url="#" variant="outline" color="secondary">
            Secondary
          </Button>
          <Button url="#" variant="outline" color="neutral">
            Neutral
          </Button>
        </div>
      </section>

      {/* Outline with Icons */}
      <section>
        <h3 className="heading-5 mb-4">Outline with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button url="#" variant="outline" color="primary" hasIcon>
            Primary
          </Button>
          <Button url="#" variant="outline" color="secondary" hasIcon>
            Secondary
          </Button>
          <Button url="#" variant="outline" color="neutral" hasIcon>
            Neutral
          </Button>
        </div>
      </section>

      {/* Tertiary Variants */}
      <section>
        <h3 className="heading-5 mb-4">Tertiary Variant (Mono Wide)</h3>
        <div className="flex flex-wrap gap-4">
          <Button url="#" variant="tertiary" color="primary">
            Primary
          </Button>
          <Button url="#" variant="tertiary" color="secondary">
            Secondary
          </Button>
          <Button url="#" variant="tertiary" color="neutral">
            Neutral
          </Button>
        </div>
      </section>

      {/* Tertiary with Icons */}
      <section>
        <h3 className="heading-5 mb-4">Tertiary with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button url="#" variant="tertiary" color="primary" hasIcon>
            Primary
          </Button>
          <Button url="#" variant="tertiary" color="secondary" hasIcon>
            Secondary
          </Button>
          <Button url="#" variant="tertiary" color="neutral" hasIcon>
            Neutral
          </Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3 className="heading-5 mb-4">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button url="#" size="small">
            Small
          </Button>
          <Button url="#" size="medium">
            Medium
          </Button>
          <Button url="#" size="large">
            Large
          </Button>
        </div>
      </section>

      {/* Sizes with Icons */}
      <section>
        <h3 className="heading-5 mb-4">Sizes with Icons</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button url="#" size="small" hasIcon>
            Small
          </Button>
          <Button url="#" size="medium" hasIcon>
            Medium
          </Button>
          <Button url="#" size="large" hasIcon>
            Large
          </Button>
        </div>
      </section>
    </div>
  ),
}

// Dark Background
export const OnDarkBackground: Story = {
  render: () => (
    <div className="bg-black p-8 space-y-4">
      <Button url="#" color="primary">
        Primary
      </Button>
      <Button url="#" color="primary" hasIcon>
        With Icon
      </Button>
      <Button url="#" variant="outline" color="primary">
        Outline
      </Button>
      <Button url="#" variant="tertiary" color="primary">
        Tertiary
      </Button>
    </div>
  ),
}
