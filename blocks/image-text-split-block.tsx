import type { BlockSchema } from '@/libs/cms/block-schema'
import { Button } from '@/components/button'
import { Image } from '@/components/image'

export interface ImageTextSplitBlockProps {
  image?: { src: string; alt: string }
  heading?: string
  bodyContent?: string
  ctaLabel?: string
  ctaUrl?: string
}

export function ImageTextSplitBlock({
  image = { src: '/workspace_bw.png', alt: 'Creative Workspace' },
  heading = 'Our Brand\nCore Values',
  bodyContent = "Poor user experience doesn't just frustrate customers—it bleeds revenue. Learn how integrating design thinking into your development process reduces technical debt, speeds up iterations, and creates products users actually love.",
  ctaLabel = 'Know Us More',
  ctaUrl = '/about',
}: ImageTextSplitBlockProps) {
  return (
    <section className="py-20 px-5 bg-[#F8F7F5]">
      <div className="wrapper mx-auto max-w-7xl">
        {image?.src && (
          <div className="relative w-full h-[200px] dt:h-[350px] mb-16">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover grayscale"
            />
          </div>
        )}

        <div className="grid grid-cols-1 dt:grid-cols-12 gap-10 dt:gap-4 items-start">
          <div className="dt:col-span-5">
            <h2 className="heading-2 text-black">
              {heading.split('\n').map((line, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static split
                <span key={i}>{line}{i < heading.split('\n').length - 1 && <br />}</span>
              ))}
            </h2>
          </div>

          <div className="dt:col-span-7 flex flex-col gap-8 dt:pl-10">
            {bodyContent && (
              <p className="body-large text-black/60 max-w-[600px]">{bodyContent}</p>
            )}
            {ctaLabel && ctaUrl && (
              <div>
                <Button url={ctaUrl} variant="tertiary" color="neutral" size="sm" hasIcon>
                  {ctaLabel}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export const cmsSchema: BlockSchema = {
  type: 'image-text-split',
  label: 'Image Text Split',
  icon: 'Columns2',
  fields: [
    { key: 'image', label: 'Full-width Image', type: 'image', span: 'full' },
    { key: 'heading', label: 'Heading', type: 'text', span: 'full', placeholder: 'Our Brand\nCore Values', description: 'Use \\n for line breaks' },
    { key: 'bodyContent', label: 'Body', type: 'textarea', span: 'full' },
    { key: 'ctaLabel', label: 'CTA Label', type: 'text', placeholder: 'Know Us More' },
    { key: 'ctaUrl', label: 'CTA URL', type: 'url', placeholder: '/about' },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'image-text-split',
    image: { src: '', alt: '' },
    heading: 'Our Brand\nCore Values',
    bodyContent: '',
    ctaLabel: 'Know Us More',
    ctaUrl: '/about',
  }),
}
