import { Link } from '@/components/link'

export function Footer() {
  return (
    <footer className="flex flex-col dt:flex-row items-center dt:items-end justify-between p-safe uppercase font-mono">
      <div>
        <Link href="#" className="link">
          paperhouse
        </Link>
        {' / '}
        <Link
          href="https://github.com/paperhouse-agency/paperhouse.agency"
          className="link"
        >
          github
        </Link>
      </div>
    </footer>
  )
}
