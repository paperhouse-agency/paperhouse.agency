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
      })

      gsap.set(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      })

      // Calculate actual dimensions
      const gridContainer = cardsRef.current[0]?.parentElement?.parentElement
      if (!gridContainer) return

      const containerWidth = gridContainer.offsetWidth
      const gapSize = 20 // 20px gap between cards
      const totalGaps = (steps.length - 1) * gapSize // 3 gaps for 4 cards = 60px
      const totalCardsWidth = containerWidth - totalGaps
      const cardWidth = totalCardsWidth / steps.length

      // Calculate scale values for each card position
      const getCardEndScale = (index: number) => {
        // Card width * number of cards + gaps before this card
        const width = cardWidth * (index + 1) + gapSize * index
        return width / containerWidth
      }

      const getGapEndScale = (index: number) => {
        // Add one gap width to the card end position
        const width = cardWidth * (index + 1) + gapSize * (index + 1)
        return width / containerWidth
      }

      // Create master timeline with pinning
      // Each step gets 120% viewport height of scroll distance
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

      // Animate first card
      tl.to(cardsRef.current[0], {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      })

      // Line jumps to first card end, then animates gap
      tl.to(
        lineRef.current,
        {
          scaleX: getCardEndScale(0),
          duration: 0.05,
          ease: 'none',
        },
        '>'
      )

      tl.to(lineRef.current, {
        scaleX: getGapEndScale(0),
        duration: 0.15,
        ease: 'power1.inOut',
      })

      // Animate remaining cards
      for (let i = 1; i < steps.length; i++) {
        // Fade in card
        tl.to(cardsRef.current[i], {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        })

        // Line instantly jumps to this card's end
        tl.to(
          lineRef.current,
          {
            scaleX: getCardEndScale(i),
            duration: 0.05,
            ease: 'none',
          },
          '>'
        )

        // Then animate the gap (only if not the last card)
        if (i < steps.length - 1) {
          tl.to(lineRef.current, {
            scaleX: getGapEndScale(i),
            duration: 0.15,
            ease: 'power1.inOut',
          })
        }
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
