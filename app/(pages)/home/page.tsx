import { Crosshair, Handshake, Lightbulb } from 'lucide-react'
import { HeroVideoBlock } from '@/blocks/hero-video-block'
import { ImageContentWithCards } from '@/blocks/image-content-with-cards'
import { Wrapper } from '../(components)/wrapper'

export default function Home() {
  return (
    <Wrapper lenis={{}}>
      <HeroVideoBlock />
      <ImageContentWithCards
        preheadingContent="ABOUT PAPERHOUSE"
        headingType="h2"
        headingContent="Three steps for your <span>Digital Growth!</span>"
        bodyContent="Explore our portfolio of exceptional web design and custom websites that drive results for businesses worldwide."
        buttons={[
          {
            label: 'Know Us More',
            size: 'sm',
          },
        ]}
        cards={[
          {
            icon: Lightbulb,
            heading: 'Innovation',
            content: 'Breaking boundaries with creative solutions.',
            alternate: true,
          },
          {
            icon: Crosshair,
            heading: 'Precision',
            content: 'Pixel-perfect designs and flawlessly scalable code.',
            alternate: true,
          },
          {
            icon: Handshake,
            heading: 'Partnership',
            content: 'Your vision, our execution—concept to launch.',
            alternate: true,
          },
        ]}
        image={{
          src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=690&h=750&fit=crop',
          alt: 'Digital growth and business strategy',
        }}
      />
    </Wrapper>
  )
}
