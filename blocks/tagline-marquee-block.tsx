import { Marquee } from '@/components/marquee'

const ITEMS = [
  'Brand Identity',
  'UI/UX Design',
  'Web Development',
  'Digital Strategy',
  'Motion Design',
  'SaaS Platforms',
  'E-Commerce',
  'CMS Architecture',
]

function Separator() {
  return <span className="text-primary mx-4" aria-hidden>✦</span>
}

export function TaglineMarqueeBlock() {
  return (
    <div className="py-8 border-y border-text/10 overflow-hidden bg-bluishgray">
      <Marquee repeat={3} speed={0.6} scrollVelocity={true}>
        <div className="flex items-center pr-0">
          {ITEMS.map((item) => (
            <span key={item} className="flex items-center">
              <span className="heading-4 text-text whitespace-nowrap">{item}</span>
              <Separator />
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  )
}
