# CMS Architecture — paperhouse.agency

## Overview

A custom CMS built natively into the Next.js 16 app. Lives at `/admin`, stores pages as JSON files on the filesystem (committed via GitHub API on publish), stores users in Vercel Blob, uses `iron-session` for encrypted cookie sessions with TOTP 2-factor auth, supports multi-user RBAC, and can publish via GitHub commit → Vercel auto-deploy.

> **Last updated:** 2026-06-05 — Reflects implemented state + redesigned admin UI.

---

## Implementation Status

| Phase | Description | Status |
|-------|-------------|--------|
| Foundation | Types, storage, auth helpers, env config | ✅ Done |
| Sanity removal | Delete integrations, clean layout | ✅ Done |
| Auth routes + middleware | Login, TOTP, logout, rate limiting | ✅ Done |
| Block registry + renderer | All 15 block schemas, BlockRenderer | ✅ Done |
| CRUD API | Pages + users + images | ✅ Done |
| Admin UI — base | Nav, layout, pages list, users list | ✅ Done |
| Block builder editor | Blocks/SEO/Settings tabs, DnD, auto-save | ✅ Done |
| Extended Settings tab | Visibility, template, author, language, parent, publishedAt | ✅ Done |
| Admin UI redesign | PaperHouse design system applied to entire admin | ✅ Done |
| Live preview panel | Split editor + rendered block preview | ⏳ Pending |
| List search / filter | Client-side search in pages & users lists | ⏳ Pending |
| Nested blocks editor | `blocks-field.tsx` for SectionBlock children | ⏳ Pending |
| User management UI | Edit user, reset TOTP, role change | ✅ Done (basic) |
| Publish flow | Deploy Hook → Vercel build trigger + status polling | ⏳ Pending |
| Media library | `/admin/media` — browse/manage uploaded images | ⏳ Pending |

---

## Tech Stack

| Package | Purpose |
|---------|---------|
| `@vercel/blob` | User storage (`content/users.json`) + image uploads |
| `iron-session` | Encrypted HTTP-only cookie sessions (AES-256-GCM) |
| `otplib` | TOTP second-factor generation & verification |
| `bcryptjs` | Password hashing (cost 12) |
| `@dnd-kit/core` | Drag-and-drop core |
| `@dnd-kit/sortable` | Sortable block list |
| `@dnd-kit/utilities` | DnD CSS transform helpers |
| `zustand` | Editor client-side state |
| `class-variance-authority` | Button variant system |

**Note:** Sanity, next-sanity, and all `@sanity/*` packages have been removed.

---

## Environment Variables

```env
# Required
CMS_SESSION_SECRET=<random 32+ chars>        # iron-session AES-256-GCM key
BLOB_READ_WRITE_TOKEN=<vercel blob token>    # Users + image uploads (Vercel Storage)

# Optional — GitHub publish integration
GITHUB_TOKEN=<personal access token>        # repo:write scope
GITHUB_OWNER=<username or org>
GITHUB_REPO=<repository name>

# Optional — Vercel deploy status polling (for future publish bar)
VERCEL_DEPLOY_HOOK_URL=<deploy hook URL>
VERCEL_ACCESS_TOKEN=<vercel api token>

# Root user bootstrap (idempotent, safe to remove after first login)
ROOT_USER_ID=admin@example.com
ROOT_USER_PASS=<initial password>
```

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
  passwordHash: string    // bcrypt cost 12
  totpSecret: string      // base32
  totpEnrolled: boolean   // false until first TOTP login
  skipTotp?: boolean      // set true for root user only
  createdAt: string
  updatedAt: string
}

interface AdminSession {
  isLoggedIn: boolean
  userId?: string
  role?: UserRole
  pendingTotpUserId?: string
}
```

### Role Permissions

| Action | SuperAdmin | Marketing | Editor |
|--------|-----------|-----------|--------|
| Create pages | ✅ | ✅ | ❌ |
| Edit pages | ✅ | ✅ | ✅ |
| Delete pages | ✅ | ❌ | ❌ |
| Publish (toggle status) | ✅ | ✅ | ✅ |
| Manage users | ✅ | ❌ | ❌ |

### Page, SEO & Settings

```typescript
interface CmsPage {
  id: string               // UUID
  title: string
  slug: string             // URL-safe, unique ('about-us' → content/about-us.json)
                           // empty string or 'index' → homepage (content/index.json)
  status: 'draft' | 'published'
  seo: CmsPageSeo
  settings?: CmsPageSettings
  blocks: BlockData[]
  createdAt: string        // ISO
  updatedAt: string        // ISO
}

interface CmsPageSeo {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string         // URL only (e.g. "https://example.com/og.jpg")
  noIndex?: boolean
}

type PageVisibility = 'public' | 'private' | 'password-protected'
type PageTemplate    = 'default' | 'landing-page' | 'article' | 'contact' | 'blank'

interface CmsPageSettings {
  visibility?: PageVisibility  // default: 'public'
  template?:   PageTemplate    // default: 'default'
  author?:     string          // display name, selected from users list
  language?:   string          // BCP-47, e.g. 'en-US'
  parentSlug?: string          // slug of parent page for hierarchy
  publishedAt?: string         // ISO — auto-stamped on first publish, never overwritten
}
```

> **`ogImage` type change:** Was `CmsImage { src, alt }`. Changed to `string` (URL only) — OG image meta tags only need a URL, not alt text.

### Block Types

15 block types registered in `libs/cms/block-registry.ts`:

| Type | Label |
|------|-------|
| `bento-stats` | Bento Stats |
| `brands` | Brands Marquee |
| `card-grid` | Card Grid |
| `cta-manifesto` | CTA Manifesto |
| `faq` | FAQ |
| `feature-cards` | Feature Cards |
| `form-cta` | Form CTA |
| `image-content-cards` | Image Content Cards |
| `image-text-split` | Image Text Split |
| `newsletter` | Newsletter |
| `numbered-steps` | Numbered Steps |
| `people-grid` | People Grid |
| `split-hero` | Split Hero |
| `tagline-marquee` | Tagline Marquee |
| `section` | Section (Wrapper) |

All share `BaseBlockData`:
```typescript
interface BaseBlockData {
  _id: string      // UUID — React key + DnD id
  _type: BlockType
  visible?: boolean  // false = hidden in renderer
}
```

---

## Storage

### Pages — Filesystem JSON

Pages are stored as local JSON files. The GitHub integration optionally commits them to the repo on publish/delete so that Vercel can pick them up at build time.

```
content/
  index.json          ← homepage (slug = '')
  about-us.json       ← /about-us
  services.json       ← /services
  ...
```

Key helpers in `libs/cms/storage.ts`:

| Function | Description |
|----------|-------------|
| `listPages()` | Scans `content/` directory, returns `CmsPageMeta[]` sorted by title |
| `readPage(slug)` | Read single page by slug |
| `readPageById(id)` | Finds page by scanning all pages |
| `writePage(page)` | Write to `content/{slug}.json` |
| `renamePage(oldSlug, page)` | Delete old file, write at new path |
| `deletePage(slug)` | `fs.unlink` |
| `isSlugTaken(slug, excludeId?)` | Uniqueness check |
| `slugToRepoPath(slug)` | `content/{slug}.json` for GitHub API |

Slug validation prevents path traversal: only `[a-z0-9-]` characters allowed.

### Users — Vercel Blob

Users are stored in a single JSON file at `content/users.json` in Vercel Blob (private, not exposed). Helpers: `readUsers()`, `writeUsers()`, `updateUser()`, `ensureRootUser()`.

### Images — Vercel Blob

Uploaded via `POST /api/admin/images`. Stored at `cms-uploads/{uuid}.{ext}` with `access: 'public'`. The URL is stored in block data.

### GitHub Integration

When `GITHUB_TOKEN`, `GITHUB_OWNER`, and `GITHUB_REPO` are set, `commitFile()` is called on page publish/unpublish and `deleteFile()` on page delete. This commits the page JSON to the repo, triggering a Vercel auto-deploy.

---

## Admin UI

### Design System Alignment

The admin uses the PaperHouse design system tokens — same fonts and color variables as the main site, applied to a distinct admin chrome.

**Color roles (defined in `admin.css`):**

| Variable | Value | Usage |
|----------|-------|-------|
| `--chrome` | `#eae7e1` | Nav + sidebar background |
| `--workspace` | `#fbfaf8` | Main content area |
| `--c-card` | `#ffffff` | Card surfaces |
| `--color-primary` | `#ff4d00` | All primary actions (CTAs, active state, Save, Publish) |
| `--color-text` | `#1a1a1a` | Body text |
| `--chrome-muted` | `rgba(26,26,26,0.55)` | Secondary text, labels |

**Font variables** (set by Next.js font optimization on `<html>`):

| Variable | Font |
|----------|------|
| `--font-heading` | Bianco Serif — page titles, block names, card headings |
| `--font-body` | IBM Plex Sans — body text, field values |
| `--font-mono` | PP Neue Montreal Mono — nav pills, labels, badges, mono inputs |

All admin-specific CSS classes use the `cms-*` prefix (e.g. `cms-nav`, `cms-block-card`, `cms-field-grid`). Old `.admin-*`, `.editor-*`, `.f-*` classes are kept as backward-compat stubs at the bottom of `admin.css` and can be removed once all pages are ported.

### File Structure (current)

```
app/admin/
  layout.tsx                        ← cms-shell wrapper, no admin-main padding
  admin.css                         ← Full design-system-aligned styles (cms-* classes)
  page.tsx                          ← Redirect to /admin/pages

  (components)/
    admin-nav.tsx                   ← Server: session check → renders AdminNavUI
    admin-nav-ui.tsx                ← Client: usePathname() for active nav pill
    logout-button.tsx               ← Client: coral pill logout button

  login/
    page.tsx                        ← Step 1: email + password
    totp/page.tsx                   ← Step 2: TOTP code

  pages/
    page.tsx                        ← Server: page list table (card design)
    new/page.tsx                    ← Client: create page form
    [id]/
      page.tsx                      ← Server: fetch page + users + allPages → PageEditor
      (components)/
        page-editor.tsx             ← Client: full editor (DnD, 3 tabs, all state)
        block-fields-panel.tsx      ← Client: field grid for selected block
    (components)/
      delete-page-button.tsx
      duplicate-page-button.tsx

  users/
    page.tsx                        ← Server: users list (avatar, role pills)
    new/page.tsx                    ← Client: create user form
    [id]/
      page.tsx                      ← Server: edit user
      (components)/
        edit-user-form.tsx
    (components)/
      delete-user-button.tsx

libs/cms/
  types.ts                          ← CmsPage, CmsPageSeo, CmsPageSettings, BlockData, …
  storage.ts                        ← Filesystem (pages) + Vercel Blob (users + images)
  editor-store.ts                   ← Zustand: page state, undo/redo, save, updateSettings
  block-registry.ts                 ← 15 block schemas + defaultData factories
  block-renderer.tsx                ← Server renderer: _type → block component
  block-schema.ts                   ← FieldDef + BlockSchema types
  resolve-icon.ts                   ← LucideIconName string → LucideIcon component
  github.ts                         ← commitFile, deleteFile via GitHub Contents API
  auth/
    session.ts                      ← getSession() via iron-session + next/headers
    session-config.ts               ← iron-session options (8h TTL, HttpOnly, Secure)
    credentials.ts                  ← verifyPassword, hashPassword, findUserByEmail
    permissions.ts                  ← canPerform(role, action) RBAC
    totp.ts                         ← generateTotpSecret, verifyTotp, getTotpUri
    rate-limit.ts                   ← In-memory: 5 attempts / 15 min / IP

app/api/admin/
  auth/login/route.ts
  auth/totp/route.ts
  auth/logout/route.ts
  pages/route.ts                    ← GET (list/slugCheck) | POST (create)
  pages/[id]/route.ts               ← GET | PUT (update + settings + publishedAt) | DELETE
  pages/[id]/duplicate/route.ts
  users/route.ts
  users/[id]/route.ts
  images/route.ts                   ← POST: upload → Vercel Blob
```

### Editor Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  cms-nav  (62px, chrome bg — "paperhouse" CMS | Pages Users | Logout) │
├──────────────────┬──────────────────────────────────────────────┤
│  cms-editor-     │  cms-canvas                                  │
│  sidebar         │                                              │
│  (268px,         │  cms-page-header                             │
│  chrome bg)      │    breadcrumb / Bianco Serif title / badges  │
│                  │    undo+redo / Save changes / Publish         │
│  [Blocks]        │    Preview pill / Set as homepage            │
│  15 draggable    │                                              │
│  palette items   │  cms-tabs: [Blocks] [SEO] [Settings]         │
│                  │                                              │
│  search filter   │  Blocks tab:                                 │
│                  │    block cards (collapsed header /           │
│                  │    expanded form with BlockFieldsPanel)      │
│                  │    empty drop zone                           │
│                  │                                              │
│                  │  SEO tab:                                    │
│                  │    meta title + char counter (60)           │
│                  │    meta description + char counter (160)    │
│                  │    keywords / OG image URL / noIndex toggle  │
│                  │    → search result preview card             │
│                  │    → social card preview                    │
│                  │                                              │
│                  │  Settings tab:                               │
│                  │    visibility / parent page / template       │
│                  │    author dropdown / language                │
│                  │    first published (read-only)               │
│                  │    set as homepage / published toggles       │
│                  │    page info (ID, slug, dates)               │
│                  │    danger zone (delete page)                 │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## Auth Flow

### Login (2 Steps)

**Step 1 — Password** (`POST /api/admin/auth/login`):
1. IP rate limit: 5 attempts / 15 min → 429 if exceeded
2. `findUserByEmail(email)` + `bcrypt.compare(password, hash)`
3. Success: `session.pendingTotpUserId = user.id` → return `{ requiresTotp: boolean }`
4. Failure: 401 `"Invalid credentials"` (never indicate which field)

**Step 2 — TOTP** (`POST /api/admin/auth/totp`):
1. Require `pendingTotpUserId` in session
2. First-time: `totpEnrolled === false` — show QR, any valid code enrolls
3. `otplib.authenticator.verify({ token, secret, window: 1 })`
4. Success: `isLoggedIn = true`, clear pending, `clearRateLimit(ip)`

**Logout** (`POST /api/admin/auth/logout`): session destroyed, redirect to `/admin/login`.

### Session Security

- `iron-session` AES-256-GCM encrypted HTTP-only cookie, `sameSite: strict`, `secure: true` in prod, 8h TTL
- All mutating API routes verify `x-requested-with: XMLHttpRequest` (CSRF mitigation)
- `canPerform(role, action)` checked at the top of every protected handler

---

## Block Registry

Each entry in `BLOCK_REGISTRY` (from `libs/cms/block-registry.ts`) drives:
- The **palette sidebar** (label, icon, draggable tile)
- The **block form** (which fields to render via `BlockFieldsPanel`)
- The **default factory** (`defaultData()` — creates a new block with a UUID + sensible defaults)

```typescript
interface BlockSchema {
  type: BlockType
  label: string
  icon?: string        // Lucide icon name (displayed in palette)
  isWrapper?: boolean  // true for Section block
  fields: FieldDef[]
  defaultData: () => BlockData
}

type FieldType =
  | 'text' | 'textarea' | 'image' | 'url' | 'select'
  | 'array' | 'blocks' | 'boolean' | 'icon'

interface FieldDef {
  key: string              // dot-notation for nested: 'metrics.large.value'
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  description?: string
  span?: 'full'            // force full-width in the field grid
  options?: { value: string; label: string }[]
  fields?: FieldDef[]      // sub-fields for 'array' items
  defaultValue?: unknown
}
```

---

## Editor Store (`libs/cms/editor-store.ts`)

Zustand store. All mutations push to an undo history (max 50 snapshots).

| Action | Description |
|--------|-------------|
| `setPage(page)` | Load page, reset history |
| `setTitle(title)` | Update title → dirty |
| `setSlug(slug)` | Update slug → dirty |
| `updateSeo(partial)` | Merge into `page.seo` → dirty |
| `updateSettings(partial)` | Merge into `page.settings` → dirty |
| `addBlock(block)` | Append to `page.blocks` → dirty |
| `removeBlock(id)` | Filter from `page.blocks` → dirty |
| `updateBlock(id, data)` | Merge block data → dirty |
| `reorderBlocks(blocks)` | Replace entire blocks array → dirty |
| `duplicateBlock(id)` | Clone with new UUID, insert after → dirty |
| `toggleStatus()` | Flip draft↔published → PUT `/api/admin/pages/{id}` immediately |
| `undo() / redo()` | Navigate history |
| `save()` | PUT `/api/admin/pages/{id}` with full page + new `updatedAt` |

**Keyboard shortcuts in editor:**
- `Ctrl/Cmd + S` → save
- `Ctrl/Cmd + Z` → undo
- `Ctrl/Cmd + Shift + Z` → redo
- `Escape` → deselect block
- `Delete / Backspace` (when block focused, not in input) → remove block

---

## API Routes

### Pages

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/admin/pages?slugCheck=&excludeId=` | any | Check slug uniqueness |
| GET | `/api/admin/pages` | any | List all page metadata |
| POST | `/api/admin/pages` | create_page | Create page |
| GET | `/api/admin/pages/[id]` | any | Read full page |
| PUT | `/api/admin/pages/[id]` | edit_page | Update page (title, slug, status, seo, **settings**, blocks) — auto-stamps `settings.publishedAt` on first publish |
| DELETE | `/api/admin/pages/[id]` | delete_page | Delete page + GitHub commit |
| POST | `/api/admin/pages/[id]/duplicate` | create_page | Clone with new ID |

### Users

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/admin/users` | manage_users | List users |
| POST | `/api/admin/users` | manage_users | Create user |
| GET | `/api/admin/users/[id]` | manage_users | Read user |
| PUT | `/api/admin/users/[id]` | manage_users | Update name/role/password |
| DELETE | `/api/admin/users/[id]` | manage_users | Delete user |

### Other

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/admin/auth/login` | Password step |
| POST | `/api/admin/auth/totp` | TOTP step |
| POST | `/api/admin/auth/logout` | Destroy session |
| POST | `/api/admin/images` | Upload image → Vercel Blob URL |

---

## What Needs to Be Built Next

### 1. Live Preview Panel ⏳

Split the editor Blocks tab into a 2-column layout:
- **Left (60%):** block card stack (existing)
- **Right (40%, sticky):** iframe or React-rendered preview of the selected block

The selected block's current field values are passed live into the preview. The preview should respect the current theme (light/dark via a data-theme toggle on the preview container).

> **Implementation note:** User must be prompted before this is implemented. The iframe approach requires a preview API route (`GET /api/admin/preview/[id]`) that renders the page server-side with draft data. An in-React approach renders the block component directly in the editor (no iframe) but risks style conflicts.

### 2. Pages & Users List Search ⏳

The pages list and users list are currently server components with no filtering. Options:

**Option A — Client component with in-memory filter:**
Convert `pages/page.tsx` and `users/page.tsx` to client components. Fetch data once, filter in `useState`. Fast UX but loses RSC streaming.

**Option B — URL query param (`?q=`):**
Keep server components. Search state lives in the URL. Works with `useRouter().push`. Slightly slower (full page refetch) but more bookmarkable/shareable.

**Option B is preferred** — keeps components server-rendered, matches Next.js App Router patterns.

### 3. Publish Flow / Deploy Bar ⏳

The Vercel Deploy Hook flow is designed but not yet wired to the UI:

1. SuperAdmin clicks **Deploy** (separate from Save)
2. `POST /api/admin/publish` → calls `VERCEL_DEPLOY_HOOK_URL`
3. Returns `{ jobId }`
4. Client polls `GET /api/admin/deploy-status?jobId=` every 5 seconds
5. Route calls Vercel API with `VERCEL_ACCESS_TOKEN`
6. UI shows: idle → deploying (spinner) → ready ✓ / error ✗

**Scope:** Add a deploy button to the admin nav or pages list header. Only visible to super_admin.

### 4. Nested Blocks Editor ⏳

The `section` block has a `children: BlockData[]` field typed as `'blocks'` in the registry. The current `BlockFieldsPanel` renders `"nested block editing coming soon"` for this field type.

Implementing this requires a nested DnD canvas inside the block form — a recursive version of the main block list. Scope and complexity are non-trivial; implement as a separate step.

### 5. Media Library ⏳

A `/admin/media` page that lists all uploaded images from Vercel Blob (`cms-uploads/` prefix). Features: browse, preview, copy URL, delete. Useful for re-using images across blocks without re-uploading.

### 6. New Page Modal (in-editor) ⏳

Currently "New page" navigates to `/admin/pages/new`. The design prototype showed a modal dialog. A nice-to-have improvement — creates pages without losing the current editor context.

---

## Security Summary

| Layer | Measure |
|-------|---------|
| Passwords | bcrypt cost 12, stored in private Vercel Blob |
| 2FA | TOTP via `otplib` (RFC 6238, 30s ±1 window), mandatory for all users |
| Rate limiting | 5 login attempts / 15 min / IP (in-memory) |
| Sessions | `iron-session` AES-256-GCM, HttpOnly, SameSite strict, 8h TTL |
| Middleware | All `/admin/*` + `/api/admin/*` protected at Edge before any handler |
| CSRF | `x-requested-with: XMLHttpRequest` header required on all mutations |
| RBAC | `canPerform(role, action)` checked in every handler |
| Storage | Blob token server-side only — never in `NEXT_PUBLIC_*` vars |
| Image uploads | Server validates `Content-Type: image/*`, max 10 MB |
| GitHub token | Server-side only, gated behind `isGitHubConfigured()` |
| Slug validation | `[a-z0-9-]` only + path-traversal check |
| Error messages | Always `"Invalid credentials"` — never reveal which field failed |
| Bootstrap | `ROOT_USER_ID` / `ROOT_USER_PASS` env vars create root user idempotently |
