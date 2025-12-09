'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'
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
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(
    () => {
      if (
        !(sectionRef.current && lineRef.current) ||
        cardsRef.current.length === 0
      )
        return

      // Set initial states - all cards hidden
      gsap.set(cardsRef.current, {
        opacity: 0,
        x: 50,
      })

      gsap.set(lineRef.current, {
        scaleX: 0.2,
        transformOrigin: 'left center',
      })

      // Create master timeline with pinning
      // Each step gets 150% viewport height of scroll distance
      const scrollDistance = steps.length * 120

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${scrollDistance}%`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          // markers: process.env.NODE_ENV === 'development',
          id: 'flow-steps',
          onUpdate: (self) => {
            // Update active index based on scroll progress
            const newIndex = Math.min(
              Math.floor(self.progress * steps.length),
              steps.length - 1
            )
            setActiveIndex(newIndex)
          },
        },
      })

      // Animate first card immediately when section is pinned
      tl.to(
        cardsRef.current[0],
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        0
      )

      // Animate remaining cards with staggered timing
      for (let i = 1; i < steps.length; i++) {
        const startProgress = i / steps.length

        // Fade in card
        tl.to(
          cardsRef.current[i],
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          startProgress
        )

        // Grow line by 20% (0.2 base + 0.2 per card)
        tl.to(
          lineRef.current,
          {
            scaleX: 0.2 + (i + 1) * 0.2,
            duration: 0.3,
            ease: 'power2.inOut',
          },
          startProgress
        )
      }
    },
    { scope: sectionRef, dependencies: [steps.length] }
  )

  return (
    <div ref={sectionRef} className="relative h-screen w-full bg-offwhite">
      <div className="wrapper mx-auto w-full px-5 h-full flex flex-col justify-center gap-10">
        {/* Top Section: Introduction */}
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
                  alternate={index === activeIndex}
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
