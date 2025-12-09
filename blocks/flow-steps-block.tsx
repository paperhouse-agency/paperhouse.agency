import type { LucideIcon } from 'lucide-react'
import { ContentWithButton } from '@/components/content-with-button'
import { IconContentCard } from '@/components/icon-content-card'

export interface FlowStepCard {
  icon: LucideIcon
  number: string
  heading: string
  content: string
  alternate?: boolean
}

export interface FlowStepsBlockProps {
  preheadingContent?: string
  headingContent: string
  bodyContent: string
  steps: FlowStepCard[]
}

export function FlowStepsBlock({
  preheadingContent,
  headingContent,
  bodyContent,
  steps,
}: FlowStepsBlockProps) {
  return (
    <section className="py-15 px-5 bg-offwhite">
      <div className="wrapper mx-auto flex flex-col gap-10">
        {/* Top Section: Content Left, Body Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
          {/* Left: Preheading + Heading */}
          <ContentWithButton
            preheadingContent={preheadingContent}
            headingType="h2"
            headingContent={headingContent}
          />

          {/* Right: Body Content */}
          <div className="flex items-start">
            <p className="body-large text-text/60 pb-2">{bodyContent}</p>
          </div>
        </div>

        {/* Bottom Section: Flow Steps with Connecting Line */}
        <div className="relative">
          {/* Horizontal Connecting Line - Desktop only */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-text -translate-y-1/2 z-0" />

          {/* Vertical Connecting Line - Mobile only */}
          <div className="md:hidden absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-text z-0" />

          {/* Steps Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-5 z-10">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <IconContentCard
                  icon={step.icon}
                  heading={`${step.number}. ${step.heading}`}
                  content={step.content}
                  alternate={step.alternate}
                  headingClassName="mt-3.5"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
