import { Image } from '@/components/image'

export interface MetricCard {
  value: string
  heading: string
  content: string
}

export interface MetricImageCard {
  src: string
  alt: string
}

export interface ImpactMetricsBlockProps {
  preheadingContent?: string
  metrics: {
    large: MetricCard
    image1: MetricImageCard
    medium: MetricCard
    small: MetricCard
    image2: MetricImageCard
  }
}

export function ImpactMetricsBlock({
  preheadingContent = 'OUR TRACK RECORD',
  metrics,
}: ImpactMetricsBlockProps) {
  return (
    <section className="py-15 px-5">
      <div className="wrapper mx-auto">
        <div className="flex flex-col items-center text-center gap-2.5 mb-10">
          <p className="mono-wide text-primary">{preheadingContent}</p>
          <h2 className="heading-2 text-text">
            Combining innovation and precision
            <br />
            to deliver{' '}
            <span className="text-primary underline">results that matter</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 dt:grid-cols-3 gap-5 dt:h-[600px] dt:[grid-template-rows:repeat(2,1fr)]">
          {/* Col 1 — tall accent stat (spans both rows) */}
          <div className="bg-accent rounded-[12px] p-5 flex flex-col justify-between text-offwhite min-h-[280px] dt:min-h-0 dt:col-start-1 dt:row-start-1 dt:row-span-2">
            <p className="font-body text-[64px] leading-none">{metrics.large.value}</p>
            <div className="flex flex-col gap-2.5">
              <p className="heading-4 text-offwhite">{metrics.large.heading}</p>
              <p className="body text-offwhite/80">{metrics.large.content}</p>
            </div>
          </div>

          {/* Col 2 Row 1 — image */}
          <div className="relative rounded-[12px] overflow-hidden min-h-[180px] dt:min-h-0 dt:col-start-2 dt:row-start-1">
            <div className="absolute inset-0 bg-text" />
            <Image
              src={metrics.image1.src}
              alt={metrics.image1.alt}
              fill
              className="object-cover opacity-70"
            />
          </div>

          {/* Col 2 Row 2 — secondary stat */}
          <div className="bg-secondary rounded-[12px] p-5 flex flex-col justify-between text-offwhite min-h-[200px] dt:min-h-0 dt:col-start-2 dt:row-start-2">
            <p className="font-body text-[64px] leading-none">{metrics.medium.value}</p>
            <div className="flex flex-col gap-2.5">
              <p className="heading-4 text-offwhite">{metrics.medium.heading}</p>
              <p className="body text-offwhite/80">{metrics.medium.content}</p>
            </div>
          </div>

          {/* Col 3 Row 1 — bluishgray stat */}
          <div className="bg-bluishgray rounded-[12px] p-5 flex flex-col justify-between text-text min-h-[200px] dt:min-h-0 dt:col-start-3 dt:row-start-1">
            <p className="heading-2 text-text">{metrics.small.value}</p>
            <div className="flex flex-col gap-2.5">
              <p className="heading-4 text-text">{metrics.small.heading}</p>
              <p className="body text-text/60">{metrics.small.content}</p>
            </div>
          </div>

          {/* Col 3 Row 2 — image */}
          <div className="relative rounded-[12px] overflow-hidden min-h-[180px] dt:min-h-0 dt:col-start-3 dt:row-start-2">
            <div className="absolute inset-0 bg-text" />
            <Image
              src={metrics.image2.src}
              alt={metrics.image2.alt}
              fill
              className="object-cover opacity-70"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
