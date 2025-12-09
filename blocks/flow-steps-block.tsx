'use client'

import type { LucideIcon } from 'lucide-react'
import { AnimatedFlowSteps } from '@/animations/animated-flow-steps'

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
    <AnimatedFlowSteps
      preheadingContent={preheadingContent}
      headingContent={headingContent}
      bodyContent={bodyContent}
      steps={steps}
    />
  )
}
