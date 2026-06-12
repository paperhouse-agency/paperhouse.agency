import type { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta = {
  title: 'Design System/Shadows & Borders',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
}

export default meta
type Story = StoryObj

export const CardShadow: Story = {
  render: () => (
    <div className="p-12 space-y-12">
      <div>
        <p className="mono-wide text-primary mb-6">Card Shadow</p>
        <p className="mono text-text/60 mb-8">shadow-[4px_4px_5px_rgba(0,0,0,0.05)]</p>
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-[4px_4px_5px_rgba(0,0,0,0.05)] p-6">
            <p className="heading-5 text-text mb-2">Card on Off-White</p>
            <p className="body-small text-text/60">
              White card surface on the offwhite page background. The shadow lifts the card.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-[4px_4px_5px_rgba(0,0,0,0.05)] p-6">
            <p className="heading-5 text-text mb-2">Standard Feature Card</p>
            <p className="body-small text-text/60">
              Used in solutions and feature card grids.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-[4px_4px_5px_rgba(0,0,0,0.05)] p-6">
            <p className="heading-5 text-text mb-2">Article Card</p>
            <p className="body-small text-text/60">
              Used in recent works and card grid sections.
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="mono-wide text-primary mb-6">No Shadow (use for non-card surfaces)</p>
        <div className="bg-bluishgray rounded-lg p-6 max-w-sm">
          <p className="heading-5 text-text mb-2">Bluish Gray Section</p>
          <p className="body-small text-text/60">Section backgrounds — no shadow needed.</p>
        </div>
      </div>

      <div className="bg-bluishgray p-8 rounded-lg">
        <p className="mono-wide text-primary mb-6">Cards on Bluish Gray</p>
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-lg shadow-[4px_4px_5px_rgba(0,0,0,0.05)] p-6">
            <p className="heading-5 text-text mb-2">Card on bluishgray</p>
            <p className="body-small text-text/60">Shadow still applies on alternate bg.</p>
          </div>
          <div className="bg-white rounded-lg shadow-[4px_4px_5px_rgba(0,0,0,0.05)] p-6">
            <p className="heading-5 text-text mb-2">Card on bluishgray</p>
            <p className="body-small text-text/60">Consistent shadow across all contexts.</p>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const BorderRadius: Story = {
  render: () => (
    <div className="p-8 space-y-10">
      <h2 className="heading-4 text-text mb-6">Border Radius Tokens</h2>
      <div className="flex flex-wrap items-end gap-10">
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 bg-primary rounded flex items-center justify-center">
            <span className="body-small text-offwhite font-medium">4px</span>
          </div>
          <p className="mono text-text">rounded</p>
          <p className="body-small text-text/60">Small inline elements</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center">
            <span className="body-small text-offwhite font-medium">8px</span>
          </div>
          <p className="mono text-text">rounded-lg</p>
          <p className="body-small text-text/60">Cards, images, UI</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 bg-accent rounded-[12px] flex items-center justify-center">
            <span className="body-small text-offwhite font-medium">12px</span>
          </div>
          <p className="mono text-text">rounded-[12px]</p>
          <p className="body-small text-text/60">Large containers</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
            <span className="body-small text-offwhite font-medium">full</span>
          </div>
          <p className="mono text-text">rounded-full</p>
          <p className="body-small text-text/60">Buttons, pills, icons</p>
        </div>
      </div>
    </div>
  ),
}

export const BorderStyles: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <h2 className="heading-4 text-text mb-6">Border Patterns</h2>
      <div className="space-y-6">
        <div className="border border-text/10 rounded-lg p-5">
          <p className="mono text-text mb-1">border-text/10</p>
          <p className="body-small text-text/60">Subtle dividers, marquee borders</p>
        </div>
        <div className="border border-text/60 rounded-lg p-5">
          <p className="mono text-text mb-1">border-text/60</p>
          <p className="body-small text-text/60">Icon cards, form inputs</p>
        </div>
        <div className="border-2 border-primary rounded-lg p-5">
          <p className="mono text-text mb-1">border-2 border-primary</p>
          <p className="body-small text-text/60">Outline button — primary</p>
        </div>
        <div className="border-2 border-bluishgray rounded-lg p-5">
          <p className="mono text-text mb-1">border-2 border-bluishgray</p>
          <p className="body-small text-text/60">Outline button — neutral</p>
        </div>
        <div className="border border-text rounded-full px-4 py-2 inline-flex">
          <p className="body-small text-text">border border-text · rounded-full</p>
        </div>
        <p className="body-small text-text/60 mt-2">Pill CTA links (custom inline style)</p>
      </div>
    </div>
  ),
}
