import type { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta = {
  title: 'Design System/Spacing',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
}

export default meta
type Story = StoryObj

const spacingTokens = [
  { name: 'gap-2.5 / p-2.5', value: '10px', tailwind: 'gap-2.5', px: 10, usage: 'Tight element gaps (heading + body, card internals)' },
  { name: 'gap-5 / p-5', value: '20px', tailwind: 'p-5', px: 20, usage: 'Card padding (small), grid gaps, section horizontal padding' },
  { name: 'gap-8 / py-8', value: '32px', tailwind: 'py-8', px: 32, usage: 'Section padding (small variant)' },
  { name: 'gap-10 / p-10', value: '40px', tailwind: 'p-10', px: 40, usage: 'Section content padding, card padding (large)' },
  { name: 'gap-15 / py-15', value: '60px', tailwind: 'py-15', px: 60, usage: 'Standard section vertical rhythm, mb-15 between header and grid' },
  { name: 'py-20', value: '80px', tailwind: 'py-20', px: 80, usage: 'Larger section vertical padding' },
  { name: 'py-24', value: '96px', tailwind: 'py-24', px: 96, usage: 'Section padding (large variant)' },
]

export const AllSpacing: Story = {
  render: () => (
    <div className="p-8 space-y-4">
      <h2 className="heading-4 text-text mb-8">Spacing System — 4px base scale</h2>
      {spacingTokens.map((token) => (
        <div key={token.name} className="flex items-center gap-6">
          <div className="w-48 shrink-0">
            <p className="mono text-text font-medium">{token.tailwind}</p>
            <p className="body-small text-text/60">{token.value}</p>
          </div>
          <div
            className="bg-primary/20 border border-primary/40 rounded"
            style={{ width: token.px, height: 32, minWidth: token.px }}
          />
          <p className="body-small text-text/60 flex-1">{token.usage}</p>
        </div>
      ))}
    </div>
  ),
}

export const SectionAnatomy: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <h2 className="heading-4 text-text mb-4">Section Anatomy</h2>
      <p className="body text-text/60 mb-8">
        Every page section uses <code className="mono bg-bluishgray px-1 rounded">py-15 px-5</code> with a{' '}
        <code className="mono bg-bluishgray px-1 rounded">wrapper mx-auto</code> inside.
      </p>
      <div className="border-2 border-dashed border-secondary/40 rounded-lg p-2">
        <p className="mono-wide text-secondary text-center mb-2">section · py-15 px-5</p>
        <div className="border-2 border-dashed border-primary/40 rounded-lg p-2 max-w-[800px] mx-auto">
          <p className="mono-wide text-primary text-center mb-4">wrapper mx-auto · max-w-1440px</p>
          <div className="bg-bluishgray rounded-lg p-6 text-center">
            <p className="body text-text/60">Content lives here</p>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const GridGaps: Story = {
  render: () => (
    <div className="p-8 space-y-12">
      <div>
        <p className="mono-wide text-primary mb-4">gap-5 — 20px (card grids)</p>
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bluishgray rounded-lg p-6 text-center">
              <p className="body text-text/60">Card {i}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mono-wide text-primary mb-4">gap-10 — 40px (section content)</p>
        <div className="grid grid-cols-2 gap-10">
          {[1, 2].map((i) => (
            <div key={i} className="bg-bluishgray rounded-lg p-6 text-center">
              <p className="body text-text/60">Column {i}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mono-wide text-primary mb-4">gap-15 — 60px (section layout)</p>
        <div className="grid grid-cols-2 gap-15">
          {[1, 2].map((i) => (
            <div key={i} className="bg-bluishgray rounded-lg p-6 text-center">
              <p className="body text-text/60">Column {i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}
