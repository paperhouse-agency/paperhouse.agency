'use client'

import { useState } from 'react'
import { Image } from '@/components/image'
import { Button } from '@/components/button'
import { ContentWithButton } from '@/components/content-with-button'

function VideoEmbed({
  isPlaying,
  onPlay,
}: { isPlaying: boolean; onPlay: () => void }) {
  if (isPlaying) {
    return (
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      className="relative w-full h-full group cursor-pointer"
    >
      <Image
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=506&fit=crop"
        alt="Video poster"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-text/60 flex items-center justify-center group-hover:scale-110 transition-transform">
          <div className="w-0 h-0 ml-1 border-t-12 border-t-transparent border-l-20 border-l-primary border-b-12 border-b-transparent" />
        </div>
      </div>
    </button>
  )
}

export function SplitHeroBlock() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="wrapper mx-auto py-24 px-5">
      {/* Desktop: original 2-column split layout */}
      <div className="desktop-only grid grid-cols-2">
        <ContentWithButton
          headingType="h1"
          headingContent="AI—Driven <span>creative</span> \nagency, based in \nDhaka"
          headingClassName="heading-1"
          bodyContent="We help brands and company in marketing solution. As a cause-led digital marketing and brand agency, we harness the power of technology and creativity to drive positive feedback."
          buttons={[
            { label: 'Schedule a call', size: 'lg' },
            { label: 'Explore Projects', size: 'lg', color: 'neutral', hasIcon: true },
          ]}
        />
        <div className="flex items-center justify-end">
          <div className="relative w-[450px] h-[300px] rounded-[20px] overflow-hidden">
            <VideoEmbed isPlaying={isPlaying} onPlay={() => setIsPlaying(true)} />
          </div>
        </div>
      </div>

      {/* Mobile: centered single-column — title > desc > vertical buttons > video */}
      <div className="mobile-only flex flex-col items-center text-center gap-6">
        <h1 className="heading-1">
          AI—Driven <span className="text-primary">creative</span>
          <br />
          agency, based in
          <br />
          Dhaka
        </h1>
        <p className="body-large text-text/60">
          We help brands and company in marketing solution. As a cause-led digital
          marketing and brand agency, we harness the power of technology and
          creativity to drive positive feedback.
        </p>
        <div className="flex flex-row items-center gap-4">
          <Button size="md">Schedule a call</Button>
          <Button size="md" color="neutral" hasIcon>
            Projects
          </Button>
        </div>
        <div className="relative w-full aspect-video rounded-[20px] overflow-hidden">
          <VideoEmbed isPlaying={isPlaying} onPlay={() => setIsPlaying(true)} />
        </div>
      </div>
    </div>
  )
}
