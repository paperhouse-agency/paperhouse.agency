'use client'
import type { BlockSchema } from '@/libs/cms/block-schema'

import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/button'
import * as Accordion from '@/components/accordion'

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqBlockProps {
  preheadingContent?: string
  headingContent?: string
  bodyContent?: string
  ctaLabel?: string
  ctaUrl?: string
  items: FaqItem[]
}

export function FaqBlock({
  preheadingContent = 'KNOWLEDGE BASE',
  headingContent = 'Questions, answered',
  bodyContent = "Can't find what you're looking for? Reach out and we'll get back within a day!",
  ctaLabel = 'Get In Touch',
  ctaUrl = '#contact',
  items,
}: FaqBlockProps) {
  return (
    <section className="py-15 px-5 bg-bluishgray">
      <div className="wrapper mx-auto">
        <div className="grid grid-cols-1 dt:grid-cols-2 gap-15 items-start">
          <div className="flex flex-col gap-5">
            {preheadingContent && (
              <p className="mono-wide text-primary">{preheadingContent}</p>
            )}
            <h2 className="heading-2 text-text">{headingContent}</h2>
            {bodyContent && (
              <p className="body-large text-text/60">{bodyContent}</p>
            )}
            <div>
              <Button color="primary" size="md" url={ctaUrl}>
                {ctaLabel}
              </Button>
            </div>
          </div>

          <Accordion.Group>
            <div className="flex flex-col border-t border-text/20">
              {items.map((item) => (
                <Accordion.Root key={item.question} className="border-b border-text/20">
                  {({ isOpen }) => (
                    <>
                      <Accordion.Button className="flex items-center justify-between w-full py-5 text-left gap-4">
                        <span className="heading-5 text-text">{item.question}</span>
                        <ChevronDown
                          size={20}
                          className={`shrink-0 text-text/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </Accordion.Button>
                      <Accordion.Body className="pb-5">
                        <p className="body text-text/60">{item.answer}</p>
                      </Accordion.Body>
                    </>
                  )}
                </Accordion.Root>
              ))}
            </div>
          </Accordion.Group>
        </div>
      </div>
    </section>
  )
}


export const cmsSchema: BlockSchema = {
  type: 'faq',
  label: 'FAQ',
  icon: 'HelpCircle',
  fields: [
    { key: 'preheadingContent', label: 'Preheading', type: 'text', placeholder: 'KNOWLEDGE BASE' },
    { key: 'headingContent', label: 'Heading', type: 'text', span: 'full', placeholder: 'Questions, answered' },
    { key: 'bodyContent', label: 'Body', type: 'textarea', span: 'full' },
    { key: 'ctaLabel', label: 'CTA Label', type: 'text', placeholder: 'Get In Touch' },
    { key: 'ctaUrl', label: 'CTA URL', type: 'url', placeholder: '/contact' },
    {
      key: 'items',
      label: 'FAQ Items',
      type: 'array',
      span: 'full',
      fields: [
        { key: 'question', label: 'Question', type: 'text', required: true, span: 'full' },
        { key: 'answer', label: 'Answer', type: 'textarea', required: true, span: 'full' },
      ],
    },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'faq',
    preheadingContent: 'KNOWLEDGE BASE',
    headingContent: 'Questions, answered',
    bodyContent: '',
    ctaLabel: 'Get In Touch',
    ctaUrl: '#contact',
    items: [],
  }),
}
