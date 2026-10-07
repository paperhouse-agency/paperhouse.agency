'use client'

import cn from 'clsx'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { colors } from '@/styles/colors'
import {
  createPalette,
  drawPrism,
  GRAIN_TILE_SIZE,
  getGrainDataUrl,
  type PrismOptions,
} from './prism'

export type { PrismOptions } from './prism'
export { mixColors } from './prism'

export interface PrismPreset {
  stops: string[]
  options?: PrismOptions
  speed?: number
  startTime?: number
  grain?: number
}

export const PRISM_PRESETS = {
  paperhouse: {
    // White at the top, bluish gray in the middle, orange at the bottom
    stops: [colors.white, colors.bluishgray, colors.primary],
    options: { count: 11, blend: 90 },
    speed: 40,
    startTime: 29.69,
    grain: 2,
  },
  citron: {
    stops: ['#26483D', '#557D57', '#A4B963', '#D6D998', '#F2EDCC'],
    options: { count: 11 },
    speed: 40,
    startTime: 29.69,
    grain: 2,
  },
} satisfies Record<string, PrismPreset>

interface PrismGradientProps extends PrismPreset {
  /** Must position and size the root, e.g. `absolute inset-0` or `relative h-96` */
  className?: string
  style?: CSSProperties
  /** Freeze the animation on the current frame */
  paused?: boolean
}

// Clock speed multiplier and max frame delta (s), matching the original export
const SPEED_SCALE = 1.2
const MAX_DELTA = 0.05
// Canvas backing store caps — bars are soft vertical gradients, so extra
// pixels beyond this add cost without visible gain
const MAX_DPR = 2
const MAX_WIDTH = 2560

export function PrismGradient({
  stops,
  options = {},
  speed = 40,
  startTime = 29.69,
  grain = 0,
  paused = false,
  className,
  style,
}: PrismGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(startTime)
  const [grainUrl, setGrainUrl] = useState<string | null>(null)

  // Stable keys so effects only re-run when values (not references) change
  const stopsKey = stops.join(',')
  const optionsKey = JSON.stringify(options)

  useEffect(() => {
    if (grain > 0) setGrainUrl(getGrainDataUrl())
  }, [grain])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!(canvas && ctx)) return

    const prismOptions = JSON.parse(optionsKey) as PrismOptions
    const palette = createPalette(stopsKey.split(','), prismOptions.reverse)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let isIntersecting = true
    let frame = 0
    let last = 0

    const draw = () => {
      drawPrism(
        ctx,
        canvas.width,
        canvas.height,
        palette,
        prismOptions,
        timeRef.current
      )
    }

    const shouldAnimate = () =>
      speed > 0 &&
      !paused &&
      isIntersecting &&
      !document.hidden &&
      !reducedMotion.matches

    const tick = (now: number) => {
      if (last) {
        timeRef.current +=
          (speed / 100) * SPEED_SCALE * Math.min(MAX_DELTA, (now - last) / 1000)
      }
      last = now
      draw()
      frame = requestAnimationFrame(tick)
    }

    const sync = () => {
      cancelAnimationFrame(frame)
      frame = 0
      last = 0
      if (shouldAnimate()) frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (width < 1 || height < 1) return
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1)
      const scale = Math.min(1, MAX_WIDTH / (width * dpr))
      canvas.width = Math.round(width * dpr * scale)
      canvas.height = Math.round(height * dpr * scale)
      draw()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting
      sync()
    })
    intersectionObserver.observe(canvas)

    document.addEventListener('visibilitychange', sync)
    reducedMotion.addEventListener('change', sync)

    resize()
    sync()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reducedMotion.removeEventListener('change', sync)
    }
  }, [stopsKey, optionsKey, speed, paused])

  return (
    <div
      aria-hidden="true"
      className={cn('overflow-hidden isolate', className)}
      style={{ backgroundColor: stops[0], ...style }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full block" />
      {grainUrl && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url(${grainUrl})`,
            backgroundSize: `${GRAIN_TILE_SIZE}px ${GRAIN_TILE_SIZE}px`,
            imageRendering: 'pixelated',
            opacity: (Math.min(100, Math.max(0, grain)) / 100) * 0.5,
          }}
        />
      )}
    </div>
  )
}
