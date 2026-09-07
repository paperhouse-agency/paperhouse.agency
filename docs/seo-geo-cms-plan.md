# SEO/GEO via HQ — Implementation Plan

> **Status:** All phases implemented. The in-repo CMS is retired; navigation and posts are now static code.
> **Last updated:** 2026-09-07
> **Supersedes:** the earlier version of this plan (dynamic `[slug]` CMS page rendering). That approach is dropped — see Decisions below.

## What shipped

| Change | Files |
|---|---|
| `/home` moved to `/` (rewrite hack removed, 301 kept) | `app/(pages)/page.tsx`, `app/(pages)/home-content.tsx`, `next.config.ts` |
| Route registry (code-defined public routes) | `libs/seo/routes.ts` |
| Cached, fail-soft SEO readers | `libs/seo/queries.ts`, `libs/seo/types.ts` |
| Metadata builder (DB over in-code defaults) | `libs/seo/metadata.ts` |
| `generateMetadata` on `/` | `app/(pages)/page.tsx` |
| JSON-LD (Organization + per-page overrides) | `components/seo/json-ld.tsx` |
| Sitemap from route registry + DB enrichment | `app/sitemap.ts` |
| robots.txt with HQ-controlled AI-crawler policy | `app/robots.ts` |
| Revalidation endpoint for HQ | `app/api/revalidate/route.ts` |
| Route discovery for HQ | `app/api/routes/route.ts` |
| Demo routes marked noindex | `app/(pages)/hubspot/page.tsx`, `app/(pages)/r3f/page.tsx` |

`bun typecheck` passes and `bun run build` succeeds with `/` prerendered as static (`○`).

**Note:** `cacheComponents: true` was already enabled in `next.config.ts` — `'use cache'` is an established pattern in this repo, not a new migration.

### Still required before this works end to end

1. **HQ must create the `page_seo` and `site_seo` tables** (schema below) and write to them. Until then every read fails soft and the site serves the in-code defaults from `libs/seo/routes.ts`.
2. **Set `REVALIDATE_SECRET`** in both this app and HQ.
3. **HQ must call `POST /api/revalidate`** after each save, and surface failures to the editor.

## Decisions (settled)

1. **Content is code.** Page content/blocks are hardcoded React components in this repo. Changing content = a developer edit + git push + Vercel rebuild. No database-driven page rendering, no `[slug]` route, no block editor.
2. **HQ owns SEO/GEO.** `hq.paperhouse.agency` (existing app, Cognito auth, Vercel-hosted) is where non-technical marketing users edit SEO/GEO. It writes to the shared Neon Postgres database.
3. **This repo is a read-only consumer.** The site reads SEO/GEO from Neon at metadata-generation time, cached, and exposes a protected revalidation endpoint HQ calls after a save.
4. **SEO edits must NOT require a rebuild.** This is the whole point — marketing changes metadata whenever they want, and it goes live in seconds via cache invalidation, with no developer or deploy involved. (Content changes *do* require a rebuild; SEO changes do not.)
5. **Retire the in-repo `/admin` CMS.** ~47 files across `app/admin/`, `components/cms/`, `libs/cms/` become dead code once HQ takes over.

## Why this works

| Concern | How it's handled |
|---|---|
| Crawlers must not see the CMS | HQ is a separate app on a separate subdomain behind Cognito — unreachable by crawlers. Nothing to block. |
| UI framework isolation (HeroUI) | HQ is a physically separate codebase. Use HeroUI there freely; zero impact on this repo's styles or bundle. No Tailwind scoping tricks needed. |
| Cost efficiency | Site pages are static/cached; SEO reads hit Neon only on cache regeneration (after a publish), never per visitor. |
| "LiteSpeed-style" caching | `'use cache'` + `cacheTag` on the SEO read, purged on publish via `revalidateTag` — full-page cache with instant targeted purge. |
| Marketing autonomy | SEO/GEO edits go live without a deploy. |

## Architecture

```
HQ (hq.paperhouse.agency, Cognito)          Site (paperhouse.agency, Vercel)
  │                                            │
  │ 1. marketing edits SEO ──> Neon Postgres <──── 3. cached read on regeneration
  │                                            │      ('use cache' + cacheTag)
  └─ 2. POST /api/revalidate (shared secret) ─>┘   4. revalidateTag('seo-<slug>')
```

Per-request path for a visitor/crawler: cached HTML, zero DB calls. DB is touched only on the first request after a publish.

## Data model (HQ owns schema)

The current `pages` table (`libs/cms/db.ts`) carries a `blocks` JSONB column that is no longer needed — content is code now. Recommend a slimmer, purpose-built shape owned and migrated by HQ:

```sql
-- one row per public route
page_seo (
  slug        TEXT PRIMARY KEY,   -- route path, e.g. '/', '/home', '/services'
  title       TEXT,
  description TEXT,
  keywords    TEXT[],
  og_image    TEXT,
  no_index    BOOLEAN DEFAULT false,
  json_ld     JSONB,              -- optional per-page structured-data overrides
  updated_at  TIMESTAMPTZ NOT NULL
)

-- singleton row for site-wide GEO/SEO settings
site_seo (
  id          TEXT PRIMARY KEY,   -- always 'default'
  org_name    TEXT,
  org_logo    TEXT,
  social_urls JSONB,              -- for JSON-LD sameAs
  default_og  TEXT,
  allow_ai_crawlers BOOLEAN DEFAULT true,
  updated_at  TIMESTAMPTZ NOT NULL
)
```

**Schema ownership rule:** HQ owns migrations. This repo must NOT create or alter tables — the runtime `CREATE TABLE IF NOT EXISTS` in `libs/cms/db.ts` (`ensureSchema()`) must be removed so two apps can't drift.

## Plan

### Phase 1 — Site reads SEO from Neon (core)
1. Add a read-only DB module in this repo (e.g. `libs/seo/db.ts`) — connection only, no schema creation. Reuses existing `POSTGRES_URL` env var (already set).
2. Add cached readers:
   ```ts
   async function getPageSeo(slug: string) {
     'use cache'
     cacheTag(`seo-${slug}`)
     cacheLife('max')
     return sql`SELECT * FROM page_seo WHERE slug = ${slug}`
   }

   async function getSiteSeo() {
     'use cache'
     cacheTag('seo-site')
     cacheLife('max')
     return sql`SELECT * FROM site_seo WHERE id = 'default'`
   }
   ```
3. Add `generateMetadata()` to each existing hardcoded route (`app/(pages)/home`, `/hubspot`, `/r3f`, `/test`), calling `getPageSeo('<route>')` and feeding the existing `generatePageMetadata()` helper in `libs/metadata.ts` (already written, currently zero callers). Fall back to sensible in-code defaults when a row is missing, so a page never ships blank metadata.

### Phase 2 — Revalidation endpoint (makes edits go live without a rebuild)
1. Add `POST /api/revalidate` in this repo:
   - Authenticate with a shared secret (`REVALIDATE_SECRET` env var on both apps) or Vercel OIDC.
   - Body: `{ slug }` or `{ scope: 'site' }`.
   - Calls `revalidateTag('seo-' + slug)` / `revalidateTag('seo-site')`.
   - Reject unauthenticated requests; rate-limit.
2. In HQ, call this endpoint after a successful SEO save. Surface failures in the HQ UI — a silent failure means marketing thinks it published when it didn't.

### Phase 3 — JSON-LD structured data
1. Add a `JsonLd` component rendering `<script type="application/ld+json">`.
2. Source Organization schema from `site_seo`; per-page overrides from `page_seo.json_ld`.
3. Render from each route, using the same cached readers (no extra DB cost).

### Phase 4 — Sitemap
1. Rewrite `app/sitemap.ts` (currently hardcoded to the base URL only).
2. Route list comes from **code** (content is code — the set of routes is not DB-driven). Enrich each entry from `page_seo`: exclude `no_index` rows, use `updated_at` for `lastModified`.
3. Wrap the DB read in `'use cache'` + `cacheTag('seo-sitemap')`; revalidate it alongside page tags on publish.

### Phase 5 — robots.txt + AI crawler policy
1. Add explicit rules for GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot, driven by `site_seo.allow_ai_crawlers` so marketing controls it from HQ.
2. Add `disallow: ['/admin/', '/api/admin/']` while those routes still exist (see Phase 6). **Currently missing — `/admin` is not blocked from indexing today.**
3. Cache with `cacheTag('seo-site')`.

### Phase 6 — Retire the in-repo CMS ✅ DONE

The CMS was not only an editing surface — the live site read runtime content from it. Both dependencies were migrated to static code first (decision: content is code for navigation and posts alike):

| Was | Now |
|---|---|
| Navigation from `slots` table via `getNavigation()` | `content/navigation.ts` — the 4 header items were copied out of Neon verbatim |
| Posts from the `pages` table via `listPublishedPosts()` + `/api/posts` | `content/posts.ts` — a typed static list |
| `cmsSchema` exports in all 16 `blocks/*.tsx` | Removed (dead once the editor was gone), along with the whole `BlockData`/`BlockSchema` type surface |
| Admin auth gate in `proxy.ts` | Removed; `proxy.ts` now only handles maintenance mode |

**Nothing was lost in the posts migration: the `pages` table held exactly one row (the homepage, slug `index`), and `listPublishedPosts()` excluded it — so the posts grid was already rendering zero posts.** `PostsGridBlock` returns `null` on an empty list, so the homepage is unchanged.

Deleted: `app/admin/**`, `components/cms/**`, `libs/cms/**`, `app/api/admin/**`, `app/api/posts/**`.
Removed dependencies: `iron-session`, `otplib`, `bcryptjs`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@vercel/blob` (20 packages).
Removed env vars: `CMS_SESSION_SECRET`, `ROOT_USER_ID`, `ROOT_USER_PASS`, `BLOB_READ_WRITE_TOKEN`.

`docs/cms-architecture.md` is now historical and describes a system that no longer exists — delete it or mark it as such.

## HQ integration contract

Everything the HQ side needs:

**1. Create the tables** (schema above) and write to them from HQ's SEO editor.

**2. Slug convention:** `page_seo.slug` stores the **route path** verbatim — `/` for the homepage. Get the valid list from `GET /api/routes`; the site rejects unknown slugs on revalidate.

**3. Set `REVALIDATE_SECRET`** to the same value in both apps.

**4. After every successful save, call:**
```
POST https://paperhouse.agency/api/revalidate
  authorization: Bearer $REVALIDATE_SECRET
  content-type: application/json

  {"slug": "/"}          # after a page SEO save
  {"scope": "site"}      # after a site-wide settings save
```
→ `200 {"revalidated": [...], "at": "..."}` · `401` bad secret · `400` unknown slug/bad body · `503` secret not configured.

**Surface failures to the editor** — a silent failure means marketing believes it published when the live site still serves the old metadata.

**5. Discover editable routes:**
```
GET https://paperhouse.agency/api/routes
  authorization: Bearer $REVALIDATE_SECRET
```
→ `{"routes":[{"slug","label","sitemap","defaults":{"title","description"}}]}`

**6. SEO form fields to build in HQ:** meta title (60-char counter), meta description (160-char counter), keywords, OG image URL, noindex toggle, plus site-wide: org name/logo, social URLs, default OG image, and the **allow AI crawlers** toggle (drives robots.txt). The retired `SeoTab` from the old editor — including its live Google/social previews — is in git history at `components/cms/page-editor.tsx` if you want it as a reference.

**Note on titles:** HQ-set titles bypass the root layout's `%s - PaperHouse` template and render exactly as typed, so the character counter is truthful.

## Open items

1. **Nav links to routes that don't exist** — the header links `/about`, `/blog`, `/contact`, none of which are routes. They 404 today (this predates these changes). Either build the pages or trim `content/navigation.ts`.
2. **Blog/MDX pipeline not built** — deliberately. There were zero posts, so an MDX authoring setup and `/blog` routes would have been speculative infrastructure. `content/posts.ts` holds the shape; build the pipeline when there is content to publish.
3. **Preview/staging** — marketing cannot preview SEO changes before publishing. Add only if wanted.
4. **`docs/cms-architecture.md`** still documents the removed CMS — delete or mark historical.
