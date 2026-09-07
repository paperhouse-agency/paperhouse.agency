import { Marquee } from '@/components/marquee'


function Separator() {
  return (
    <span className="text-primary mx-4" aria-hidden>
      ✦
    </span>
  )
}

export interface TaglineMarqueeBlockProps {
  items: Array<{ label: string }>
}

export function TaglineMarqueeBlock({
  items,
}: TaglineMarqueeBlockProps) {
  return (
    <div className="py-8 border-y border-text/10 overflow-hidden bg-bluishgray">
      <Marquee repeat={3} speed={0.6} scrollVelocity={true}>
        <div className="flex items-center pr-0">
          {items.map((item) => (
            <span key={item.label} className="flex items-center">
              <span className="heading-4 text-text whitespace-nowrap">
                {item.label}
              </span>
              <Separator />
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  )
}
