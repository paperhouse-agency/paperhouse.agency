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
    { key: 'preheadingContent', label: 'Preheading', type: 'text', placeholder: 'HOW WE WORK' },
    { key: 'headingContent', label: 'Heading', type: 'text', required: true, span: 'full' },
    { key: 'bodyContent', label: 'Body', type: 'textarea', required: true, span: 'full' },
    {
      key: 'steps',
      label: 'Steps',
      type: 'array',
      span: 'full',
      fields: [
        { key: 'number', label: 'Step Number', type: 'text', required: true, placeholder: '01' },
        { key: 'icon', label: 'Icon', type: 'icon', required: true, placeholder: 'Zap', description: 'Lucide icon name' },
        { key: 'heading', label: 'Heading', type: 'text', required: true, span: 'full' },
        { key: 'content', label: 'Description', type: 'textarea', span: 'full' },
        { key: 'alternate', label: 'Alternate style', type: 'boolean' },
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
