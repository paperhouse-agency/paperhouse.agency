/**
 * Route registry — the source of truth for which public routes exist.
 *
 * Page content is code in this repo, so the set of routes is defined here, not
 * in the database. HQ reads this list (via `GET /api/routes`) to know which
 * pages it can offer for SEO editing; `sitemap.ts` builds from it too.
 *
 * When you add a public page, add it here.
 */

export interface RouteDef {
  /** Route path, used verbatim as the `page_seo.slug` key. */
  slug: string
  /** Human label shown in the HQ editor. */
  label: string
  /** Include in sitemap.xml. Demo/dev routes stay false. */
  sitemap: boolean
  /** In-code defaults, used when HQ has no row for this route yet. */
  defaults: {
    title: string
    description: string
  }
}

/**
 * Public, marketing-managed routes only. Internal demo routes (`/test`, `/r3f`,
 * `/hubspot`) are deliberately excluded — they are noindex in code and must not
 * appear in HQ's editor.
 */
export const ROUTES: RouteDef[] = [
  {
    slug: '/',
    label: 'Home',
    sitemap: true,
    defaults: {
      title: 'PaperHouse — Creative & Development Studio',
      description:
        'A creative and development studio blending design, code, and storytelling — built to help brands grow in the digital space.',
    },
  },
  {
    slug: '/about',
    label: 'About',
    sitemap: true,
    defaults: {
      title: 'About — PaperHouse',
      description:
        'A creative and development studio blending design, code, and storytelling.',
    },
  },
  {
    slug: '/contact',
    label: 'Contact',
    sitemap: true,
    defaults: {
      title: 'Contact — PaperHouse',
      description: 'Get in touch with the PaperHouse team.',
    },
  },
]

export function getRoute(slug: string): RouteDef | undefined {
  return ROUTES.find((r) => r.slug === slug)
}
