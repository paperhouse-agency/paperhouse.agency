# SEO/GEO via CMS — Implementation Plan

> **Status:** Planning — not yet implemented.
> **Last updated:** 2026-09-07

## Goal

Let a non-technical person manage all SEO and GEO (generative engine optimization) settings entirely through the existing `/admin` CMS — no code or file access required. Pages stay fully statically generated (no per-visitor DB read); publishing an SEO edit updates the live static page in seconds via targeted revalidation, not a full site rebuild.

## Decision: static generation + on-demand revalidation (not full rebuild)

Rejected: "CMS save → trigger full Vercel build" (`architecture-planning.md` / `cms-architecture.md` describe a Deploy Hook flow along these lines). Full rebuild works but is slow to publish (whole-site build for a one-line meta description edit) and wastes build minutes as the page count grows.

Chosen approach, aligned with Next.js 16 Cache Components already used in this stack:
- Each CMS page is rendered by a **cached** function tagged `cacheTag('page-' + slug)`.
- Saving a page in the CMS calls `revalidateTag('page-' + slug)` (or `updateTag` for the SEO author's own immediate feedback) from the save API route.
- Result: statically-served HTML for visitors and crawlers, near-instant publish, no full rebuild required. The old Deploy Hook flow (`docs/cms-architecture.md` "What Needs to Be Built Next → Publish Flow") is superseded by this and should be dropped from that doc once this ships.

## Current state (verified in codebase, 2026-09-07)

- **Storage:** Postgres (`libs/cms/db.ts`, `libs/cms/storage.ts`) — `pages` table with `seo` and `settings` as JSONB. (`docs/cms-architecture.md` is stale here — it still describes filesystem JSON + GitHub commit storage.)
- **SEO form UI:** Already built. `components/cms/page-editor.tsx` has a working `SeoTab` (meta title w/ 60-char counter, meta description w/ 160-char counter, keywords, OG image URL, noindex toggle, live Google/social previews). Data model: `CmsPageSeo` in `libs/cms/types.ts`.
- **Missing — the critical gap:** no route renders a `CmsPage` from the database. `app/(pages)/home`, `/test`, `/r3f`, `/hubspot` are hardcoded components disconnected from the `pages` table. The SEO tab currently saves data that nothing reads.
- **`libs/metadata.ts`:** `generatePageMetadata()` helper already exists (supports title/description/OG/Twitter/canonical/noindex) but has zero callers.
- **`app/robots.ts`:** one wildcard rule, no explicit AI-crawler handling (GPTBot, ClaudeBot, PerplexityBot, Google-Extended implicitly allowed under `*`, not explicit).
- **`app/sitemap.ts`:** hardcoded to homepage only, not generated from the `pages` table.
- **JSON-LD / structured data:** none anywhere in the repo.
- **No site-wide SEO/GEO settings** (org identity, default social image, AI-crawler policy) — only per-page fields exist.

## Plan

### Phase 1 — Dynamic page rendering (prerequisite, largest piece)
1. Add `app/(pages)/[slug]/page.tsx` (catch-all or single-segment, matching however `parentSlug` hierarchy is meant to resolve — confirm depth needed before choosing `[slug]` vs `[...slug]`).
2. `generateStaticParams()` reads all published slugs from `pages` (via a `'use cache'`-wrapped `listPublishedSlugs()`).
3. Page body renders via the existing `BlockRenderer` (`libs/cms/block-renderer.tsx`), fed by a cached `getPageBySlug(slug)`:
   ```ts
   async function getPageBySlug(slug: string) {
     'use cache'
     cacheTag(`page-${slug}`)
     cacheLife('max')
     return readPage(slug)
   }
   ```
4. Decide how this coexists with the existing hardcoded `app/(pages)/home` etc. — likely: those become CMS-authored pages too, or stay as special-cased routes excluded from `[slug]`. **Needs a decision before Phase 1 lands** (see Open Questions).

### Phase 2 — Wire `generateMetadata` to CMS SEO data
1. In `app/(pages)/[slug]/page.tsx`, add `generateMetadata()` calling `generatePageMetadata()` (`libs/metadata.ts`) with the page's `seo` object.
2. Confirm `generatePageMetadata()`'s existing field support covers what `CmsPageSeo` stores (title, description, keywords, ogImage, noIndex) — add canonical URL construction from slug if not already handled.

### Phase 3 — On-demand revalidation on publish
1. In `app/api/admin/pages/[id]/route.ts` (PUT handler), after a successful write with `status === 'published'`, call `revalidateTag(`page-${page.slug}`)`.
2. If slug changed (rename), revalidate both old and new tags.
3. Confirm draft saves do **not** revalidate the public tag (drafts shouldn't go live) — only publish/published-page edits do.

### Phase 4 — JSON-LD structured data
1. Add a small `JsonLd` component rendering a `<script type="application/ld+json">` from page data + site-wide settings (Organization schema at minimum; Article/BreadcrumbList per template where relevant — `CmsPageSettings.template` already distinguishes `article` etc.).
2. Render it from `app/(pages)/[slug]/page.tsx`, sourced from the same cached `getPageBySlug`.

### Phase 5 — Sitemap from CMS data
1. Rewrite `app/sitemap.ts` to query all published slugs + `updatedAt` from Postgres (cached, same tagging strategy) instead of the hardcoded single entry.

### Phase 6 — Explicit AI-crawler policy in `robots.ts`
1. Add explicit `userAgent` rules for GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot, etc., gated by a value read from the new site-wide settings (Phase 7) rather than hardcoded — so a non-technical toggle controls this.

### Phase 7 — Site-wide SEO/GEO settings screen
1. New admin screen (e.g. `/admin/settings/seo`) for fields that apply site-wide, not per-page: organization name/logo, default social share image, social profile URLs (for `sameAs` in JSON-LD), "Allow AI crawlers" toggle.
2. Storage: a new row in the existing `slots` table (already used for non-page CMS content, per `libs/cms/db.ts`) keyed e.g. `'site-seo-settings'` — no new table needed.
3. `robots.ts` (Phase 6) and the `JsonLd` component (Phase 4) both read this.

### Phase 8 — Non-technical editor UX polish (optional, do last)
1. Slug field: keep existing validation, but surface plain-language warnings ("Changing this URL may affect existing search rankings — old links will break unless redirected").
2. Add a redirect-rule mechanism if slug changes are expected to happen post-launch (out of scope until this becomes a real need — flag, don't build speculatively).

## Open questions (need answers before Phase 1 starts)

1. Do the existing hardcoded routes (`home`, `test`, `r3f`, `hubspot`) get migrated into CMS pages, or does `[slug]` only apply to *new* CMS-authored pages, coexisting with the hardcoded ones? This changes the routing structure.
2. Is page nesting (`parentSlug`) expected to produce nested URLs (`/parent/child`) or is it purely organizational (flat URLs, hierarchy shown only in the admin sidebar)? Determines `[slug]` vs `[...slug]`.
3. Who are the intended non-technical CMS users for the site-wide SEO settings screen (Phase 7) — same roles as page editors, or restricted to `super_admin`/`marketing` per the existing RBAC table in `docs/cms-architecture.md`?

## Suggested build order

Phase 1 → 2 → 3 are one connected unit (CMS pages must render before their metadata/revalidation matter) and are the highest-value, highest-effort chunk. Phases 4–7 are additive and can ship independently afterward, in any order. Phase 8 is polish, not blocking.
