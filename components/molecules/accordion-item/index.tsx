'use client'

import { ChevronDown } from 'lucide-react'
import * as Accordion from '@/components/accordion'

export interface AccordionItemProps {
  question: string
  answer: string
}

export function AccordionItem({ question, answer }: AccordionItemProps) {
  return (
    <Accordion.Root className="border-b border-text/20">
      {({ isOpen }) => (
        <>
          <Accordion.Button className="flex items-center justify-between w-full py-5 text-left gap-4">
            <span className="heading-5 text-text">{question}</span>
            <ChevronDown
              size={20}
              className={`shrink-0 text-text/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </Accordion.Button>
          <Accordion.Body className="pb-5">
            <p className="body text-text/60">{answer}</p>
          </Accordion.Body>
        </>
      )}
    </Accordion.Root>
  )
}
