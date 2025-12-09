'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { IconContentCard } from '@/components/icon-content-card'
import type { CardData } from './image-content-with-cards'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedCardsGridProps {
  cards: CardData[]
}

export function AnimatedCardsGrid({ cards }: AnimatedCardsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useGSAP(
    () => {
      if (!gridRef.current || cardsRef.current.length === 0) return

      // Set initial state
      gsap.set(cardsRef.current, {
        opacity: 0,
        x: 50,
      })

      // Create timeline with ScrollTrigger
      gsap
        .timeline({
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
            markers: process.env.NODE_ENV === 'development',
          },
        })
        .to(cardsRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
        })
    },
    { scope: gridRef, dependencies: [cards.length] }
  )

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, index) => (
        <div
          key={card.heading}
          ref={(el) => {
            if (el) cardsRef.current[index] = el
          }}
        >
          <IconContentCard
            icon={card.icon}
            heading={card.heading}
            content={card.content}
            alternate={card.alternate}
          />
        </div>
      ))}
    </div>
  )
}
