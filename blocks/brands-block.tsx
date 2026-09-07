import { Marquee } from '@/components/marquee'


export interface BrandsBlockProps {
  items: Array<{ name: string }>
}

export function BrandsBlock({ items }: BrandsBlockProps) {
  return (
    <div className="py-6 border-y border-text/10 overflow-hidden bg-offwhite">
      <Marquee repeat={4} speed={0.4} scrollVelocity={false}>
        <div className="flex items-center gap-12 pr-12">
          {items.map((brand) => (
            <span
              key={brand.name}
              className="mono-wide text-text/30 whitespace-nowrap shrink-0"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  )
}
