import { Button } from '@/components/button'

export interface CtaManifestoBlockProps {
  preheadingContent?: string
  headingLine1?: string
  headingLine2?: string
  primaryCta?: { label: string; url: string }
  secondaryCta?: { label: string; url: string }
}

export function CtaManifestoBlock({
  preheadingContent = 'READY TO START?',
  headingLine1 = 'Let's build something',
  headingLine2 = 'worth talking about.',
  primaryCta = { label: 'Schedule a Call', url: '/contact' },
  secondaryCta = { label: 'See Our Work', url: '/work' },
}: CtaManifestoBlockProps) {
  return (
    <section className="py-15 px-5 bg-text">
      <div className="wrapper mx-auto flex flex-col items-center text-center gap-10">
        <div className="flex flex-col gap-5 items-center">
          <p className="mono-wide text-primary">{preheadingContent}</p>
          <h2 className="heading-1 text-offwhite">
            {headingLine1}
            <br />
            <span className="text-primary">{headingLine2}</span>
          </h2>
        </div>

        <div className="flex flex-col dt:flex-row items-center gap-5">
          <Button size="lg" color="primary" url={primaryCta.url}>
            {primaryCta.label}
          </Button>
          <Button size="lg" color="neutral" hasIcon url={secondaryCta.url}>
            {secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
