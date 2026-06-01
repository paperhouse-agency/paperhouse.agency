'use client'

import dynamic from 'next/dynamic'
import type { LucideIcon } from 'lucide-react'

const AnimatedFlowSteps = dynamic(
  () =>
    import('@/animations/animated-flow-steps').then((m) => m.AnimatedFlowSteps),
  { ssr: false }
)

export interface NumberedStepCard {
  icon: LucideIcon
  number: string
  heading: string
  content: string
  alternate?: boolean
}

export interface NumberedStepsBlockProps {
  preheadingContent?: string
  headingContent: string
  bodyContent: string
  steps: NumberedStepCard[]
}

export function NumberedStepsBlock({
  preheadingContent,
  headingContent,
  bodyContent,
  steps,
}: NumberedStepsBlockProps) {
  return (
    <AnimatedFlowSteps
      preheadingContent={preheadingContent}
      headingContent={headingContent}
      bodyContent={bodyContent}
      steps={steps}
    />
  )
}
