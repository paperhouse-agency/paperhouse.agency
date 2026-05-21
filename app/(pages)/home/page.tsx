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
import { NumberedStepsBlock } from '@/blocks/numbered-steps-block'
import { SplitHeroBlock } from '@/blocks/split-hero-block'
import { ImageContentCardsBlock } from '@/blocks/image-content-cards-block'
import { FeatureCardsBlock } from '@/blocks/feature-cards-block'
import { CardGridBlock } from '@/blocks/card-grid-block'
import { ImageTextSplitBlock } from '@/blocks/image-text-split-block'
import { BentoStatsBlock } from '@/blocks/bento-stats-block'
import { FormCtaBlock } from '@/blocks/form-cta-block'
import { Wrapper } from '../(components)/wrapper'

export default function Home() {
  return (
    <Wrapper lenis={{}}>
      <SplitHeroBlock />
      <ImageContentCardsBlock
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
      <FeatureCardsBlock
        headingContent="Three steps for your <span>Digital Growth!</span>"
        bodyContent="Explore our portfolio of exceptional web design and custom websites that drive results for businesses worldwide."
        cards={[
          {
            label: 'DESIGN',
            heading: 'Brand Identity',
            content:
              'Crafting visual systems and brand experiences that resonate with your audience and stand the test of time',
            ctaLabel: 'See Design Process →',
            ctaUrl: '/services/design',
            image: {
              src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=413&h=260&fit=crop',
              alt: 'Brand Identity design work',
            },
          },
          {
            label: 'DEVELOP',
            heading: 'Digital Products',
            content:
              'Building scalable, high-performance applications with modern frameworks and clean, maintainable code',
            ctaLabel: 'View Technologies →',
            ctaUrl: '/services/develop',
            image: {
              src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=413&h=260&fit=crop',
              alt: 'Digital product development',
            },
          },
          {
            label: 'GROW',
            heading: 'Strategic Launch',
            content:
              'From SEO optimization to analytics integration—ensuring your digital presence delivers real business impact',
            ctaLabel: 'Explore Impact →',
            ctaUrl: '/services/grow',
            image: {
              src: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=413&h=260&fit=crop',
              alt: 'Strategic growth and analytics',
            },
          },
        ]}
      />
      <NumberedStepsBlock
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
      <CardGridBlock
        preheadingContent="KNOWLEDGE BASE"
        headingContent="Some of our recent <span>Articles!</span>"
        bodyContent="Explore our portfolio of exceptional web design and custom websites that drive results for businesses worldwide."
        articles={[
          {
            image: {
              src: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=440&h=293&fit=crop',
              alt: 'React performance optimization',
            },
            heading: 'React Performance Optimization: 5 Patterns That Actually Matter',
            content:
              'Not all performance tips are created equal. We break down the React optimization patterns that deliver real-world improvements—from code splitting strategies to state management decisions that scale with your application.',
            ctaUrl: '/blog/react-performance',
          },
          {
            image: {
              src: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=440&h=293&fit=crop',
              alt: 'UX and design thinking',
            },
            heading: 'The Hidden Cost of Bad UX: Why Design-First Development Wins',
            content:
              "Poor user experience doesn't just frustrate customers—it bleeds revenue. Learn how integrating design thinking into your development process reduces technical debt, speeds up iterations, and creates products users actually love.",
            ctaUrl: '/blog/design-first-development',
          },
          {
            image: {
              src: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=440&h=293&fit=crop',
              alt: 'Figma to production workflow',
            },
            heading: 'From Figma to Production: Bridging the Designer-Developer Gap',
            content:
              "Design handoffs shouldn't feel like a game of telephone. Discover the workflows, tools, and communication patterns that turn design systems into living, breathing codebases without losing the vision along the way.",
            ctaUrl: '/blog/figma-to-production',
          },
        ]}
      />
      <ImageTextSplitBlock />
      <BentoStatsBlock
        metrics={{
          large: {
            value: '500+',
            heading: 'Creative Works',
            content: "We begin by uncovering insights that shape your product's direction.",
          },
          image1: {
            src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop',
            alt: 'Creative studio workspace',
          },
          medium: {
            value: '95%',
            heading: 'Client Satisfaction Rate',
            content: "We begin by uncovering insights that shape your product's direction.",
          },
          small: {
            value: '+20%',
            heading: 'Average Revenue Growth',
            content: "We begin by uncovering insights that shape your product's direction.",
          },
          image2: {
            src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop',
            alt: 'Modern conference room',
          },
        }}
      />
      <FormCtaBlock />
    </Wrapper>
  )
}
