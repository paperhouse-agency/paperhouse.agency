'use client'

import { BentoStatsBlock } from '@/blocks/bento-stats-block'
import { CardGridBlock } from '@/blocks/card-grid-block'
import { FeatureCardsBlock } from '@/blocks/feature-cards-block'
import { FormCtaBlock } from '@/blocks/form-cta-block'
import { ImageContentCardsBlock } from '@/blocks/image-content-cards-block'
import { NewsletterBlock } from '@/blocks/newsletter-block'
import { NumberedStepsBlock } from '@/blocks/numbered-steps-block'
import { PeopleGridBlock } from '@/blocks/people-grid-block'
import { resolveIcon } from './resolve-icon'
import type { BlockData } from './types'

export function BlockRenderer({ blocks }: { blocks: BlockData[] }) {
  return (
    <>
      {blocks.map((b) => (
        <BlockItem key={b._id} block={b} />
      ))}
    </>
  )
}

function BlockItem({ block }: { block: BlockData }) {
  switch (block._type) {
    case 'bento-stats':
      return <BentoStatsBlock {...block} />
    case 'card-grid':
      return <CardGridBlock {...block} />
    case 'feature-cards':
      return <FeatureCardsBlock {...block} />
    case 'form-cta':
      return <FormCtaBlock {...block} />
    case 'image-content-cards':
      return (
        <ImageContentCardsBlock
          {...block}
          cards={block.cards.map((c) => ({ ...c, icon: resolveIcon(c.icon) }))}
        />
      )
    case 'newsletter':
      return <NewsletterBlock {...block} />
    case 'numbered-steps':
      return (
        <NumberedStepsBlock
          {...block}
          steps={block.steps.map((s) => ({ ...s, icon: resolveIcon(s.icon) }))}
        />
      )
    case 'people-grid':
      return <PeopleGridBlock {...block} />
    case 'image-text-split':
      return null
    case 'split-hero':
      return null
    case 'section':
      return (
        <section>
          <BlockRenderer blocks={block.children} />
        </section>
      )
    default:
      return null
  }
}
