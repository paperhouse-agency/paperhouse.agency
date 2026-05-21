import { Link } from '@/components/link'

export function MaintenanceScreen() {
  return (
    <main className="relative min-h-screen bg-offwhite flex flex-col items-center justify-center px-5">
      <div className="flex flex-col items-center text-center gap-6 max-w-xl">
        {/* Pulsing status indicator */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full size-2.5 bg-primary" />
          </span>
          <p className="mono-wide text-primary">MAINTENANCE MODE</p>
        </div>

        {/* Heading */}
        <h1 className="heading-1 text-text">
          We'll be back
          <br />
          <span className="text-primary">very soon.</span>
        </h1>

        {/* Description */}
        <p className="body-large text-text/60 max-w-md">
          We're making some improvements to give you a better experience. Thank
          you for your patience — we won't be long.
        </p>

        <div className="w-12 h-px bg-text/20" />

        {/* Contact */}
        <p className="body text-text/60">
          Need something urgent?{' '}
          <Link
            href="mailto:hello@paperhouse.agency"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors duration-300"
          >
            hello@paperhouse.agency
          </Link>
        </p>
      </div>

      {/* Brand watermark */}
      <p className="absolute bottom-8 mono-wide text-text/20">
        PAPERHOUSE AGENCY
      </p>
    </main>
  )
}
