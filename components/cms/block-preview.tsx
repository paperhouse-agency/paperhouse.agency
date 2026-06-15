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

const MOBILE_VIEWPORT_W = 390
const MOBILE_VIEWPORT_H = 844
const DEVICE_H_PAD = 10       // device body horizontal padding each side
const DEVICE_TOP_PAD = 12     // above status bar
const DEVICE_BOT_PAD = 10     // below home indicator
const STATUS_BAR_H = 42
const HOME_BAR_H = 24
const DEVICE_OUTER_W = MOBILE_VIEWPORT_W + DEVICE_H_PAD * 2  // 410

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
      if (viewport === 'desktop') {
        setScale(frame.offsetWidth / DESKTOP_WIDTH)
      } else {
        const available = frame.offsetWidth - 48 // 24px padding each side
        setScale(Math.min(1, available / DEVICE_OUTER_W))
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(frame)
    return () => ro.disconnect()
  }, [viewport])

  const visible = blocks.filter((b) => b.visible !== false)

  const btnBase = 'inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-[6px] font-body text-[12px] cursor-pointer transition-[background,color] duration-[120ms] border'
  const btnActive = 'bg-[var(--c-card)] text-text border-[var(--chrome-border)]'
  const btnIdle = 'text-[var(--chrome-muted)] bg-transparent border-transparent hover:bg-[rgba(26,26,26,0.06)] hover:text-text'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-[4px] px-[14px] py-[10px] border-b border-[var(--chrome-border)] flex-none bg-[var(--chrome)]">
        <button type="button" className={`${btnBase} ${viewport === 'desktop' ? btnActive : btnIdle}`} onClick={() => setViewport('desktop')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          Desktop
        </button>
        <button type="button" className={`${btnBase} ${viewport === 'mobile' ? btnActive : btnIdle}`} onClick={() => setViewport('mobile')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
          Mobile
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto" ref={frameRef}>

        {/* ── Desktop ── */}
        {viewport === 'desktop' && (
          <div className="bg-white" style={{ width: DESKTOP_WIDTH, zoom: scale }}>
            {visible.length === 0 ? (
              <div className="flex items-center justify-center p-[40px_24px] text-center font-body text-[13px] text-[var(--chrome-muted)] leading-[1.5]" style={{ minHeight: '100%' }}>
                Add a block to see the page preview here.
              </div>
            ) : visible.map((block) => {
              const rendered = renderBlock(block)
              return rendered ? <div key={block._id}>{rendered}</div> : null
            })}
          </div>
        )}

        {/* ── Mobile phone frame ── */}
        {viewport === 'mobile' && (
          <div className="flex justify-center py-[32px] bg-[var(--workspace)]" style={{ minHeight: '100%' }}>
            <div className="flex flex-col items-start" style={{ zoom: scale, width: DEVICE_OUTER_W }}>

              {/* Dimension label — top-left, outside frame */}
              <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--chrome-muted)] mb-[10px] select-none">
                {MOBILE_VIEWPORT_W} × {MOBILE_VIEWPORT_H}
              </span>

              {/* Device shell */}
              <div
                className="relative bg-[#0f0f0f] shadow-[0_32px_80px_rgba(0,0,0,0.28),inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                style={{
                  width: DEVICE_OUTER_W,
                  borderRadius: 44,
                  border: '1.5px solid rgba(255,255,255,0.10)',
                  padding: `${DEVICE_TOP_PAD}px ${DEVICE_H_PAD}px ${DEVICE_BOT_PAD}px`,
                }}
              >
                {/* Volume up */}
                <div className="absolute bg-[#1a1a1a]" style={{ left: -3, top: 82, width: 3, height: 28, borderRadius: '3px 0 0 3px' }} />
                {/* Volume down */}
                <div className="absolute bg-[#1a1a1a]" style={{ left: -3, top: 120, width: 3, height: 28, borderRadius: '3px 0 0 3px' }} />
                {/* Power */}
                <div className="absolute bg-[#1a1a1a]" style={{ right: -3, top: 96, width: 3, height: 44, borderRadius: '0 3px 3px 0' }} />

                {/* Status bar — dynamic island pill */}
                <div className="flex items-center justify-center" style={{ height: STATUS_BAR_H }}>
                  <div style={{ width: 120, height: 8, borderRadius: 20, background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)' }} />
                </div>

                {/* Screen */}
                <div
                  className="bg-white overflow-y-auto"
                  style={{
                    width: MOBILE_VIEWPORT_W,
                    height: MOBILE_VIEWPORT_H,
                    borderRadius: 4,
                  }}
                >
                  {visible.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-[24px] text-center font-body text-[13px] text-[var(--chrome-muted)] leading-[1.5]">
                      Add a block to see the preview here.
                    </div>
                  ) : visible.map((block) => {
                    const rendered = renderBlock(block)
                    return rendered ? <div key={block._id}>{rendered}</div> : null
                  })}
                </div>

                {/* Home indicator */}
                <div className="flex items-center justify-center" style={{ height: HOME_BAR_H }}>
                  <div style={{ width: 100, height: 4, borderRadius: 10, background: 'rgba(255,255,255,0.2)' }} />
                </div>
              </div>
            </div>
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
