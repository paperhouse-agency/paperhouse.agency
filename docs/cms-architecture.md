# CMS Architecture — paperhouse.agency

## Overview

A custom CMS built natively into the Next.js 16 app that replaces Sanity CMS entirely. It lives at `/admin`, stores content as JSON via Vercel Blob, uses `iron-session` for encrypted cookie sessions with TOTP second-factor auth, supports multi-user roles, and publishes the site by triggering a Vercel Deploy Hook.

---

## Tech Stack Additions

| Package | Purpose |
|---------|---------|
| `@vercel/blob` | JSON page storage + image uploads |
| `iron-session` | Encrypted HTTP-only cookie sessions |
| `otplib` | TOTP second-factor generation & verification |
| `bcryptjs` | Password hashing |
| `@dnd-kit/core` | Drag-and-drop core |
| `@dnd-kit/sortable` | Sortable list primitives |
| `@dnd-kit/utilities` | DnD helpers |

**Remove:** `sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/asset-utils`, `@sanity/visual-editing`, `@portabletext/react`, `@sanity/vision`

---

## Environment Variables

```env
# New — add to .env.local and Vercel project settings
CMS_SESSION_SECRET=<random 32+ chars>        # iron-session AES-256-GCM key
BLOB_READ_WRITE_TOKEN=<vercel blob token>    # from Vercel Storage dashboard
VERCEL_DEPLOY_HOOK_URL=<deploy hook URL>     # from Vercel Project Settings > Git
VERCEL_ACCESS_TOKEN=<vercel api token>       # for deploy status polling

# Remove
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
NEXT_PUBLIC_SANITY_API_READ_TOKEN
NEXT_PUBLIC_SANITY_STUDIO_URL
SANITY_PRIVATE_TOKEN
SANITY_API_WRITE_TOKEN
DRAFT_MODE_TOKEN
SANITY_REVALIDATE_SECRET
```

Admin user credentials are stored in `content/users.json` (private Vercel Blob) — not env vars — to support multiple users.

---

## Data Model

### User & Session

```typescript
type UserRole = 'super_admin' | 'marketing' | 'editor'

interface CmsUser {
  id: string
  email: string
  name: string
  role: UserRole
  passwordHash: string   // bcrypt cost 12
  totpSecret: string     // base32, generated at account creation
  totpEnrolled: boolean  // false until user completes first TOTP login
  createdAt: string
  updatedAt: string
}

interface AdminSession {
  isLoggedIn: boolean
  userId?: string
  role?: UserRole
  pendingTotpUserId?: string  // set after password passes, cleared after TOTP
}
```

### Role Permissions

| Action | SuperAdmin | Marketing | Editor |
|--------|-----------|-----------|--------|
| Create pages | ✅ | ✅ | ❌ |
| Edit pages | ✅ | ✅ | ✅ |
| Delete pages | ✅ | ❌ | ❌ |
| Publish | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

### Page & Blocks

```typescript
interface CmsPage {
  id: string             // UUID
  title: string
  slug: string           // URL-safe, unique (e.g. 'about-us')
  status: 'draft' | 'published'
  seo: CmsPageSeo
  blocks: BlockData[]
  createdAt: string      // ISO timestamp
  updatedAt: string
}

interface CmsPageSeo {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: CmsImage
  noIndex?: boolean
}

interface CmsImage { src: string; alt: string }

type LucideIconName = string  // stored as string, resolved to component at render time

type BlockType =
  | 'bento-stats' | 'card-grid' | 'feature-cards' | 'form-cta'
  | 'image-content-cards' | 'image-text-split' | 'newsletter'
  | 'numbered-steps' | 'people-grid' | 'split-hero' | 'section'

interface BaseBlockData {
  _id: string      // UUID for React key + DnD
  _type: BlockType
}
```

### Block Data Interfaces

```typescript
interface BentoStatsBlockData extends BaseBlockData {
  _type: 'bento-stats'
  preheadingContent?: string
  metrics: {
    large:  { value: string; heading: string; content: string }
    image1: CmsImage
    medium: { value: string; heading: string; content: string }
    small:  { value: string; heading: string; content: string }
    image2: CmsImage
  }
}

interface CardGridBlockData extends BaseBlockData {
  _type: 'card-grid'
  preheadingContent?: string
  headingContent: string
  bodyContent?: string
  articles: Array<{ image: CmsImage; heading: string; content: string; ctaUrl?: string }>
}

interface FeatureCardsBlockData extends BaseBlockData {
  _type: 'feature-cards'
  headingContent: string
  bodyContent?: string
  cards: Array<{ label: string; heading: string; content: string; ctaLabel: string; ctaUrl?: string; image: CmsImage }>
}

interface FormCtaBlockData extends BaseBlockData {
  _type: 'form-cta'
  headingLine1?: string
  headingLine2?: string
  bodyContent?: string
  // Note: contact form is a hardcoded server action — not CMS-editable
}

interface ImageContentCardsBlockData extends BaseBlockData {
  _type: 'image-content-cards'
  preheadingContent?: string
  headingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  headingContent: string
  bodyContent?: string
  buttons?: Array<{ label: string; size?: 'sm'|'md'|'lg'; color?: 'primary'|'secondary'|'neutral'; hasIcon?: boolean; url?: string }>
  cards: Array<{ icon: LucideIconName; heading: string; content: string; alternate?: boolean }>
  image: CmsImage
}

interface ImageTextSplitBlockData extends BaseBlockData {
  _type: 'image-text-split'
  image?: CmsImage
  heading?: string
  bodyContent?: string
  ctaLabel?: string
  ctaUrl?: string
}

interface NewsletterBlockData extends BaseBlockData {
  _type: 'newsletter'
  preheadingContent?: string
  headingContent?: string
  bodyContent?: string
  // Note: HubSpot form is hardcoded — not CMS-editable
}

interface NumberedStepsBlockData extends BaseBlockData {
  _type: 'numbered-steps'
  preheadingContent?: string
  headingContent: string
  bodyContent: string
  steps: Array<{ icon: LucideIconName; number: string; heading: string; content: string; alternate?: boolean }>
}

interface PeopleGridBlockData extends BaseBlockData {
  _type: 'people-grid'
  preheadingContent?: string
  headingContent: string
  bodyContent?: string
  members: Array<{ name: string; role: string; image: CmsImage; ctaUrl?: string }>
}

interface SplitHeroBlockData extends BaseBlockData {
  _type: 'split-hero'
  headingContent?: string
  bodyContent?: string
  videoUrl?: string
  videoPosterImage?: CmsImage
  buttons?: Array<{ label: string; size?: 'sm'|'md'|'lg'; color?: 'primary'|'secondary'|'neutral'; hasIcon?: boolean; url?: string }>
}

// Wrapper block — contains nested blocks
interface SectionBlockData extends BaseBlockData {
  _type: 'section'
  backgroundColor?: 'offwhite' | 'bluishgray' | 'white' | 'text'
  paddingSize?: 'none' | 'sm' | 'md' | 'lg'
  children: BlockData[]
}

type BlockData =
  | BentoStatsBlockData | CardGridBlockData | FeatureCardsBlockData
  | FormCtaBlockData | ImageContentCardsBlockData | ImageTextSplitBlockData
  | NewsletterBlockData | NumberedStepsBlockData | PeopleGridBlockData
  | SplitHeroBlockData | SectionBlockData
```

### Vercel Blob Storage Layout

```
content/users.json                 ← CmsUser[]          (access: private)
content/pages.json                 ← CmsPageMeta[]      (access: public — needed for SSG)
content/pages/{id}.json            ← Full CmsPage       (access: public — needed for SSG)
cms-uploads/{uuid}.{ext}           ← Uploaded images    (access: public)
```

---

## File Structure

### New Files to Create

```
libs/
  cms/
    types.ts                       ← All CMS TypeScript interfaces (central source of truth)
    storage.ts                     ← Vercel Blob read/write helpers
    resolve-icon.ts                ← LucideIconName string → LucideIcon component
    block-registry.ts              ← Block manifest: schema, labels, defaults for all 11 blocks
    block-renderer.tsx             ← Frontend renderer: maps _type → block component
    editor-store.ts                ← Zustand store for editor state (client-side)
    auth/
      session-config.ts            ← iron-session options (Edge-safe, no next/headers)
      session.ts                   ← getSession() helper using next/headers
      rate-limit.ts                ← In-memory IP rate limiter (5 req / 15 min)
      totp.ts                      ← verifyTotp(), generateTotpSecret(), getTotpUri()
      credentials.ts               ← verifyPassword(), findUserByEmail(), getUserById()
      permissions.ts               ← canPerform(role, action) RBAC helper

middleware.ts                      ← Edge middleware: protects /admin/** and /api/admin/**

blocks/
  section-block.tsx                ← New wrapper block (backgroundColor, paddingSize, children)

app/
  admin/
    layout.tsx                     ← Bare admin shell (no site nav/footer/Lenis/GSAP)
    login/
      page.tsx                     ← Step 1: email + password form
      totp/
        page.tsx                   ← Step 2: TOTP code + first-time QR enrollment
    pages/
      page.tsx                     ← Page list table
      new/
        page.tsx                   ← Create page (title, slug)
      [id]/
        page.tsx                   ← Block builder editor
    users/
      page.tsx                     ← User list (SuperAdmin only)
      new/
        page.tsx                   ← Create user
      [id]/
        page.tsx                   ← Edit user / reset TOTP
    settings/
      page.tsx                     ← Placeholder
    (components)/
      admin-layout.tsx             ← Top nav: logo, pages, users (SA only), logout
      block-palette.tsx            ← Left sidebar: draggable block type tiles
      block-canvas.tsx             ← Center: @dnd-kit/sortable block list
      block-editor.tsx             ← Right panel: prop forms driven by block registry
      block-item.tsx               ← Single row: drag handle, label, select, delete
      seo-panel.tsx                ← SEO tab: title, description, keywords, ogImage, noIndex
      page-header.tsx              ← Title input, slug input, status badge
      publish-bar.tsx              ← Bottom sticky: save indicator + publish + deploy status
      block-fields/
        text-field.tsx
        textarea-field.tsx
        image-field.tsx            ← Upload + preview → POST /api/admin/images
        icon-field.tsx             ← Searchable Lucide icon picker with inline preview
        array-field.tsx            ← Repeating group: add / remove / DnD reorder
        select-field.tsx
        url-field.tsx
        boolean-field.tsx
        blocks-field.tsx           ← Nested DnD canvas for SectionBlock children

  api/
    admin/
      auth/
        login/route.ts             ← POST: password check → pending session
        totp/route.ts              ← POST: TOTP verify → full session
        logout/route.ts            ← POST: destroy session
      pages/
        route.ts                   ← GET (list) | POST (create)
        [id]/route.ts              ← GET | PUT (update) | DELETE
      users/
        route.ts                   ← GET | POST (SuperAdmin only)
        [id]/route.ts              ← GET | PUT | DELETE
      images/route.ts              ← POST: upload image → Vercel Blob, return URL
      publish/route.ts             ← POST: call Vercel Deploy Hook (SuperAdmin only)
      deploy-status/route.ts       ← GET: poll Vercel API for build state
      setup/route.ts               ← POST: bootstrap first SuperAdmin (only when 0 users exist)

  (pages)/
    [slug]/
      page.tsx                     ← CMS-served pages: reads Blob, renders via BlockRenderer
```

### Files to Modify

| File | Change |
|------|--------|
| `blocks/image-text-split-block.tsx` | Add `ImageTextSplitBlockProps`. Hardcoded values become defaults — existing home page unaffected. |
| `blocks/split-hero-block.tsx` | Add `SplitHeroBlockProps`. Same default-value approach. |
| `next.config.ts` | Add `*.public.blob.vercel-storage.com` to `images.remotePatterns`. Remove `cdn.sanity.io`. |
| `libs/validate-env.ts` | Add CMS env vars. Remove Sanity env vars. |
| `integrations/check-integration.ts` | Remove `isSanityConfigured`. Add `isCmsConfigured`. |
| `app/layout.tsx` | Remove Sanity visual editing, draft mode, and `SanityLive`. Simplify `ReactTempus`. |

### Files / Directories to Delete

```
integrations/sanity/               ← entire directory
app/studio/                        ← Sanity Studio route
app/api/draft-mode/                ← draft-mode enable/disable routes
app/api/revalidate/                ← Sanity ISR webhook route
app/(pages)/sanity/                ← Sanity demo pages
```

---

## Block Registry

Central manifest at `libs/cms/block-registry.ts`. Each entry drives the block palette display, the props editor form, and default data factories.

```typescript
type FieldType =
  | 'text' | 'textarea' | 'image' | 'url' | 'select'
  | 'array' | 'blocks' | 'boolean' | 'icon'

interface FieldDef {
  key: string             // dot-notation for nested: 'metrics.large.value'
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]  // for 'select'
  fields?: FieldDef[]                            // for 'array' item schema
  defaultValue?: unknown
}

interface BlockRegistryEntry {
  type: BlockType
  label: string
  icon: LucideIconName    // shown in block palette
  isWrapper: boolean
  fields: FieldDef[]
  defaultData: () => BlockData  // factory for new block instances
}
```

### Block Field Schemas

**bento-stats:**
`preheadingContent` (text), `metrics.large.value/heading/content` (text×3), `metrics.image1` (image), `metrics.medium.value/heading/content` (text×3), `metrics.small.value/heading/content` (text×3), `metrics.image2` (image)

**card-grid:**
`preheadingContent` (text), `headingContent` (text, `<span>` for highlight), `bodyContent` (textarea), `articles` (array: image, heading, content, ctaUrl)

**feature-cards:**
`headingContent` (text), `bodyContent` (textarea), `cards` (array: label, heading, content, ctaLabel, ctaUrl, image)

**form-cta:**
`headingLine1` (text), `headingLine2` (text), `bodyContent` (textarea)

**image-content-cards:**
`preheadingContent` (text), `headingType` (select: h1–h6), `headingContent` (text), `bodyContent` (textarea), `buttons` (array: label, size, color, hasIcon, url), `cards` (array: icon, heading, content, alternate), `image` (image)

**image-text-split:**
`image` (image), `heading` (text), `bodyContent` (textarea), `ctaLabel` (text), `ctaUrl` (url)

**newsletter:**
`preheadingContent` (text), `headingContent` (text), `bodyContent` (textarea)

**numbered-steps:**
`preheadingContent` (text), `headingContent` (text), `bodyContent` (textarea), `steps` (array: icon, number, heading, content, alternate)

**people-grid:**
`preheadingContent` (text), `headingContent` (text), `bodyContent` (textarea), `members` (array: name, role, image, ctaUrl)

**split-hero:**
`headingContent` (text), `bodyContent` (textarea), `videoUrl` (url), `videoPosterImage` (image), `buttons` (array: label, size, color, hasIcon, url)

**section (wrapper):**
`backgroundColor` (select: offwhite / bluishgray / white / text), `paddingSize` (select: none / sm / md / lg), `children` (blocks — nested DnD canvas)

---

## Key Implementation Details

### Icon Resolver (`libs/cms/resolve-icon.ts`)

Blocks like `ImageContentCardsBlock` and `NumberedStepsBlock` accept `LucideIcon` (React component) as a prop, but the CMS stores icon names as strings. The resolver converts at render time:

```typescript
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function resolveIcon(name: string): LucideIcon {
  const icon = (LucideIcons as Record<string, unknown>)[name]
  return typeof icon === 'function' ? (icon as LucideIcon) : LucideIcons.HelpCircle
}
```

`BlockRenderer` calls this before passing props to icon-using blocks. The existing block components (`blocks/*.tsx`) remain unchanged — they still accept `LucideIcon` component props.

### Block Renderer (`libs/cms/block-renderer.tsx`)

```typescript
'use client'

export function BlockRenderer({ blocks }: { blocks: BlockData[] }) {
  return <>{blocks.map((b) => <BlockItem key={b._id} block={b} />)}</>
}

function BlockItem({ block }: { block: BlockData }) {
  switch (block._type) {
    case 'image-content-cards':
      return (
        <ImageContentCardsBlock
          {...block}
          cards={block.cards.map(c => ({ ...c, icon: resolveIcon(c.icon) }))}
        />
      )
    case 'numbered-steps':
      return (
        <NumberedStepsBlock
          {...block}
          steps={block.steps.map(s => ({ ...s, icon: resolveIcon(s.icon) }))}
        />
      )
    case 'section':
      return (
        <SectionBlock {...block}>
          <BlockRenderer blocks={block.children} />
        </SectionBlock>
      )
    // ...all other cases
    default:
      return null
  }
}
```

### Frontend CMS Page Route (`app/(pages)/[slug]/page.tsx`)

Server Component. Reads slug → looks up in pages index → fetches full page from Blob → renders via `BlockRenderer`. Named routes (`home`, `hubspot`, `r3f`) take priority over the catch-all `[slug]`.

```typescript
export async function generateStaticParams() {
  const index = await readPagesIndex()
  return index.pages
    .filter(p => p.status === 'published')
    .map(p => ({ slug: p.slug }))
}
```

### Storage Helpers (`libs/cms/storage.ts`)

Thin wrappers over `@vercel/blob`. Uses `addRandomSuffix: false` for predictable paths. Reads via `list({ prefix: path })` + exact `pathname` match to retrieve the download URL.

- `content/users.json` → `access: 'private'` (password hashes + TOTP secrets)
- `content/pages.json` + `content/pages/*.json` → `access: 'public'` (needed for SSG builds)
- `cms-uploads/*` → `access: 'public'` (images)

---

## Auth Flow

### Login (2 Steps)

**Step 1 — Password** (`POST /api/admin/auth/login`):
1. Extract IP from `x-forwarded-for`
2. `checkRateLimit(ip)` — 5 attempts / 15 min / IP; return 429 if exceeded
3. `findUserByEmail(email)` + `bcrypt.compare(password, hash)`
4. On success: set `session.pendingTotpUserId = user.id`, save session, return `{ totpEnrolled: boolean }`
5. On failure: return 401 `"Invalid credentials"` — never indicate which field failed

**Step 2 — TOTP** (`POST /api/admin/auth/totp`):
1. Read session — if no `pendingTotpUserId`, return 401
2. If `totpEnrolled === false`: first-time enrollment — TOTP page shows QR code (generated from stored secret); any valid code confirms enrollment; `totpEnrolled` set to `true`
3. `otplib.authenticator.verify({ token, secret })` with `window: 1` (±30s drift)
4. On success: `session.isLoggedIn = true`, `session.userId`, `session.role`, clear pending, `clearRateLimit(ip)`
5. On failure: return 401

**Logout** (`POST /api/admin/auth/logout`): `session.destroy()`, redirect to `/admin/login`.

### First SuperAdmin Bootstrap

`POST /api/admin/setup` — only accessible when `readUsers()` returns an empty array. Creates the first SuperAdmin with provided email, password (bcrypt hashed), and a generated TOTP secret. The TOTP QR is returned in the response. After setup, the endpoint returns 403 permanently.

The `/admin/login` page checks for zero users and redirects to `/admin/setup` if needed.

### Middleware (`middleware.ts`)

```typescript
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
```

Reads `iron-session` from `request.cookies` (Edge-compatible). Redirects unauthenticated requests to `/admin/login`. Exempts `/admin/login`, `/admin/login/totp`, `/admin/setup`, and `/api/admin/auth/**`.

### Session Security
- `iron-session` AES-256-GCM encrypted HTTP-only cookie, `sameSite: lax`, `secure: true` in prod, 8h TTL
- All mutating API routes verify `x-requested-with: XMLHttpRequest` header (CSRF mitigation)
- `canPerform(role, action)` checked at the top of every protected route handler

---

## Publish Flow

1. SuperAdmin clicks **Publish** in `publish-bar.tsx`
2. `POST /api/admin/publish`: verifies role, calls `fetchWithTimeout(VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }, 10_000)`
3. Vercel responds with `{ job: { id: '...' } }`
4. Client polls `GET /api/admin/deploy-status?jobId=<id>` every 5 seconds
5. Route calls `https://api.vercel.com/v13/deployments/{id}` with `Authorization: Bearer VERCEL_ACCESS_TOKEN`
6. Returns `{ state: 'BUILDING' | 'READY' | 'ERROR' }`
7. On `READY`: the triggered build runs `generateStaticParams`, fetches the updated Blob index, and SSGs all published pages

**Auto-save:** Editor debounces `PUT /api/admin/pages/[id]` 500ms after every change. Publish only triggers a rebuild — saving and publishing are independent actions.

**Publish bar states:** idle → saving (spinner) → deploying (spinner, button disabled) → success (checkmark, fades after 5s) → error (red, retry button)

---

## Security Summary

| Layer | Measure |
|-------|---------|
| Passwords | bcrypt cost 12, stored in private Vercel Blob |
| 2FA | TOTP via `otplib` (RFC 6238, 30s ±1 window), mandatory for all users |
| Rate limiting | 5 login attempts / 15 min / IP |
| Sessions | `iron-session` AES-256-GCM encrypted HTTP-only cookie, 8h TTL |
| Middleware | All `/admin` + `/api/admin` protected at Edge before any handler |
| CSRF | `sameSite: lax` + `x-requested-with` check on all mutations |
| RBAC | `canPerform(role, action)` checked in every API handler |
| Storage | Blob token server-side only — never in `NEXT_PUBLIC_*` |
| Image uploads | Server validates `Content-Type: image/*`, max 10 MB |
| Deploy Hook | URL server-side only, never sent to client |
| Error messages | Always `"Invalid credentials"` — never reveal which field failed |
| Bootstrap | Setup endpoint becomes 403 after first SuperAdmin is created |

---

## Implementation Phases

| Phase | Description | Key Deliverable |
|-------|-------------|-----------------|
| **0** | Foundation: install deps, create `libs/cms/types.ts`, auth helpers, `storage.ts`, modify `next.config.ts` + `validate-env.ts` | Type-safe storage + auth layer |
| **1** | Sanity removal: delete `integrations/sanity/`, `app/studio/`, draft-mode routes; clean up `app/layout.tsx`; remove Sanity packages | Clean build with no Sanity references |
| **2** | Auth routes + middleware: `middleware.ts`, `/api/admin/auth/*`, `app/admin/login/` | Login flow end-to-end; middleware blocks unauthenticated access |
| **3** | Block registry + renderer: `block-registry.ts`, `block-renderer.tsx`, `resolve-icon.ts`, `section-block.tsx`, update hardcoded blocks | Any `CmsPage` JSON renders correctly via `BlockRenderer` |
| **4** | CMS page route: `app/(pages)/[slug]/page.tsx` | CMS pages SSG'd and served publicly at `/{slug}` |
| **5** | CRUD API: `/api/admin/pages/*`, `/api/admin/users/*`, `/api/admin/images` | Full CRUD for pages + users; image upload working |
| **6** | Admin pages UI: page list, create page, admin nav | Create / list / delete pages in browser |
| **7** | Block builder editor: editor Zustand store, all field components, block palette, canvas, props editor, SEO panel, auto-save | Full block builder: add, edit, drag, SEO, auto-save to Blob |
| **8** | Nested blocks: extend canvas for `SectionBlock`, `blocks-field.tsx` | Drag blocks into/out of sections; nested children saved correctly |
| **9** | User management UI: `/admin/users/*`, TOTP QR on new user creation | Second user created, role restrictions verified |
| **10** | Publish flow: `/api/admin/publish`, `/api/admin/deploy-status`, publish bar polling | Publish button triggers Vercel rebuild; UI shows BUILDING → READY |
| **11** | Polish: slug validation, delete confirmations, error boundaries, preview button, this docs file | Production-ready |
