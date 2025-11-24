import type { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj

const TypographyShowcase = () => {
  return (
    <div className="space-y-16 p-8">
      {/* Headings */}
      <section>
        <h2 className="body-small uppercase tracking-wider text-gray-500 mb-8">
          Headings — Bianco Serif Regular
        </h2>
        <div className="space-y-6">
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">
              heading-1 / 96px
            </p>
            <h1 className="heading-1">The quick brown fox</h1>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">
              heading-2 / 72px
            </p>
            <h2 className="heading-2">The quick brown fox jumps</h2>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">
              heading-3 / 48px
            </p>
            <h3 className="heading-3">The quick brown fox jumps over</h3>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">
              heading-4 / 32px
            </p>
            <h4 className="heading-4">
              The quick brown fox jumps over the lazy dog
            </h4>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">
              heading-5 / 24px
            </p>
            <h5 className="heading-5">
              The quick brown fox jumps over the lazy dog
            </h5>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">
              heading-6 / 20px
            </p>
            <h6 className="heading-6">
              The quick brown fox jumps over the lazy dog
            </h6>
          </div>
        </div>
      </section>

      {/* Body Text */}
      <section>
        <h2 className="body-small uppercase tracking-wider text-gray-500 mb-8">
          Body — IBM Plex Sans
        </h2>
        <div className="space-y-6">
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">
              body-large / 18px
            </p>
            <p className="body-large max-w-2xl">
              The quick brown fox jumps over the lazy dog. A wonderful serenity
              has taken possession of my entire soul, like these sweet mornings
              of spring which I enjoy with my whole heart.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">body / 16px</p>
            <p className="body max-w-2xl">
              The quick brown fox jumps over the lazy dog. A wonderful serenity
              has taken possession of my entire soul, like these sweet mornings
              of spring which I enjoy with my whole heart. I am alone, and feel
              the charm of existence in this spot.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">
              body-small / 14px
            </p>
            <p className="body-small max-w-2xl">
              The quick brown fox jumps over the lazy dog. A wonderful serenity
              has taken possession of my entire soul, like these sweet mornings
              of spring which I enjoy with my whole heart. I am alone, and feel
              the charm of existence in this spot, which was created for the
              bliss of souls like mine.
            </p>
          </div>
        </div>
      </section>

      {/* Mono */}
      <section>
        <h2 className="body-small uppercase tracking-wider text-gray-500 mb-8">
          Monospace — PP Neue Montreal Mono
        </h2>
        <div className="space-y-6">
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">mono / 16px</p>
            <p className="mono max-w-2xl">
              The quick brown fox jumps over the lazy dog
              <br />
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
              <br />
              abcdefghijklmnopqrstuvwxyz
              <br />
              0123456789 !@#$%^&*()
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-gray-400 mb-2">
              mono-wide / 14px / Tracking 10%
            </p>
            <p className="mono-wide max-w-2xl">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </section>

      {/* Font Weights Showcase */}
      <section>
        <h2 className="font-body text-sm uppercase tracking-wider text-gray-500 mb-8">
          Font Weights
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {/* Bianco Serif */}
          <div>
            <h3 className="font-body text-xs uppercase text-gray-400 mb-4">
              Bianco Serif
            </h3>
            <div className="space-y-2">
              <p className="font-heading text-2xl font-normal">Regular 400</p>
              <p className="font-heading text-2xl font-normal italic">
                Regular 400 Italic
              </p>
              <p className="font-heading text-2xl font-bold">Bold 700</p>
              <p className="font-heading text-2xl font-bold italic">
                Bold 700 Italic
              </p>
              <p className="font-heading text-2xl font-extrabold">
                Extra Bold 800
              </p>
              <p className="font-heading text-2xl font-extrabold italic">
                Extra Bold 800 Italic
              </p>
            </div>
          </div>

          {/* IBM Plex Sans */}
          <div>
            <h3 className="font-body text-xs uppercase text-gray-400 mb-4">
              IBM Plex Sans
            </h3>
            <div className="space-y-2">
              <p className="font-body text-2xl font-normal">Regular 400</p>
              <p className="font-body text-2xl font-normal italic">
                Regular 400 Italic
              </p>
              <p className="font-body text-2xl font-medium">Medium 500</p>
              <p className="font-body text-2xl font-medium italic">
                Medium 500 Italic
              </p>
              <p className="font-body text-2xl font-semibold">Semibold 600</p>
              <p className="font-body text-2xl font-semibold italic">
                Semibold 600 Italic
              </p>
              <p className="font-body text-2xl font-bold">Bold 700</p>
              <p className="font-body text-2xl font-bold italic">
                Bold 700 Italic
              </p>
            </div>
          </div>

          {/* PP Neue Montreal Mono */}
          <div>
            <h3 className="font-body text-xs uppercase text-gray-400 mb-4">
              PP Neue Montreal Mono
            </h3>
            <div className="space-y-2">
              <p className="font-mono text-2xl font-normal">Book 400</p>
              <p className="font-mono text-2xl font-normal italic">
                Book 400 Italic
              </p>
              <p className="font-mono text-2xl font-medium">Medium 500</p>
              <p className="font-mono text-2xl font-bold">Bold 700</p>
              <p className="font-mono text-2xl font-bold italic">
                Bold 700 Italic
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export const AllTypography: Story = {
  render: () => <TypographyShowcase />,
}

export const HeadingsOnly: Story = {
  render: () => (
    <div className="space-y-6 p-8">
      <h1 className="heading-1">Heading 1</h1>
      <h2 className="heading-2">Heading 2</h2>
      <h3 className="heading-3">Heading 3</h3>
      <h4 className="heading-4">Heading 4</h4>
      <h5 className="heading-5">Heading 5</h5>
      <h6 className="heading-6">Heading 6</h6>
    </div>
  ),
}

export const BodyText: Story = {
  render: () => (
    <div className="space-y-6 p-8 max-w-2xl">
      <p className="body-large">
        Body Large - A wonderful serenity has taken possession of my entire
        soul, like these sweet mornings of spring which I enjoy with my whole
        heart.
      </p>
      <p className="body">
        Body - A wonderful serenity has taken possession of my entire soul, like
        these sweet mornings of spring which I enjoy with my whole heart.
      </p>
      <p className="body-small">
        Body Small - A wonderful serenity has taken possession of my entire
        soul, like these sweet mornings of spring which I enjoy with my whole
        heart.
      </p>
    </div>
  ),
}

export const MonospaceText: Story = {
  render: () => (
    <div className="space-y-6 p-8">
      <p className="mono">Regular mono text for code and technical content</p>
      <p className="mono-wide">Mono wide with 10% tracking</p>
      <pre className="mono bg-gray-100 p-4 rounded">
        {`function hello() {
  console.log("Hello, World!");
  return true;
}`}
      </pre>
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div className="bg-black text-white p-8 space-y-8">
      <h1 className="heading-1">Dark Mode</h1>
      <p className="body-large max-w-2xl">
        Typography should work beautifully on both light and dark backgrounds.
        This example shows how the fonts render on a dark surface.
      </p>
      <p className="mono-wide">Mono wide uppercase</p>
    </div>
  ),
}
