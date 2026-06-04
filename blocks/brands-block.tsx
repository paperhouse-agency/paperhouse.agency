import type { BlockSchema } from '@/libs/cms/block-schema'
import { Marquee } from '@/components/marquee'

const BRANDS = [
  'Stripe',
  'Vercel',
  'Notion',
  'Linear',
  'Figma',
  'GitHub',
  'Sanity',
  'Next.js',
  'Shopify',
  'Cloudflare',
]

export function BrandsBlock() {
  return (
    <div className="py-6 border-y border-text/10 overflow-hidden bg-offwhite">
      <Marquee repeat={4} speed={0.4} scrollVelocity={false}>
        <div className="flex items-center gap-12 pr-12">
          {BRANDS.map((brand) => (
            <span
              key={brand}
              className="mono-wide text-text/30 whitespace-nowrap shrink-0"
            >
              {brand}
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  )
}


export const cmsSchema: BlockSchema = {
  type: 'brands',
  label: 'Brands Marquee',
  icon: 'Star',
  fields: [],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'brands',
  }),
}
