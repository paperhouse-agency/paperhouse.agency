'use client'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'

const meta: Meta = {
  title: 'Design System/Animations & Easings',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
}

export default meta
type Story = StoryObj

const easings = [
  {
    name: 'gleasing',
    css: 'cubic-bezier(0.4, 0, 0, 1)',
    usage: 'Preferred for UI transitions',
    var: '--ease-gleasing',
  },
  {
    name: 'out-quint',
    css: 'cubic-bezier(0.23, 1, 0.32, 1)',
    usage: 'Smooth exits',
    var: '--ease-out-quint',
  },
  {
    name: 'out-expo',
    css: 'cubic-bezier(0.19, 1, 0.22, 1)',
    usage: 'Fast exits',
    var: '--ease-out-expo',
  },
  {
    name: 'in-out-quart',
    css: 'cubic-bezier(0.77, 0, 0.175, 1)',
    usage: 'Bidirectional transitions',
    var: '--ease-in-out-quart',
  },
]

function EasingDemo({ easing }: { easing: (typeof easings)[0] }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className="bg-white rounded-lg shadow-[4px_4px_5px_rgba(0,0,0,0.05)] p-6 cursor-pointer"
      onClick={() => {
        setPlaying(false)
        requestAnimationFrame(() => setPlaying(true))
      }}
    >
      <p className="mono text-text font-medium mb-1">{easing.name}</p>
      <p className="body-small text-text/60 mb-1">{easing.css}</p>
      <p className="body-small text-primary mb-5">{easing.usage}</p>

      <div className="relative h-3 bg-bluishgray rounded-full overflow-hidden">
        <div
          key={String(playing)}
          className="absolute left-0 top-0 h-full w-10 bg-primary rounded-full"
          style={{
            animation: playing
              ? `slideAcross 800ms ${easing.css} forwards`
              : 'none',
          }}
        />
      </div>
      <p className="body-small text-text/40 mt-3">Click to replay</p>
    </div>
  )
}

export const EasingCurves: Story = {
  render: () => (
    <div className="p-8">
      <style>{`
        @keyframes slideAcross {
          from { transform: translateX(0); }
          to { transform: translateX(calc(var(--bar-width, 300px) - 40px)); }
        }
      `}</style>
      <h2 className="heading-4 text-text mb-2">Named Easings</h2>
      <p className="body text-text/60 mb-8">
        Available as CSS variables (<code className="mono bg-bluishgray px-1 rounded">--ease-*</code>
        ) and in <code className="mono bg-bluishgray px-1 rounded">styles/easings.ts</code> for GSAP.
        Standard transition duration is <code className="mono bg-bluishgray px-1 rounded">duration-500</code>.
      </p>
      <div className="grid grid-cols-2 gap-5">
        {easings.map((e) => (
          <EasingDemo key={e.name} easing={e} />
        ))}
      </div>
    </div>
  ),
}

export const TransitionPatterns: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <h2 className="heading-4 text-text mb-6">Common Transition Patterns</h2>

      <div className="space-y-4">
        <p className="mono-wide text-primary">Color transitions</p>
        <div className="flex gap-5 flex-wrap">
          <div className="group bg-white border border-text/60 rounded-lg p-5 cursor-pointer hover:border-primary hover:shadow-[0_4px_24px_0px_color-mix(in_srgb,#ff4d00_20%,transparent)] transition-all duration-300">
            <p className="body text-text group-hover:text-primary transition-colors duration-300">
              Icon card hover
            </p>
            <p className="body-small text-text/60 mt-1">transition-all duration-300</p>
          </div>
          <div className="group bg-primary text-offwhite rounded-lg p-5 cursor-pointer hover:opacity-90 transition-opacity duration-500">
            <p className="body text-offwhite">Button hover opacity</p>
            <p className="body-small text-offwhite/70 mt-1">transition-opacity duration-500</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="mono-wide text-primary">Scale transitions</p>
        <div className="flex gap-5 flex-wrap">
          <div className="group bg-white border border-text/60 rounded-lg p-5 cursor-pointer hover:scale-[1.03] transition-all duration-300">
            <p className="body text-text">Card scale on hover</p>
            <p className="body-small text-text/60 mt-1">hover:scale-[1.03] duration-300</p>
          </div>
        </div>
      </div>
    </div>
  ),
}
