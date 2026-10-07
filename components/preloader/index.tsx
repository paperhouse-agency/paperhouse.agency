'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'

const WORDS = [
  'Hello', // English
  'হ্যালো', // Bangla
  'Hola', // Spanish
  'مرحبا', // Arabic
  'こんにちは', // Japanese
  '你好', // Chinese
]

// First word lingers, the rest flick past
const FIRST_WORD_MS = 900
const WORD_MS = 160

// Flat edge vs. bulging edge the panel drags as it lifts off
const CURVE_FLAT = 'M0 0 L100 0 Q50 0 0 0'
const CURVE_BULGE = 'M0 0 L100 0 Q50 40 0 0'

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const lenis = useLenis()

  const isLastWord = index === WORDS.length - 1

  // Lock scrolling while the preloader is on screen
  useEffect(() => {
    if (done) return
    const html = document.documentElement
    html.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      html.style.overflow = ''
      lenis?.start()
    }
  }, [done, lenis])

  // Cycle through the greetings
  useEffect(() => {
    if (isLastWord) return
    const timeout = setTimeout(
      () => setIndex((i) => i + 1),
      index === 0 ? FIRST_WORD_MS : WORD_MS
    )
    return () => clearTimeout(timeout)
  }, [index, isLastWord])

  // Fade the first word in
  useGSAP(
    () => {
      gsap.fromTo(
        '[data-preloader-word]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
    },
    { scope: rootRef }
  )

  // Lift the panel away once the last word has been shown
  useGSAP(
    () => {
      if (!isLastWord) return

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      const tl = gsap.timeline({
        delay: WORD_MS / 1000 + 0.2,
        onComplete: () => setDone(true),
      })

      if (reducedMotion) {
        tl.to(rootRef.current, { opacity: 0, duration: 0.4 })
        return
      }

      tl.to('[data-preloader-word]', {
        opacity: 0,
        y: -24,
        duration: 0.4,
        ease: 'power2.in',
      })
        .set(pathRef.current, { attr: { d: CURVE_BULGE } }, '<')
        .to(
          rootRef.current,
          { yPercent: -100, duration: 0.8, ease: 'power3.inOut' },
          '-=0.1'
        )
        .to(
          pathRef.current,
          { attr: { d: CURVE_FLAT }, duration: 0.8, ease: 'power3.inOut' },
          '<0.2'
        )
    },
    { dependencies: [isLastWord], scope: rootRef }
  )

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-text text-offwhite"
      aria-hidden="true"
    >
      <p
        data-preloader-word
        className="heading-3 flex items-center gap-3 dt:heading-2"
      >
        <span className="size-2.5 rounded-full bg-primary" />
        {WORDS[index]}
      </p>

      <svg
        className="absolute top-full left-0 h-[15vh] w-full fill-text"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path ref={pathRef} d={CURVE_FLAT} />
      </svg>
    </div>
  )
}
