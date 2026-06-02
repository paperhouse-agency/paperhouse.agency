import { Button } from '@/components/button'
import { Image } from '@/components/image'

export interface TeamCardProps {
  name: string
  role: string
  image: {
    src: string
    alt: string
  }
  ctaUrl?: string
}

export function TeamCard({ name, role, image, ctaUrl }: TeamCardProps) {
  return (
    <div className="flex flex-col gap-5 items-start">
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
        <Image src={image.src} alt={image.alt} fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-2.5 flex-1">
        <p className="heading-4 text-text">{name}</p>
        <p className="body-large text-text/60">{role}</p>
      </div>

      <Button variant="tertiary" color="primary" size="sm" hasIcon url={ctaUrl}>
        READ MORE
      </Button>
    </div>
  )
}
