'use client'
import type { BlockSchema } from '@/libs/cms/block-schema'

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


export const cmsSchema: BlockSchema = {
  type: 'numbered-steps',
  label: 'Numbered Steps',
  icon: 'ListOrdered',
  fields: [
    { key: 'preheadingContent', label: 'Preheading', type: 'text' },
    { key: 'headingContent', label: 'Heading', type: 'text', required: true },
    { key: 'bodyContent', label: 'Body', type: 'textarea', required: true },
    {
      key: 'steps',
      label: 'Steps',
      type: 'array',
      fields: [
        { key: 'icon', label: 'Icon', type: 'icon', required: true },
        { key: 'number', label: 'Number', type: 'text', required: true },
        { key: 'heading', label: 'Heading', type: 'text', required: true },
        { key: 'content', label: 'Content', type: 'textarea' },
        { key: 'alternate', label: 'Alternate Style', type: 'boolean' },
      ],
    },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'numbered-steps',
    preheadingContent: '',
    headingContent: '',
    bodyContent: '',
    steps: [],
  }),
}
