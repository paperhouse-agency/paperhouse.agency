'use client'

import { useEffect, useRef, useState } from 'react'

const SNAP_POINTS = [0.25, 0.5, 0.75] as const
const SNAP_THRESHOLD = 0.04 // within 4% of a snap point → snap to it

interface UseSplitResizeOptions {
  /** Initial preview ratio (0–1). Defaults to 0.5. */
  defaultRatio?: number
  /** How much of the container is already consumed by other panels (e.g. sidebar + handles). */
  getReservedWidth: () => number
}

interface UseSplitResizeReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  previewWidth: number
  available: number
  isDragging: boolean
  startResize: (e: React.MouseEvent) => void
}

export function useSplitResize({
  defaultRatio = 0.5,
  getReservedWidth,
}: UseSplitResizeOptions): UseSplitResizeReturn {
  const containerRef = useRef<HTMLDivElement>(null)
  const [previewWidth, setPreviewWidth] = useState(400)
  const [available, setAvailable] = useState(800)
  const [isDragging, setIsDragging] = useState(false)

  function measureAvailable() {
    const total = containerRef.current?.offsetWidth ?? 0
    return Math.max(1, total - getReservedWidth())
  }

  function snap(ratio: number) {
    const clamped = Math.max(0.25, Math.min(0.75, ratio))
    for (const point of SNAP_POINTS) {
      if (Math.abs(clamped - point) < SNAP_THRESHOLD) return point
    }
    return clamped
  }

  useEffect(() => {
    let rafId: number

    function attempt() {
      const avail = measureAvailable()
      if (avail > 100) {
        setAvailable(avail)
        setPreviewWidth(Math.round(avail * defaultRatio))
      } else {
        rafId = requestAnimationFrame(attempt)
      }
    }

    rafId = requestAnimationFrame(attempt)
    return () => cancelAnimationFrame(rafId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startResize(e: React.MouseEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startW = previewWidth
    const avail = measureAvailable()
    setAvailable(avail)
    setIsDragging(true)

    function onMove(ev: MouseEvent) {
      const raw = (startW - (ev.clientX - startX)) / avail
      const snapped = snap(raw)
      setPreviewWidth(Math.round(snapped * avail))
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      setIsDragging(false)
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return { containerRef, previewWidth, available, isDragging, startResize }
}
