export type { FieldDef, BlockSchema } from './block-schema'
export type { BlockSchema as BlockRegistryEntry } from './block-schema'

import { cmsSchema as bentoStats } from '@/blocks/bento-stats-block'
import { cmsSchema as brands } from '@/blocks/brands-block'
import { cmsSchema as cardGrid } from '@/blocks/card-grid-block'
import { cmsSchema as ctaManifesto } from '@/blocks/cta-manifesto-block'
import { cmsSchema as faq } from '@/blocks/faq-block'
import { cmsSchema as featureCards } from '@/blocks/feature-cards-block'
import { cmsSchema as formCta } from '@/blocks/form-cta-block'
import { cmsSchema as imageContentCards } from '@/blocks/image-content-cards-block'
import { cmsSchema as imageTextSplit } from '@/blocks/image-text-split-block'
import { cmsSchema as newsletter } from '@/blocks/newsletter-block'
import { cmsSchema as numberedSteps } from '@/blocks/numbered-steps-block'
import { cmsSchema as peopleGrid } from '@/blocks/people-grid-block'
import { cmsSchema as splitHero } from '@/blocks/split-hero-block'
import { cmsSchema as taglineMarquee } from '@/blocks/tagline-marquee-block'
import { cmsSchema as section } from '@/blocks/section-block'
import type { BlockSchema } from './block-schema'
import type { BlockType } from './types'

export const BLOCK_REGISTRY: BlockSchema[] = [
  bentoStats,
  brands,
  cardGrid,
  ctaManifesto,
  faq,
  featureCards,
  formCta,
  imageContentCards,
  imageTextSplit,
  newsletter,
  numberedSteps,
  peopleGrid,
  splitHero,
  taglineMarquee,
  section,
]

export function getBlockEntry(type: BlockType): BlockSchema | undefined {
  return BLOCK_REGISTRY.find((b) => b.type === type)
}
