import type { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta = {
  title: 'Design System/Colors',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj

const ColorSwatch = ({
  name,
  value,
  className,
}: {
  name: string
  value: string
  className: string
}) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className={`w-32 h-32 rounded-lg ${className} border border-gray-200`}
    />
    <div className="text-center">
      <p className="body-small font-medium">{name}</p>
      <p className="mono text-xs text-gray-500">{value}</p>
    </div>
  </div>
)

const ColorPalette = () => {
  return (
    <div className="p-8 space-y-12">
      {/* Brand Colors */}
      <section>
        <h2 className="heading-4 mb-6">Brand Colors</h2>
        <div className="grid grid-cols-3 gap-8">
          <ColorSwatch name="Primary" value="#FF4D00" className="bg-primary" />
          <ColorSwatch
            name="Secondary"
            value="#4B749F"
            className="bg-secondary"
          />
          <ColorSwatch name="Accent" value="#FA971A" className="bg-accent" />
        </div>
      </section>

      {/* Background Colors */}
      <section>
        <h2 className="heading-4 mb-6">Background Colors</h2>
        <div className="grid grid-cols-3 gap-8">
          <ColorSwatch
            name="Off White"
            value="#F9F7F4"
            className="bg-offwhite"
          />
          <ColorSwatch
            name="Bluish Gray"
            value="#E8EBEF"
            className="bg-bluishgray"
          />
          <ColorSwatch
            name="Foreground"
            value="#F9F7F4"
            className="bg-foreground"
          />
        </div>
      </section>

      {/* Base Colors */}
      <section>
        <h2 className="heading-4 mb-6">Base Colors</h2>
        <div className="grid grid-cols-3 gap-8">
          <ColorSwatch name="White" value="#FFFFFF" className="bg-white" />
          <ColorSwatch name="Black" value="#000000" className="bg-black" />
          <ColorSwatch name="Text" value="#000000" className="bg-text" />
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="heading-4 mb-6">Usage Examples</h2>
        <div className="space-y-4">
          <div className="bg-offwhite p-6 rounded-lg">
            <h3 className="heading-5 text-text mb-2">Off White Background</h3>
            <p className="body text-text">
              This is the main background color for the site.
            </p>
          </div>
          <div className="bg-bluishgray p-6 rounded-lg">
            <h3 className="heading-5 text-text mb-2">Bluish Gray Background</h3>
            <p className="body text-text">
              Used for cards, sections, and alternate backgrounds.
            </p>
          </div>
          <div className="bg-primary p-6 rounded-lg">
            <h3 className="heading-5 text-white mb-2">Primary Accent</h3>
            <p className="body text-white">
              Primary brand color for buttons and key elements.
            </p>
          </div>
          <div className="bg-secondary p-6 rounded-lg">
            <h3 className="heading-5 text-white mb-2">Secondary Accent</h3>
            <p className="body text-white">
              Secondary brand color for supporting elements.
            </p>
          </div>
          <div className="bg-accent p-6 rounded-lg">
            <h3 className="heading-5 text-white mb-2">Accent Color</h3>
            <p className="body text-white">
              Accent color for highlights and calls-to-action.
            </p>
          </div>
        </div>
      </section>

      {/* Tailwind Classes */}
      <section>
        <h2 className="heading-4 mb-6">Tailwind CSS Classes</h2>
        <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm space-y-2">
          <p>
            <span className="text-gray-500">{'//'} Background:</span>
          </p>
          <p>bg-primary, bg-secondary, bg-accent</p>
          <p>bg-offwhite, bg-bluishgray, bg-foreground</p>
          <p>bg-white, bg-black, bg-text</p>
          <br />
          <p>
            <span className="text-gray-500">{'//'} Text:</span>
          </p>
          <p>text-primary, text-secondary, text-accent</p>
          <p>text-white, text-black, text-text</p>
          <br />
          <p>
            <span className="text-gray-500">{'//'} Border:</span>
          </p>
          <p>border-primary, border-secondary, border-accent</p>
        </div>
      </section>
    </div>
  )
}

export const AllColors: Story = {
  render: () => <ColorPalette />,
}

export const BrandColors: Story = {
  render: () => (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-8">
        <ColorSwatch name="Primary" value="#FF4D00" className="bg-primary" />
        <ColorSwatch
          name="Secondary"
          value="#4B749F"
          className="bg-secondary"
        />
        <ColorSwatch name="Accent" value="#FA971A" className="bg-accent" />
      </div>
    </div>
  ),
}

export const BackgroundColors: Story = {
  render: () => (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-8">
        <ColorSwatch name="Off White" value="#F9F7F4" className="bg-offwhite" />
        <ColorSwatch
          name="Bluish Gray"
          value="#E8EBEF"
          className="bg-bluishgray"
        />
        <ColorSwatch
          name="Foreground"
          value="#F9F7F4"
          className="bg-foreground"
        />
      </div>
    </div>
  ),
}
