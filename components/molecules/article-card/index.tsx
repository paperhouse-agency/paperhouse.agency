import { Button } from '@/components/button'
import { Image } from '@/components/image'

export interface ArticleCardProps {
  image: {
    src: string
    alt: string
  }
  heading: string
  content: string
  ctaUrl?: string
}

export function ArticleCard({ image, heading, content, ctaUrl }: ArticleCardProps) {
  return (
    <div className="flex flex-col gap-5 items-start">
      <div className="relative w-full aspect-[440/293] rounded-lg overflow-hidden shrink-0">
        <Image src={image.src} alt={image.alt} fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        <h3 className="heading-4 text-text">{heading}</h3>
        <p className="body text-text/60 line-clamp-3">{content}</p>
      </div>

      <Button variant="tertiary" color="primary" size="sm" hasIcon url={ctaUrl}>
        READ MORE
      </Button>
    </div>
  )
}
