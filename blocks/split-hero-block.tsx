'use client'

import type { BlockSchema } from '@/libs/cms/block-schema'
import { useState } from 'react'
import { Image } from '@/components/image'
import { Button } from '@/components/button'
import { ContentWithButton } from '@/components/content-with-button'

export interface SplitHeroButton {
  label: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'neutral'
  hasIcon?: boolean
  url?: string
}

export interface SplitHeroBlockProps {
  headingContent?: string
  bodyContent?: string
  videoUrl?: string
  videoPosterImage?: { src: string; alt: string }
  buttons?: SplitHeroButton[]
}

function VideoEmbed({
  videoUrl,
  posterSrc,
  posterAlt,
  isPlaying,
  onPlay,
}: {
  videoUrl: string
  posterSrc: string
  posterAlt: string
  isPlaying: boolean
  onPlay: () => void
}) {
  if (isPlaying && videoUrl) {
    let embedUrl = videoUrl
    if (videoUrl.includes('youtube.com/watch')) {
      embedUrl = `${videoUrl.replace('watch?v=', 'embed/')}?autoplay=1`
    } else if (videoUrl.includes('youtu.be/')) {
      embedUrl = `${videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')}?autoplay=1`
    }

    return (
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="Video player"
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
      {posterSrc && (
        <Image
          src={posterSrc}
          alt={posterAlt || 'Video poster'}
          fill
          priority
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-text/60 flex items-center justify-center group-hover:scale-110 transition-transform">
          <div className="w-0 h-0 ml-1 border-t-12 border-t-transparent border-l-20 border-l-primary border-b-12 border-b-transparent" />
        </div>
      </div>
    </button>
  )
}

export function SplitHeroBlock({
  headingContent = 'AI—Driven <span>creative</span> \nagency, based in \nDhaka',
  bodyContent = 'We help brands and company in marketing solution. As a cause-led digital marketing and brand agency, we harness the power of technology and creativity to drive positive feedback.',
  videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  videoPosterImage = { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=506&fit=crop', alt: 'Video poster' },
  buttons = [
    { label: 'Schedule a call', size: 'lg' },
    { label: 'Explore Projects', size: 'lg', color: 'neutral', hasIcon: true },
  ],
}: SplitHeroBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="wrapper mx-auto py-24 px-5">
      <div className="desktop-only grid grid-cols-2">
        <ContentWithButton
          headingType="h1"
          headingContent={headingContent}
          headingClassName="heading-1"
          bodyContent={bodyContent}
          buttons={buttons}
        />
        <div className="flex items-center justify-end">
          <div className="relative w-[450px] h-[300px] rounded-[20px] overflow-hidden">
            <VideoEmbed
              videoUrl={videoUrl ?? ''}
              posterSrc={videoPosterImage?.src ?? ''}
              posterAlt={videoPosterImage?.alt ?? ''}
              isPlaying={isPlaying}
              onPlay={() => setIsPlaying(true)}
            />
          </div>
        </div>
      </div>

      <div className="mobile-only flex flex-col items-center text-center gap-6">
        <h1 className="heading-1">
          AI—Driven <span className="text-primary">creative</span>
          <br />
          agency, based in
          <br />
          Dhaka
        </h1>
        <p className="body-large text-text/60">{bodyContent}</p>
        <div className="flex flex-row items-center gap-4">
          {buttons.map((btn) => (
            <Button key={btn.label} size={btn.size ?? 'md'} color={btn.color} hasIcon={btn.hasIcon} url={btn.url}>
              {btn.label}
            </Button>
          ))}
        </div>
        <div className="relative w-full aspect-video rounded-[20px] overflow-hidden">
          <VideoEmbed
            videoUrl={videoUrl ?? ''}
            posterSrc={videoPosterImage?.src ?? ''}
            posterAlt={videoPosterImage?.alt ?? ''}
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
          />
        </div>
      </div>
    </div>
  )
}

export const cmsSchema: BlockSchema = {
  type: 'split-hero',
  label: 'Split Hero',
  icon: 'PanelLeftOpen',
  fields: [
    { key: 'headingContent', label: 'Heading', type: 'text', required: true, placeholder: 'Use <span> for highlight, \\n for line break' },
    { key: 'bodyContent', label: 'Body', type: 'textarea' },
    { key: 'videoUrl', label: 'Video URL', type: 'url', placeholder: 'YouTube URL' },
    { key: 'videoPosterImage', label: 'Video Poster Image', type: 'image' },
    {
      key: 'buttons',
      label: 'Buttons',
      type: 'array',
      fields: [
        { key: 'label', label: 'Label', type: 'text', required: true },
        { key: 'size', label: 'Size', type: 'select', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }] },
        { key: 'color', label: 'Color', type: 'select', options: [{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }, { value: 'neutral', label: 'Neutral' }] },
        { key: 'hasIcon', label: 'Has Icon', type: 'boolean' },
        { key: 'url', label: 'URL', type: 'url' },
      ],
    },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'split-hero',
    headingContent: 'AI—Driven <span>creative</span> \nagency, based in \nDhaka',
    bodyContent: '',
    videoUrl: '',
    videoPosterImage: { src: '', alt: '' },
    buttons: [],
  }),
}
