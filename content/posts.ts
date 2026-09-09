/**
 * Blog posts — static content.
 *
 * Migrated off the CMS when the in-repo admin was retired. The old
 * implementation treated every published CMS page (except the homepage) as a
 * post; there were none, so nothing was carried over.
 *
 * `PostsGridBlock` renders nothing while this list is empty. To start
 * publishing, either add entries here or build the MDX authoring pipeline and
 * `/blog` routes (see docs/seo-geo-cms-plan.md — deliberately not built yet,
 * since there is no content to justify the infrastructure).
 */

export interface PostSummary {
  id: string
  title: string
  slug: string
  excerpt: string
  image: { src: string; alt: string }
  author?: string
  publishedAt: string
}

export const POSTS: PostSummary[] = []
