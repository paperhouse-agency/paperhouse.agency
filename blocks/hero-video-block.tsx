'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ContentWithButton } from '@/components/content-with-button'

export function HeroVideoBlock() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="wrapper mx-auto py-24">
      <div className="grid grid-cols-2">
        <ContentWithButton
          headingType="h1"
          headingContent="AI—Driven <span>creative</span> \nagency, based in \nDhaka"
          headingClassName="heading-1"
          bodyContent="We help brands and company in marketing solution. As a cause-led digital marketing and brand agency, we harness the power of technology and creativity to drive positive feedback."
          buttons={[
            { label: 'Schedule a call', size: 'lg' },
            {
              label: 'Explore Projects',
              size: 'lg',
              color: 'neutral',
              hasIcon: true,
            },
          ]}
        />
        <div className="flex items-center justify-center">
          <div className="relative w-[450px] h-[300px] rounded-[20px] overflow-hidden">
            {!isPlaying ? (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full group cursor-pointer"
              >
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=450&h=300&fit=crop"
                  alt="Video poster"
                  width={450}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-text/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 ml-1 border-t-12 border-t-transparent border-l-20 border-l-primary border-b-12 border-b-transparent" />
                  </div>
                </div>
              </button>
            ) : (
              <iframe
                width="450"
                height="300"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
