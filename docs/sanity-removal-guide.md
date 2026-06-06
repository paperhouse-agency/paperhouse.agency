# Sanity CMS — Complete Sweep & Removal Guide

## Overview

This document provides an exhaustive inventory of all Sanity CMS-related code in the project and a step-by-step guide to completely remove it. The project is already migrating to a custom CMS at `/admin` (see `docs/cms-architecture.md`), so this guide aligns with Phase 1 of that migration plan.

**Total Sanity-related files:** ~56 (36 code/implementation + 20 documentation/config)
**Dependencies to remove:** 7 packages
**Environment variables to remove:** 7

---

## Section 1: Complete File Inventory

### 1.1 Core Sanity Integration (`integrations/sanity/`)

| # | File | Lines | Purpose |
|---|------|-------|---------|
| 1 | `integrations/sanity/index.ts` | ~30 | Barrel export — re-exports all public Sanity APIs |
| 2 | `integrations/sanity/client.ts` | ~30 | Sanity client creation via `createClient` from `next-sanity` |
| 3 | `integrations/sanity/env.ts` | ~30 | Environment variable configuration (projectId, dataset, tokens) |
| 4 | `integrations/sanity/fetch.ts` | ~60 | Fetch helpers with React 19 `cacheSignal` — `fetchSanity<T>()`, `fetchPage()`, etc. |
| 5 | `integrations/sanity/sanity.cli.ts` | ~15 | Sanity CLI config — `defineCliConfig` with project ID, dataset, alias |
| 6 | `integrations/sanity/sanity.config.ts` | ~80 | Sanity Studio config — `defineConfig`, presentation tool, structure tool, vision |
| 7 | `integrations/sanity/sanity.types.ts` | ~273 | Auto-generated TypeScript types from Sanity TypeGen |
| 8 | `integrations/sanity/schema.json` | ~1460 | Auto-generated Sanity schema JSON |
| 9 | `integrations/sanity/structure.ts` | ~30 | Studio content list structure builder |
| 10 | `integrations/sanity/README.md` | ~990 | Comprehensive Sanity CMS documentation |

### 1.2 Sanity Schema Types

| # | File | Purpose |
|---|------|---------|
| 11 | `integrations/sanity/schemaTypes/index.ts` | Schema type registry — exports all document/object types |
| 12 | `integrations/sanity/schemaTypes/documents/page.ts` | `page` document type |
| 13 | `integrations/sanity/schemaTypes/documents/article.ts` | `article` document type |
| 14 | `integrations/sanity/schemaTypes/documents/example.ts` | `example` document type (not registered) |
| 15 | `integrations/sanity/schemaTypes/objects/richText.ts` | `richText` object type (portable text) |
| 16 | `integrations/sanity/schemaTypes/objects/link.ts` | `link` object type (internal/external) |
| 17 | `integrations/sanity/schemaTypes/objects/metadata.ts` | `metadata` object type (SEO fields) |
| 18 | `integrations/sanity/schemaTypes/singletons/navigation.ts` | `navigation` singleton (not registered) |

### 1.3 Sanity Queries

| # | File | Purpose |
|---|------|---------|
| 19 | `integrations/sanity/queries/index.ts` | GROQ queries — `pageQuery`, `pageByIdQuery`, `articleQuery`, `allArticlesQuery`, `articleByIdQuery` |

### 1.4 Sanity Live / Data Fetching

| # | File | Purpose |
|---|------|---------|
| 20 | `integrations/sanity/live/index.tsx` | `defineLive` setup — `sanityFetch` and `SanityLive` |

### 1.5 Sanity Components

| # | File | Purpose |
|---|------|---------|
| 21 | `integrations/sanity/components/rich-text.tsx` | Portable text renderer via `@portabletext/react` |
| 22 | `integrations/sanity/components/context.tsx` | Sanity context provider + `useSanityContext` hook |
| 23 | `integrations/sanity/components/disable-draft-mode.tsx` | Draft mode disable button |

### 1.6 Sanity Utilities

| # | File | Purpose |
|---|------|---------|
| 24 | `integrations/sanity/utils/image.ts` | `urlForImage` — builds image URLs via `@sanity/image-url` |
| 25 | `integrations/sanity/utils/link.ts` | Link resolution — `urlForReference()`, `getLinkAttributes()` |

### 1.7 App Pages & Routes (Consuming Sanity)

| # | File | Purpose |
|---|------|---------|
| 26 | `app/(pages)/sanity/page.tsx` | `/sanity` route — fetches Sanity page and renders tutorial |
| 27 | `app/(pages)/sanity/[slug]/page.tsx` | `/sanity/[slug]` route — fetches Sanity article |
| 28 | `app/(pages)/sanity/(component)/tutorial/index.tsx` | `SanityTutorial` component — renders page data with `data-sanity` attrs |
| 29 | `app/(pages)/sanity/[slug]/(component)/article/index.tsx` | `SanityArticle` component — renders article data |
| 30 | `app/studio/[[...tool]]/page.tsx` | `/studio` route — Sanity Studio mount via `NextStudio` |
| 31 | `app/api/draft-mode/enable/route.ts` | Draft mode enable route |
| 32 | `app/api/revalidate/route.ts` | Webhook revalidation for Sanity cache tags |

### 1.8 Shared Files Importing Sanity

| # | File | Line(s) | What it imports |
|---|------|---------|-----------------|
| 33 | `app/layout.tsx` | 3, 7, 13, 14 | `VisualEditing`, `DisableDraftMode`, `isSanityConfigured`, `SanityLive` |
| 34 | `app/sitemap.ts` | 2, 20, 21 | `isSanityConfigured`, dynamic `import('@/integrations/sanity')`, `groq` |
| 35 | `app/robots.ts` | 11 | Disallows `/studio/` and `/api/draft-mode/` |
| 36 | `libs/metadata.ts` | 143–184 | `generateSanityMetadata()` helper for Sanity document metadata |
| 37 | `libs/validate-env.ts` | 22–46 | 4 Sanity env var entries: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SANITY_API_WRITE_TOKEN` |
| 38 | `libs/cleanup-integrations.ts` | 17–21, 43 | Sanity removal guide in `REMOVAL_GUIDE` object |
| 39 | `integrations/check-integration.ts` | 22–27 | `isSanityConfigured()` function |
| 40 | `integrations/README.md` | 9, 23–34, 58–62, 107–121, 134–148 | Multiple Sanity references + removal instructions |
| 41 | `components/sanity-image/index.tsx` | 1–37 | `SanityImage` component using `@sanity/asset-utils` and `urlForImage` |
| 42 | `next.config.ts` | 102–105 | `cdn.sanity.io` in `images.remotePatterns` |
| 43 | `app/(pages)/test/sections/data-fetching-test.tsx` | 3–18 | Checks Sanity configuration status using `isSanityConfigured()` |

### 1.9 Documentation & Config Files Referencing Sanity

| # | File | What it references |
|---|------|--------------------|
| 44 | `docs/cms-architecture.md` | Entire document — defines Sanity removal in migration plan |
| 45 | `docs/architecture-planning.md` | TODO: "Clean up sanity codes" |
| 46 | `.claude/rules/integrations.mdc` | Extensive Sanity coding rules (schema, queries, visual editing, TypeGen) |
| 47 | `.claude/rules/architecture.mdc` | References `SANITY_API_TOKEN` in env validation example |
| 48 | `.claude/rules/README.md` | Mentions `sanity-opinionated.mdc` former rule file |
| 49 | `.claude/README.md` | Mentions `bun sanity:typegen` CLI command |
| 50 | `CLAUDE.md` | Extensive Sanity references — patterns, env vars, commands, code examples |
| 51 | `README.md` | Lists `sanity/` in directory structure |
| 52 | `PROD-README.md` | Lists Sanity env vars |
| 53 | `app/README.md` | Lists `sanity/` under pages |
| 54 | `app/(pages)/test/README.md` | References `integrations/sanity/fetch.ts` |
| 55 | `libs/README.md` | References `sanityFetch`, `pageQuery`, `getRemovalGuide('Sanity')` |
| 56 | `package.json` | Sanity npm scripts + 7 Sanity dependencies |

---

## Section 2: Dependencies to Remove

### npm Packages (from `package.json`)

| Package | Section | Purpose |
|---------|---------|---------|
| `@sanity/asset-utils` | dependencies | Image dimension extraction |
| `@sanity/image-url` | dependencies | Sanity image URL builder |
| `@sanity/visual-editing` | dependencies | Visual editing overlay in draft mode |
| `@portabletext/react` | dependencies | Portable text → React rendering |
| `next-sanity` | dependencies | Sanity client, live, studio integration |
| `sanity` | devDependencies | Sanity Studio & CLI |
| `@sanity/vision` | devDependencies | Sanity Vision tool (GROQ playground) |

### npm Scripts (from `package.json`)

| Script | Command |
|--------|---------|
| `sanity:schema-extract` | `cd integrations/sanity && dotenv -e ../../.env.local -- sanity schema extract` |
| `sanity:typegen` | `cd integrations/sanity && dotenv -e ../../.env.local -- sanity typegen generate && ../../node_modules/.bin/biome check --write --unsafe` |
| `setup:sanity-mcp` | Copies Sanity MCP install link to clipboard |

---

## Section 3: Environment Variables to Remove

### From `.env.local`, `.env.example`, and Vercel

| Variable | Used In |
|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `env.ts`, `sanity.config.ts`, `sanity.cli.ts`, `client.ts`, `check-integration.ts`, `validate-env.ts`, docs |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `env.ts`, `sanity.config.ts`, docs |
| `NEXT_PUBLIC_SANITY_DATASET` | `env.ts`, `sanity.config.ts`, `sanity.cli.ts`, `client.ts`, `check-integration.ts`, `validate-env.ts`, docs |
| `NEXT_PUBLIC_SANITY_API_READ_TOKEN` | `env.ts`, docs |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `validate-env.ts`, docs |
| `SANITY_PRIVATE_TOKEN` | `env.ts` |
| `SANITY_API_WRITE_TOKEN` / `SANITY_API_WRITE_TOKEN` | `validate-env.ts`, docs |

---

## Section 4: Step-by-Step Removal Guide

### Phase 1: Delete Directories

```bash
# Core Sanity integration
rm -rf integrations/sanity/

# Sanity Studio route
rm -rf app/studio/

# Sanity draft-mode API
rm -rf app/api/draft-mode/

# Sanity revalidation webhook
rm -rf app/api/revalidate/

# Sanity demo pages
rm -rf app/(pages)/sanity/

# Sanity image component
rm -rf components/sanity-image/
```

### Phase 2: Update Core Files

#### 2.1 `app/layout.tsx`

Remove these imports:
- `import { VisualEditing } from 'next-sanity/visual-editing'` (line 3)
- `import { DisableDraftMode } from '@/integrations/sanity/components/disable-draft-mode'` (line 7)
- `import { isSanityConfigured } from '@/integrations/check-integration'` (line 13)
- `import { SanityLive } from '@/integrations/sanity/live'` (line 14)

Remove these lines inside the component:
- `const sanityConfigured = isSanityConfigured()` (line 87)
- The entire block `{sanityConfigured && isDraftMode && ( <> <VisualEditing /> <DisableDraftMode /> <SanityLive /> </> )}` (lines 116–122)

Simplify the `ReactTempus` line: `patch={!isDraftMode}` → remove `patch` prop or set to `true`.

#### 2.2 `integrations/check-integration.ts`

Remove the `isSanityConfigured()` function (lines 22–27) and remove `'Sanity'` from `getConfiguredIntegrations()` (line 68) and `getUnconfiguredIntegrations()` (line 81).

#### 2.3 `libs/validate-env.ts`

Remove the Sanity env var entries block (lines 22–46): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SANITY_API_WRITE_TOKEN`.

#### 2.4 `libs/cleanup-integrations.ts`

Remove the Sanity entry from `REMOVAL_GUIDE` (lines 17–21).

#### 2.5 `libs/metadata.ts`

Remove the `generateSanityMetadata()` function (lines 143–184). The `generatePageMetadata()` function can remain — it's generic and useful for the custom CMS.

#### 2.6 `next.config.ts`

Remove `cdn.sanity.io` from `images.remotePatterns` (lines 102–105).

```diff
-      {
-        protocol: 'https',
-        hostname: 'cdn.sanity.io',
-      },
```

#### 2.7 `app/sitemap.ts`

Remove the Sanity sitemap generation block (lines 18–77). Keep only the base routes.

```diff
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes = [
    { url: APP_BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  ]

-  // Only fetch Sanity pages if Sanity is configured
-  if (isSanityConfigured()) {
-    // ... entire Sanity block
-  }

  return baseRoutes
}
```

Also remove the `import { isSanityConfigured }` line.

#### 2.8 `app/robots.ts`

Remove `/studio/` and `/api/draft-mode/` from the disallow list:

```diff
- disallow: ['/studio/', '/api/draft-mode/'],
+ disallow: [],
```

#### 2.9 `app/(pages)/test/sections/data-fetching-test.tsx`

Remove the Sanity status section (or the entire component if it's only for Sanity testing).

#### 2.10 `integrations/README.md`

Remove all Sanity-related sections:
- Sanity entry in the integrations list (line 9)
- Entire "Sanity Integration" example block (lines 23–34)
- Sanity env vars in the env vars section (lines 58–62)
- Sanity references in conditional loading example (lines 107–121)
- Entire Sanity removal subsection (lines 134–148)
- Remove Sanity from bundle size table (lines 198–204)

### Phase 3: Update package.json

#### 3.1 Remove npm scripts

```diff
-    "sanity:schema-extract": "cd integrations/sanity && dotenv -e ../../.env.local -- sanity schema extract",
-    "sanity:typegen": "cd integrations/sanity && dotenv -e ../../.env.local -- sanity typegen generate && ../../node_modules/.bin/biome check --write --unsafe",
-    "setup:sanity-mcp": "echo -n 'cursor://anysphere.cursor-deeplink/mcp/install?name=Sanity&config=eyJ1cmwiOiJodHRwczovL21jcC5zYW5pdHkuaW8iLCJ0eXBlIjoiaHR0cCJ9Cg==' | pbcopy && echo 'Link copied to clipboard (without newline)' && echo 'Paste this in Cursor or browser address bar'",
```

#### 3.2 Remove dependencies

```bash
bun remove \
  @sanity/asset-utils \
  @sanity/image-url \
  @sanity/visual-editing \
  @portabletext/react \
  next-sanity \
  sanity \
  @sanity/vision
```

### Phase 4: Clean Up Environment Files

#### 4.1 `.env.local`

Remove all Sanity variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_READ_TOKEN`
- `SANITY_PRIVATE_TOKEN`

#### 4.2 `.env.example`

Remove all Sanity variables (lines 17–21):
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_READ_TOKEN`
- `SANITY_PRIVATE_TOKEN`

### Phase 5: Update Claude Rules & Documentation

#### 5.1 `.claude/rules/integrations.mdc`

Remove all Sanity-specific sections (schema patterns, GROQ query conventions, visual editing, TypeGen usage, image optimization with `@sanity/image-url`).

#### 5.2 `.claude/rules/architecture.mdc`

Replace `SANITY_API_TOKEN` reference with the equivalent custom CMS env var if applicable.

#### 5.3 `.claude/rules/README.md`

Remove any reference to `sanity-opinionated.mdc`.

#### 5.4 `.claude/README.md`

Remove mention of `bun sanity:typegen`.

#### 5.5 `CLAUDE.md`

Remove all Sanity references:
- Schema patterns section
- GROQ query conventions (`defineQuery`, `SCREAMING_SNAKE_CASE`)
- Sanity env vars list
- Sanity commands (`sanity:schema-extract`, `sanity:typegen`)
- Sanity code examples in "Critical Rules" section

#### 5.6 `README.md`

Remove `sanity/` from integrations directory listing.

#### 5.7 `PROD-README.md`

Remove Sanity env vars from production deployment notes.

#### 5.8 `app/README.md`

Remove `sanity/` from pages listing.

#### 5.9 `app/(pages)/test/README.md`

Remove reference to `integrations/sanity/fetch.ts`.

#### 5.10 `libs/README.md`

Remove references to `sanityFetch`, `pageQuery`, `getRemovalGuide('Sanity')`.

#### 5.11 `docs/cms-architecture.md`

Already documents the migration — update Phase 1 as completed, remove the "Files/Directories to delete" section if cleanup is done.

#### 5.12 `docs/architecture-planning.md`

Remove the "Clean up sanity codes" TODO item.

### Phase 6: Verify Removal

```bash
# Check for any remaining Sanity references in code
rg -i "sanity" --include '*.ts' --include '*.tsx' --include '*.mdc' --include '*.md'

# Check for remaining @sanity/* or next-sanity imports
rg "@sanity/" --include '*.ts' --include '*.tsx'
rg "next-sanity" --include '*.ts' --include '*.tsx'
rg "portabletext" --include '*.ts' --include '*.tsx'
rg "groq" --include '*.ts' --include '*.tsx'

# Type check
bun typecheck

# Lint
bun lint

# Build
bun build
```

---

## Section 5: Summary of All Changes

| Category | Count | Details |
|----------|-------|---------|
| **Directories deleted** | 5 | `integrations/sanity/`, `app/studio/`, `app/api/draft-mode/`, `app/api/revalidate/`, `app/(pages)/sanity/`, `components/sanity-image/` |
| **Files deleted** | ~30 | All files in the above directories |
| **Files modified** | 15+ | `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `integrations/check-integration.ts`, `libs/validate-env.ts`, `libs/cleanup-integrations.ts`, `libs/metadata.ts`, `next.config.ts`, `package.json`, `.env.local`, `.env.example`, `integrations/README.md`, test files |
| **Documentation files updated** | 12+ | `.claude/rules/integrations.mdc`, `.claude/rules/architecture.mdc`, `.claude/rules/README.md`, `.claude/README.md`, `CLAUDE.md`, `README.md`, `PROD-README.md`, `app/README.md`, `test/README.md`, `libs/README.md`, `docs/cms-architecture.md`, `docs/architecture-planning.md` |
| **npm packages removed** | 7 | `@sanity/asset-utils`, `@sanity/image-url`, `@sanity/visual-editing`, `@portabletext/react`, `next-sanity`, `sanity`, `@sanity/vision` |
| **npm scripts removed** | 3 | `sanity:schema-extract`, `sanity:typegen`, `setup:sanity-mcp` |
| **Env vars removed** | 7 | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SANITY_PRIVATE_TOKEN`, `SANITY_API_WRITE_TOKEN` |
