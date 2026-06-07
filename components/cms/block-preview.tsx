'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import { BentoStatsBlock } from '@/blocks/bento-stats-block'
import { BrandsBlock } from '@/blocks/brands-block'
import { CardGridBlock } from '@/blocks/card-grid-block'
import { CtaManifestoBlock } from '@/blocks/cta-manifesto-block'
import { FaqBlock } from '@/blocks/faq-block'
import { FeatureCardsBlock } from '@/blocks/feature-cards-block'
import { FormCtaBlock } from '@/blocks/form-cta-block'
import { ImageContentCardsBlock } from '@/blocks/image-content-cards-block'
import { ImageTextSplitBlock } from '@/blocks/image-text-split-block'
import { NewsletterBlock } from '@/blocks/newsletter-block'
import { NumberedStepsBlock } from '@/blocks/numbered-steps-block'
import { PeopleGridBlock } from '@/blocks/people-grid-block'
import { SplitHeroBlock } from '@/blocks/split-hero-block'
import { TaglineMarqueeBlock } from '@/blocks/tagline-marquee-block'
import { resolveIcon } from '@/libs/cms/resolve-icon'
import type { BlockData } from '@/libs/cms/types'

const DESKTOP_WIDTH = 1280

interface Props {
  blocks: BlockData[]
  selectedBlockId: string | null
}

export function BlocksPreview({ blocks, selectedBlockId }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    function measure() {
      if (!frame) return
      setScale(frame.offsetWidth / DESKTOP_WIDTH)
    }

    if (viewport === 'desktop') {
      measure()
      const ro = new ResizeObserver(measure)
      ro.observe(frame)
      return () => ro.disconnect()
    }

    setScale(1)
    return undefined
  }, [viewport])

  const visible = blocks.filter((b) => b.visible !== false)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-[4px] px-[14px] py-[10px] border-b border-[var(--chrome-border)] flex-none bg-[var(--chrome)]">
        <button
          type="button"
          className={`inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-[6px] font-body text-[12px] cursor-pointer transition-[background,color] duration-[120ms] border ${viewport === 'desktop' ? 'bg-[var(--c-card)] text-text border-[var(--chrome-border)]' : 'text-[var(--chrome-muted)] bg-transparent border-transparent hover:bg-[rgba(26,26,26,0.06)] hover:text-text'}`}
          onClick={() => setViewport('desktop')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          Desktop
        </button>
        <button
          type="button"
          className={`inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-[6px] font-body text-[12px] cursor-pointer transition-[background,color] duration-[120ms] border ${viewport === 'mobile' ? 'bg-[var(--c-card)] text-text border-[var(--chrome-border)]' : 'text-[var(--chrome-muted)] bg-transparent border-transparent hover:bg-[rgba(26,26,26,0.06)] hover:text-text'}`}
          onClick={() => setViewport('mobile')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
          Mobile
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white" ref={frameRef}>
        {visible.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-[40px_24px] text-center font-body text-[13px] text-[var(--chrome-muted)] leading-[1.5]">Add a block to see the page preview here.</div>
        ) : (
          <div
            style={
              viewport === 'desktop'
                ? { width: DESKTOP_WIDTH, zoom: scale }
                : { width: '100%' }
            }
          >
            {visible.map((block) => {
              const rendered = renderBlock(block)
              if (!rendered) return null
              return (
                <div
                  key={block._id}
                >
                  {rendered}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function renderBlock(block: BlockData): React.ReactNode {
  switch (block._type) {
    case 'bento-stats':
      return <BentoStatsBlock {...block} />
    case 'brands':
      return <BrandsBlock {...block} />
    case 'card-grid':
      return <CardGridBlock {...block} />
    case 'cta-manifesto':
      return <CtaManifestoBlock {...block} />
    case 'faq':
      return <FaqBlock {...block} />
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
    case 'image-text-split':
      return <ImageTextSplitBlock {...block} />
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
    case 'split-hero':
      return <SplitHeroBlock {...block} />
    case 'tagline-marquee':
      return <TaglineMarqueeBlock {...block} />
    case 'section':
      return null
    default:
      return null
  }
}
