import type { BentoStatsBlockProps } from '@/blocks/bento-stats-block'
import type { BrandsBlockProps } from '@/blocks/brands-block'
import type { CtaManifestoBlockProps } from '@/blocks/cta-manifesto-block'
import type { FaqBlockProps } from '@/blocks/faq-block'
import type { FeatureCardsBlockProps } from '@/blocks/feature-cards-block'
import type { FormCtaBlockProps } from '@/blocks/form-cta-block'
import type { ImageContentCardsBlockProps } from '@/blocks/image-content-cards-block'
import type { NewsletterBlockProps } from '@/blocks/newsletter-block'
import type { NumberedStepsBlockProps } from '@/blocks/numbered-steps-block'
import type { PeopleGridBlockProps } from '@/blocks/people-grid-block'
import type { PostsGridBlockProps } from '@/blocks/posts-grid-block'
import type { SplitHeroBlockProps } from '@/blocks/split-hero-block'
import type { TaglineMarqueeBlockProps } from '@/blocks/tagline-marquee-block'
import { resolveIcon } from '@/libs/resolve-icon'
import data from './home.json'

/**
 * Homepage content.
 *
 * All copy, images and links live in `home.json` — nothing is hardcoded in the
 * page or block components. This module types that JSON against the block prop
 * interfaces and resolves icon names to Lucide components, so `home-content.tsx`
 * can spread each section straight into its block.
 *
 * Changing content = edit the JSON and redeploy. (SEO/GEO metadata is separate:
 * it lives in Neon and is managed from HQ — see docs/seo-geo-cms-plan.md.)
 */

// JSON widens string literals (e.g. "h2" → string), so each section is asserted
// against the block's own prop type. Icons are strings in JSON, resolved below.
type IconAsName<T> = Omit<T, 'icon'> & { icon: string }

const raw = data as unknown as {
  hero: SplitHeroBlockProps
  brands: BrandsBlockProps
  about: Omit<ImageContentCardsBlockProps, 'cards'> & {
    cards: IconAsName<ImageContentCardsBlockProps['cards'][number]>[]
  }
  taglines: TaglineMarqueeBlockProps
  services: FeatureCardsBlockProps
  process: Omit<NumberedStepsBlockProps, 'steps'> & {
    steps: IconAsName<NumberedStepsBlockProps['steps'][number]>[]
  }
  impact: BentoStatsBlockProps
  articles: PostsGridBlockProps
  newsletter: NewsletterBlockProps
  team: PeopleGridBlockProps
  manifesto: CtaManifestoBlockProps
  faq: FaqBlockProps
  contact: FormCtaBlockProps
}

export const HOME = {
  ...raw,
  about: {
    ...raw.about,
    cards: raw.about.cards.map((card) => ({
      ...card,
      icon: resolveIcon(card.icon),
    })),
  } satisfies ImageContentCardsBlockProps,
  process: {
    ...raw.process,
    steps: raw.process.steps.map((step) => ({
      ...step,
      icon: resolveIcon(step.icon),
    })),
  } satisfies NumberedStepsBlockProps,
}
