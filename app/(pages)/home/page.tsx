'use client'

import {
  Code,
  Crosshair,
  Handshake,
  Lightbulb,
  Plane,
  Search,
  Shuffle,
} from 'lucide-react'
import { FlowStepsBlock } from '@/blocks/flow-steps-block'
import { HeroVideoBlock } from '@/blocks/hero-video-block'
import { ImageContentWithCards } from '@/blocks/image-content-with-cards'
import { Wrapper } from '../(components)/wrapper'

export default function Home() {
  return (
    <Wrapper lenis={{}}>
      <HeroVideoBlock />
      <ImageContentWithCards
        preheadingContent="ABOUT PAPERHOUSE"
        headingType="h2"
        headingContent="Three steps for your <span>Digital Growth!</span>"
        bodyContent="Explore our portfolio of exceptional web design and custom websites that drive results for businesses worldwide."
        buttons={[
          {
            label: 'Know Us More',
            size: 'sm',
          },
        ]}
        cards={[
          {
            icon: Lightbulb,
            heading: 'Innovation',
            content: 'Breaking boundaries with creative solutions.',
          },
          {
            icon: Crosshair,
            heading: 'Precision',
            content: 'Pixel-perfect designs and flawlessly scalable code.',
          },
          {
            icon: Handshake,
            heading: 'Partnership',
            content: 'Your vision, our execution—concept to launch.',
          },
        ]}
        image={{
          src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=690&h=750&fit=crop',
          alt: 'Digital growth and business strategy',
        }}
      />
      <FlowStepsBlock
        preheadingContent="HOW IT WORKS"
        headingContent="Four phases to bring your \n<span>concept to launch</span>"
        bodyContent="From discovery and design to development and deployment. Precision, collaboration, and innovation at every phase. We transform your ideas through a proven process."
        steps={[
          {
            icon: Search,
            number: '01',
            heading: 'Insight & Discovery',
            content:
              "We begin by understanding your product's direction. Through research, interviews, and market analysis, we identify opportunities, clarify goals, and build a shared understanding that lays the foundation for everything ahead—like unrolling a fresh sheet of paper to reveal possibilities within your idea.",
            alternate: true,
          },
          {
            icon: Shuffle,
            number: '02',
            heading: 'Concept & Craft',
            content:
              'Here, ideas begin to take structured form. We develop concepts, moodboards, wireframes, and user journeys that shape how the product will look, feel, and function. Every fold adds detail and intention, turning raw insights into a refined creative blueprint ready for a seamless transition into engineering.',
          },
          {
            icon: Code,
            number: '03',
            heading: 'Build & Engineer',
            content:
              'This is where vision becomes working reality. Our engineering team creates scalable, reliable systems with clean code, automation, and thorough testing. Features are shaped carefully—much like origami— ensuring stability, performance, and long-term resilience. Crafted with excellence.',
          },
          {
            icon: Plane,
            number: '04',
            heading: 'Launch & Evolve',
            content:
              'Your product enters the world with confidence. We manage deployment, hosting, optimization, and ongoing updates. After launch, we monitor usage, adapt quickly, and refine the experience based on real data. Like releasing a finely folded paper plane, this phase ensures growth, and continuous improvement.',
          },
        ]}
      />
    </Wrapper>
  )
}
