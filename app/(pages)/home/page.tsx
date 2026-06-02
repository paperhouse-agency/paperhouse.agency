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
import { SplitHeroBlock } from '@/blocks/split-hero-block'
import { BrandsBlock } from '@/blocks/brands-block'
import { ImageContentCardsBlock } from '@/blocks/image-content-cards-block'
import { TaglineMarqueeBlock } from '@/blocks/tagline-marquee-block'
import { FeatureCardsBlock } from '@/blocks/feature-cards-block'
import { NumberedStepsBlock } from '@/blocks/numbered-steps-block'
import { BentoStatsBlock } from '@/blocks/bento-stats-block'
import { CardGridBlock } from '@/blocks/card-grid-block'
import { NewsletterBlock } from '@/blocks/newsletter-block'
import { PeopleGridBlock } from '@/blocks/people-grid-block'
import { CtaManifestoBlock } from '@/blocks/cta-manifesto-block'
import { FaqBlock } from '@/blocks/faq-block'
import { FormCtaBlock } from '@/blocks/form-cta-block'
import { Wrapper } from '../(components)/wrapper'

export default function Home() {
  return (
    <Wrapper lenis={{}}>
      {/* 1. Hero */}
      <SplitHeroBlock />

      {/* 2. Brands — trusted-by logos marquee */}
      <BrandsBlock />

      {/* 3. About — image + content + icon cards */}
      <ImageContentCardsBlock
        preheadingContent="ABOUT PAPERHOUSE"
        headingType="h2"
        headingContent="We fold ideas into <span>digital reality.</span>"
        bodyContent="A creative and development studio blending design, code, and storytelling — built to help brands grow in the digital space."
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
            content: 'Your vision, our execution — concept to launch.',
          },
        ]}
        image={{
          src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=690&h=750&fit=crop',
          alt: 'Digital growth and business strategy',
        }}
      />

      {/* 4. Capabilities marquee strip */}
      <TaglineMarqueeBlock />

      {/* 5. Solutions — 3-col service feature cards */}
      <FeatureCardsBlock
        preheadingContent="WHAT WE DO"
        headingContent="Creative services that <span>drive results.</span>"
        bodyContent="From brand identity to scalable digital products — every service is designed to make your business grow."
        cards={[
          {
            label: 'DESIGN',
            heading: 'Brand Identity',
            content:
              'Crafting visual systems and brand experiences that resonate with your audience and stand the test of time.',
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
              'Building scalable, high-performance applications with modern frameworks and clean, maintainable code.',
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
              'From SEO optimization to analytics integration — ensuring your digital presence delivers real business impact.',
            ctaLabel: 'Explore Impact →',
            ctaUrl: '/services/grow',
            image: {
              src: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=413&h=260&fit=crop',
              alt: 'Strategic growth and analytics',
            },
          },
        ]}
      />

      {/* 6. Process — 4-phase flow steps */}
      <NumberedStepsBlock
        preheadingContent="HOW IT WORKS"
        headingContent="Four phases to bring your \n<span>concept to launch</span>"
        bodyContent="From discovery and design to development and deployment. Precision, collaboration, and innovation at every phase."
        steps={[
          {
            icon: Search,
            number: '01',
            heading: 'Insight & Discovery',
            content:
              "We begin by understanding your product's direction. Through research, interviews, and market analysis, we identify opportunities and clarify goals — like unrolling a fresh sheet of paper to reveal possibilities.",
            alternate: true,
          },
          {
            icon: Shuffle,
            number: '02',
            heading: 'Concept & Craft',
            content:
              'Here ideas take structured form. We develop concepts, moodboards, wireframes, and user journeys that shape how the product will look, feel, and function.',
          },
          {
            icon: Code,
            number: '03',
            heading: 'Build & Engineer',
            content:
              'This is where vision becomes working reality. Our engineering team creates scalable, reliable systems with clean code, automation, and thorough testing.',
          },
          {
            icon: Plane,
            number: '04',
            heading: 'Launch & Evolve',
            content:
              'Your product enters the world with confidence. We manage deployment, hosting, optimization, and ongoing updates — monitoring usage and refining based on real data.',
          },
        ]}
      />

      {/* 7. Impact Metrics — bento stats grid */}
      <BentoStatsBlock
        preheadingContent="OUR TRACK RECORD"
        metrics={{
          large: {
            value: '500+',
            heading: 'Creative Works',
            content:
              'Delivered across branding, development, and digital strategy.',
          },
          image1: {
            src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop',
            alt: 'Creative studio workspace',
          },
          medium: {
            value: '95%',
            heading: 'Client Satisfaction Rate',
            content:
              'Measured across every project, from discovery to launch.',
          },
          small: {
            value: '+20%',
            heading: 'Average Revenue Growth',
            content:
              'Seen by clients within 6 months of launching with us.',
          },
          image2: {
            src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop',
            alt: 'Modern conference room',
          },
        }}
      />

      {/* 8. Recent Works — article card grid */}
      <CardGridBlock
        preheadingContent="KNOWLEDGE BASE"
        headingContent="Some of our recent <span>Articles!</span>"
        bodyContent="Insights on design, development, and digital growth — straight from our studio."
        articles={[
          {
            image: {
              src: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=440&h=293&fit=crop',
              alt: 'React performance optimization',
            },
            heading:
              'React Performance Optimization: 5 Patterns That Actually Matter',
            content:
              'Not all performance tips are created equal. We break down the React optimization patterns that deliver real-world improvements — from code splitting to state management.',
            ctaUrl: '/blog/react-performance',
          },
          {
            image: {
              src: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=440&h=293&fit=crop',
              alt: 'UX and design thinking',
            },
            heading:
              'The Hidden Cost of Bad UX: Why Design-First Development Wins',
            content:
              "Poor user experience doesn't just frustrate customers — it bleeds revenue. Learn how integrating design thinking reduces technical debt and creates products users love.",
            ctaUrl: '/blog/design-first-development',
          },
          {
            image: {
              src: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=440&h=293&fit=crop',
              alt: 'Figma to production workflow',
            },
            heading:
              'From Figma to Production: Bridging the Designer-Developer Gap',
            content:
              "Design handoffs shouldn't feel like a game of telephone. Discover the workflows and communication patterns that turn design systems into living codebases.",
            ctaUrl: '/blog/figma-to-production',
          },
        ]}
      />

      {/* 9. Newsletter */}
      <NewsletterBlock />

      {/* 10. Team */}
      <PeopleGridBlock
        preheadingContent="TEAM"
        headingContent="Our Talented <span>Team Members!</span>"
        bodyContent="The people behind the pixels — designers, engineers, and strategists working together."
        members={[
          {
            name: 'Malik Zubayer Ul Haider',
            role: 'Founder, Partner & Tech Lead',
            image: {
              src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
              alt: 'Malik Zubayer Ul Haider',
            },
            ctaUrl: '/team/malik',
          },
          {
            name: 'Team Member',
            role: 'Chief Marketing Officer',
            image: {
              src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
              alt: 'Chief Marketing Officer',
            },
            ctaUrl: '/team/cmo',
          },
          {
            name: 'Team Member',
            role: 'Chief Operating Officer',
            image: {
              src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop',
              alt: 'Chief Operating Officer',
            },
            ctaUrl: '/team/coo',
          },
          {
            name: 'Team Member',
            role: 'Lead Designer',
            image: {
              src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
              alt: 'Lead Designer',
            },
            ctaUrl: '/team/designer',
          },
        ]}
      />

      {/* 11. CTA Manifesto — dark section between team and FAQ */}
      <CtaManifestoBlock />

      {/* 12. FAQ Accordion */}
      <FaqBlock
        items={[
          {
            question: 'What types of projects do you take on?',
            answer:
              'We work across brand identity, web development, SaaS platforms, e-commerce, and digital campaigns. Whether you need a full product build or a focused design sprint, we adapt to your scope.',
          },
          {
            question: 'How long does a typical project take?',
            answer:
              'Most projects range from 4 to 16 weeks depending on scope. A brand identity project typically takes 4–6 weeks, while a full product build can run 3–4 months. We'll give you a clear timeline in the discovery phase.',
          },
          {
            question: 'Do you work with startups or established businesses?',
            answer:
              'Both. We've worked with early-stage startups finding their footing and established companies looking to rebrand or scale. What matters to us is the ambition behind the project.',
          },
          {
            question: 'What does your process look like?',
            answer:
              'We follow four phases: Insight & Discovery, Concept & Craft, Build & Engineer, and Launch & Evolve. Each phase ends with a clear checkpoint so you're always in the loop and in control.',
          },
          {
            question: 'How do I get started?',
            answer:
              "Use the contact form below or book a call directly. We'll schedule a 30-minute discovery call to understand your goals, timeline, and budget — no commitment required.",
          },
        ]}
      />

      {/* 13. Contact */}
      <FormCtaBlock />
    </Wrapper>
  )
}
