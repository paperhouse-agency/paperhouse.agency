import type { BlockSchema } from '@/libs/cms/block-schema'
import { Marquee } from '@/components/marquee'

const DEFAULT_ITEMS = [
  { name: 'Stripe' },
  { name: 'Vercel' },
  { name: 'Notion' },
  { name: 'Linear' },
  { name: 'Figma' },
  { name: 'GitHub' },
  { name: 'Sanity' },
  { name: 'Next.js' },
  { name: 'Shopify' },
  { name: 'Cloudflare' },
]

export interface BrandsBlockProps {
  items?: Array<{ name: string }>
}

export function BrandsBlock({ items = DEFAULT_ITEMS }: BrandsBlockProps) {
  return (
    <div className="py-6 border-y border-text/10 overflow-hidden bg-offwhite">
      <Marquee repeat={4} speed={0.4} scrollVelocity={false}>
        <div className="flex items-center gap-12 pr-12">
          {items.map((brand) => (
            <span key={brand.name} className="mono-wide text-text/30 whitespace-nowrap shrink-0">
              {brand.name}
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
  fields: [
    {
      key: 'items',
      label: 'Brand Names',
      type: 'array',
      span: 'full',
      description: 'Names scrolling in the marquee strip',
      fields: [
        { key: 'name', label: 'Brand Name', type: 'text', required: true, placeholder: 'e.g. Stripe' },
      ],
    },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'brands',
    items: DEFAULT_ITEMS,
  }),
}
