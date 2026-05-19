'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import type { FlowStepCard } from '@/blocks/flow-steps-block'
import { ContentWithButton } from '@/components/content-with-button'
import { IconContentCard } from '@/components/icon-content-card'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedFlowStepsProps {
  preheadingContent?: string
  headingContent: string
  bodyContent: string
  steps: FlowStepCard[]
}

export function AnimatedFlowSteps({
  preheadingContent,
  headingContent,
  bodyContent,
  steps,
}: AnimatedFlowStepsProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useGSAP(
    () => {
      if (
        !(sectionRef.current && lineRef.current) ||
        cardsRef.current.length === 0
      )
        return

      gsap.set(cardsRef.current, { opacity: 0, y: 16 })
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      for (let i = 0; i < steps.length; i++) {
        const cardProgress = (i + 1) / steps.length

        tl.to(
          cardsRef.current[i],
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          i === 0 ? 0 : '>-0.2'
        )

        tl.to(
          lineRef.current,
          { scaleX: cardProgress, duration: 0.4, ease: 'power1.inOut' },
          '<'
        )
      }
    },
    { scope: sectionRef, dependencies: [steps.length] }
  )

  return (
    <div ref={sectionRef} className="relative w-full bg-offwhite">
      <div className="wrapper mx-auto w-full px-5 py-20 flex flex-col gap-10">
        {/* Top Section: Introduction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
          <ContentWithButton
            preheadingContent={preheadingContent}
            headingType="h2"
            headingContent={headingContent}
          />
          <div className="flex items-start">
            <p className="body-large text-text/60 pb-2">{bodyContent}</p>
          </div>
        </div>

        {/* Horizontal Connecting Line */}
        <div className="relative">
          <div
            ref={lineRef}
            className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-text -translate-y-1/2 z-0"
          />

          {/* Steps Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-5 z-10">
            {steps.map((step, index) => (
              <div
                key={step.number}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
              >
                <IconContentCard
                  icon={step.icon}
                  heading={`${step.number}. ${step.heading}`}
                  content={step.content}
                  headingClassName="mt-3.5"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
