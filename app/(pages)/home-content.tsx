'use client'

import { BentoStatsBlock } from '@/blocks/bento-stats-block'
import { BrandsBlock } from '@/blocks/brands-block'
import { CtaManifestoBlock } from '@/blocks/cta-manifesto-block'
import { FaqBlock } from '@/blocks/faq-block'
import { FeatureCardsBlock } from '@/blocks/feature-cards-block'
import { FormCtaBlock } from '@/blocks/form-cta-block'
import { ImageContentCardsBlock } from '@/blocks/image-content-cards-block'
import { NewsletterBlock } from '@/blocks/newsletter-block'
import { NumberedStepsBlock } from '@/blocks/numbered-steps-block'
import { PeopleGridBlock } from '@/blocks/people-grid-block'
import { PostsGridBlock } from '@/blocks/posts-grid-block'
import { SplitHeroBlock } from '@/blocks/split-hero-block'
import { TaglineMarqueeBlock } from '@/blocks/tagline-marquee-block'
import { HOME } from '@/content/home'
import { Wrapper } from './(components)/wrapper'

export function HomeContent() {
  return (
    <Wrapper lenis={{}}>
      {/* 1. Hero */}
      <SplitHeroBlock {...HOME.hero} />

      {/* 2. Brands — trusted-by logos marquee */}
      <BrandsBlock {...HOME.brands} />

      {/* 3. About — image + content + icon cards */}
      <ImageContentCardsBlock {...HOME.about} />

      {/* 4. Capabilities marquee strip */}
      <TaglineMarqueeBlock {...HOME.taglines} />

      {/* 5. Solutions — 3-col service feature cards */}
      <FeatureCardsBlock {...HOME.services} />

      {/* 6. Process — 4-phase flow steps */}
      <NumberedStepsBlock {...HOME.process} />

      {/* 7. Impact Metrics — bento stats grid */}
      <BentoStatsBlock {...HOME.impact} />

      {/* 8. Recent Works — paginated posts grid */}
      <PostsGridBlock {...HOME.articles} />

      {/* 9. Newsletter */}
      <NewsletterBlock {...HOME.newsletter} />

      {/* 10. Team */}
      <PeopleGridBlock {...HOME.team} />

      {/* 11. CTA Manifesto — dark section between team and FAQ */}
      <CtaManifestoBlock {...HOME.manifesto} />

      {/* 12. FAQ Accordion */}
      <FaqBlock {...HOME.faq} />

      {/* 13. Contact */}
      <FormCtaBlock {...HOME.contact} />
    </Wrapper>
  )
}
