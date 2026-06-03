import { Link } from '@/components/link'
import { Image } from '@/components/image'

export interface FeatureContentCardProps {
  label: string
  heading: string
  content: string
  ctaLabel: string
  ctaUrl?: string
  image: {
    src: string
    alt: string
  }
}

export function FeatureContentCard({
  label,
  heading,
  content,
  ctaLabel,
  ctaUrl,
  image,
}: FeatureContentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-[4px_4px_5px_rgba(0,0,0,0.05)] p-5 flex flex-col items-center gap-5">
      <div className="flex flex-col gap-2.5 text-center w-full">
        <p className="mono-wide text-primary">{label}</p>
        <h3 className="heading-3 text-text">{heading}</h3>
        <p className="body text-text/60">{content}</p>
      </div>

      <Link
        href={ctaUrl}
        className="inline-flex items-center justify-center border border-text rounded-full px-3 py-1.5 body-small text-text whitespace-nowrap shrink-0"
      >
        {ctaLabel}
      </Link>

      <div className="relative w-full aspect-[413/260] rounded-lg overflow-hidden mt-auto">
        <Image src={image.src} alt={image.alt} fill className="object-cover" />
      </div>
    </div>
  )
}
