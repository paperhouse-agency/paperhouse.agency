# HQ ↔ paperhouse.agency — SEO/GEO Integration Spec

Implementation instructions for the **HQ** app (`hq.paperhouse.agency`). The public site side is already built, deployed on branch `feat/retire-cms-for-hq`, and is waiting on HQ.

**Audience:** whoever implements the SEO/GEO editor in HQ.
**Last updated:** 2026-09-07

---

## 1. What this is

Marketing edits the public site's SEO/GEO metadata from HQ. HQ writes to the shared Neon Postgres database; the public site reads from it, cached indefinitely, and purges its cache when HQ tells it to.

```
HQ (hq.paperhouse.agency, Cognito)         Site (paperhouse.agency)
        │                                          │
   1. marketing saves ──> Neon Postgres <───── 3. cached read on regeneration
        │                                          │    ('use cache', cacheLife('max'))
        └── 2. POST /api/revalidate ──────────────>┘  4. revalidateTag(...)
```

**Division of responsibility**

| Concern | Owner |
|---|---|
| `page_seo` / `site_seo` tables + migrations | **HQ** |
| Writing SEO data | **HQ** |
| Reading SEO data, rendering meta tags, JSON-LD, sitemap, robots | Site |
| Page content and copy | Site (hardcoded in repo, deploy to change) |

**Critical:** the site never creates or alters these tables. HQ owns the schema. If HQ does not create them, the site silently falls back to hardcoded defaults (it will not crash, but nothing marketing does will have any effect).

---

## 2. Database schema

Same Neon database the site reads (`POSTGRES_URL`). Run this once from HQ's migration system.

```sql
-- One row per public route on paperhouse.agency
CREATE TABLE IF NOT EXISTS page_seo (
  slug        TEXT PRIMARY KEY,          -- route path, e.g. '/', '/about'
  title       TEXT,                      -- <title> + og:title + twitter:title
  description TEXT,                      -- meta description + og/twitter description
  keywords    TEXT[],                    -- meta keywords
  og_image    TEXT,                      -- absolute URL to social share image
  no_index    BOOLEAN NOT NULL DEFAULT false,
  json_ld     JSONB,                     -- optional extra structured data
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exactly one row, id = 'default'
CREATE TABLE IF NOT EXISTS site_seo (
  id                TEXT PRIMARY KEY,     -- always 'default'
  org_name          TEXT,
  org_logo          TEXT,                 -- absolute URL
  social_urls       JSONB,                -- JSON array of strings
  default_og        TEXT,                 -- fallback social image (absolute URL)
  allow_ai_crawlers BOOLEAN NOT NULL DEFAULT true,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Seed rows

These reproduce what the site currently serves from its hardcoded defaults. Run after creating the tables so marketing starts from the live values rather than blanks.

```sql
INSERT INTO page_seo (slug, title, description) VALUES
  ('/',        'PaperHouse — Creative & Development Studio',
               'A creative and development studio blending design, code, and storytelling — built to help brands grow in the digital space.'),
  ('/about',   'About — PaperHouse',
               'A creative and development studio blending design, code, and storytelling.'),
  ('/contact', 'Contact — PaperHouse',
               'Get in touch with the PaperHouse team.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO site_seo (id, org_name, allow_ai_crawlers)
VALUES ('default', 'PaperHouse', true)
ON CONFLICT (id) DO NOTHING;
```

### Legacy tables — do not touch

The database also contains `pages` and `slots` from the retired in-repo CMS. The site no longer reads either. Leave them alone; they can be dropped later once you're confident nothing needs the old content.

---

## 3. Slug convention

`page_seo.slug` stores the **route path exactly as it appears in the URL**, including the leading slash. The homepage is `'/'`, not `''`, `'index'`, or `'home'`.

Valid slugs today: `/`, `/about`, `/contact`

Never invent slugs. Fetch the list from `GET /api/routes` (§5) and let marketing pick from it — the site rejects unknown slugs on revalidate, and a row with a slug the site doesn't know about is simply never read.

---

## 4. Field reference

### `page_seo`

| Field | Type | What it controls | Guidance for the UI |
|---|---|---|---|
| `slug` | TEXT | Which route this applies to | Not free text — pick from `GET /api/routes` |
| `title` | TEXT | `<title>`, `og:title`, `twitter:title` | Character counter, target ≤ 60. **Renders exactly as typed** — see note below |
| `description` | TEXT | `meta description`, `og:description`, `twitter:description` | Character counter, target ≤ 160 |
| `keywords` | TEXT[] | `meta keywords` | Comma-separated input → array. Low SEO value; keep optional |
| `og_image` | TEXT | `og:image`, `twitter:image` | Must be an **absolute** URL. Recommend 1200×630 |
| `no_index` | BOOLEAN | Adds `robots: noindex, nofollow` **and** drops the page from `sitemap.xml` | Label it plainly, e.g. "Hide this page from search engines" |
| `json_ld` | JSONB | Extra structured data merged into the page's JSON-LD graph | Advanced/optional. Hide behind a disclosure; validate it's an object |
| `updated_at` | TIMESTAMPTZ | `lastmod` in `sitemap.xml` | Set to `now()` on every write |

**Title note:** the site's root layout has a `%s - PaperHouse` title template, but HQ-set titles deliberately bypass it and render verbatim. So a title of `About` renders as `About`, *not* `About - PaperHouse`. This means the character counter in HQ is truthful — but marketing must include the brand themselves if they want it.

### `site_seo` (single row, `id = 'default'`)

| Field | Type | What it controls |
|---|---|---|
| `org_name` | TEXT | `og:site_name` and the `name` in the Organization JSON-LD |
| `org_logo` | TEXT | `logo` in Organization JSON-LD (absolute URL) |
| `social_urls` | JSONB | `sameAs` array in Organization JSON-LD — official social profiles |
| `default_og` | TEXT | Social image used when a page has no `og_image` |
| `allow_ai_crawlers` | BOOLEAN | **The GEO switch.** See below |
| `updated_at` | TIMESTAMPTZ | Bookkeeping |

**`allow_ai_crawlers`** rewrites `robots.txt`. When `true`, these agents are explicitly allowed; when `false`, each gets `Disallow: /`:

`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `anthropic-ai`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `CCBot`, `Applebot-Extended`, `meta-externalagent`, `Bytespider`

Normal search engines (Googlebot, Bingbot) are unaffected by this toggle and always allowed.

### Fallback chain

Every field is optional. When HQ leaves one empty, the site falls back:

- **title** → page row → route's hardcoded default → site name
- **description** → page row → route's hardcoded default
- **og_image** → page `og_image` → `site_seo.default_og` → `/opengraph-image.jpg`
- **org_name** → `site_seo.org_name` → `"PaperHouse"`
- **allow_ai_crawlers** → row value → `true`

If the database is unreachable, the site logs a warning and serves the hardcoded defaults. It never renders blank metadata.

---

## 5. Site API

Two endpoints. Both authenticate with the same shared secret, sent as a bearer token.

**Base URL:** `https://paperhouse.agency`
**Header:** `authorization: Bearer $REVALIDATE_SECRET`

Both endpoints are exempt from the site's maintenance mode, so publishing keeps working during maintenance.

### `GET /api/routes` — discover editable routes

Page content lives in the site's code, so the database has no record of which routes exist. Ask the site.

```
GET https://paperhouse.agency/api/routes
authorization: Bearer $REVALIDATE_SECRET
```

```json
{
  "routes": [
    {
      "slug": "/",
      "label": "Home",
      "sitemap": true,
      "defaults": {
        "title": "PaperHouse — Creative & Development Studio",
        "description": "A creative and development studio blending design, code, and storytelling — built to help brands grow in the digital space."
      }
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `slug` | Use verbatim as `page_seo.slug` |
| `label` | Human name for the HQ page list |
| `sitemap` | Whether the route is eligible for `sitemap.xml` |
| `defaults` | What the site renders when HQ has no row — show as placeholder text |

Responses: `200` · `401` bad/missing secret · `503` secret not configured on the site.

**Recommendation:** call this when the editor loads rather than hardcoding the route list in HQ. New pages then appear automatically.

### `POST /api/revalidate` — publish

Purges the site's cache. **Without this call, changes never go live** — reads use `cacheLife('max')`.

```
POST https://paperhouse.agency/api/revalidate
authorization: Bearer $REVALIDATE_SECRET
content-type: application/json

{"slug": "/"}          // after saving one page's SEO
{"scope": "site"}      // after saving site-wide settings
```

Success:

```json
{ "revalidated": ["seo-page:/", "seo-sitemap"], "at": "2026-09-07T07:01:57.798Z" }
```

| Status | Meaning | HQ should |
|---|---|---|
| `200` | Cache purged | Show "published" |
| `401` | Bad/missing secret | Alert — misconfiguration, not user error |
| `400` | Unknown slug, malformed body, or invalid JSON | Alert — likely a stale route list; refetch `/api/routes` |
| `503` | `REVALIDATE_SECRET` not set on the site | Alert — site misconfiguration |

`{"scope": "site"}` purges the site-wide settings *and* `robots.txt`. Use it for any `site_seo` change.

---

## 6. Environment variables (HQ)

```env
# Same Neon database the site reads. Use the pooled connection string.
POSTGRES_URL=

# Must be byte-identical to REVALIDATE_SECRET on the site.
REVALIDATE_SECRET=

# Site base URL — keep configurable, don't hardcode.
SITE_BASE_URL=https://paperhouse.agency
```

Generate the secret with `openssl rand -base64 32`, then set it in **both** Vercel projects. It is a server-side secret: never expose it to the browser, and never prefix it with `NEXT_PUBLIC_`. All calls to the site API must be made from HQ's server, not from client code.

---

## 7. Publish flow

Implement save as a two-step operation, in this order:

1. **Write to Postgres.** Upsert the row and set `updated_at = now()`.
2. **Call the site to purge its cache.** `POST /api/revalidate` with `{"slug"}` or `{"scope":"site"}`.

```sql
-- page save
INSERT INTO page_seo (slug, title, description, keywords, og_image, no_index, json_ld, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, now())
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  og_image = EXCLUDED.og_image,
  no_index = EXCLUDED.no_index,
  json_ld = EXCLUDED.json_ld,
  updated_at = now();

-- site settings save
INSERT INTO site_seo (id, org_name, org_logo, social_urls, default_og, allow_ai_crawlers, updated_at)
VALUES ('default', $1, $2, $3, $4, $5, now())
ON CONFLICT (id) DO UPDATE SET
  org_name = EXCLUDED.org_name,
  org_logo = EXCLUDED.org_logo,
  social_urls = EXCLUDED.social_urls,
  default_og = EXCLUDED.default_og,
  allow_ai_crawlers = EXCLUDED.allow_ai_crawlers,
  updated_at = now();
```

### Failure handling — the important part

**A failed revalidate must be visible to the editor.** The DB write succeeded, so HQ will show the new value while the live site still serves the old one. Marketing believes they published; they haven't.

Requirements:

- Do **not** silently swallow a non-200 from `/api/revalidate`.
- Show an explicit warning: *"Saved, but the live site was not updated. Retry publish."*
- Offer a **Retry publish** action that re-issues the revalidate call without re-saving.
- Log the failure with the slug and status code.
- Optional but recommended: track a `published_at` per row and flag rows where `updated_at > published_at` as "pending publish".

Use a short timeout (5–10s) and treat a timeout as failure.

---

## 8. UI requirements

### Page SEO editor (per route)

Fields: **Page title** (counter, ≤60) · **Meta description** (counter, ≤160) · **Keywords** (comma-separated) · **Social share image URL** · **Hide from search engines** toggle · **Advanced: JSON-LD** (collapsed).

Two live previews, which is what makes this usable for non-technical staff:

1. **Google result preview** — the URL, the title in Google blue, the description in grey, truncated the way Google truncates.
2. **Social card preview** — the OG image with title and description beneath, as it appears when shared.

Show the route's `defaults` as placeholder text so it's obvious what the site falls back to when a field is left blank.

> A working reference implementation of exactly this UI (character counters, SERP preview, social card preview) exists in this repo's git history — `components/cms/page-editor.tsx` at commit `03b785d^`, the `SeoTab` component. Worth reading before building it from scratch.

### Site settings screen (one, global)

Fields: **Organization name** · **Logo URL** · **Social profile URLs** (repeatable) · **Default social image** · **Allow AI crawlers** toggle.

The AI crawler toggle deserves a plain-language explanation, e.g.:

> *Allow AI assistants (ChatGPT, Claude, Perplexity, Google AI) to read this site. Turning this off asks them not to — which usually means the site stops appearing in AI-generated answers.*

### Validation

- `og_image`, `org_logo`, `default_og`, `social_urls[]` — must be absolute `https://` URLs. Relative paths will break social sharing.
- `slug` — must exist in `GET /api/routes`.
- `json_ld` — must parse as a JSON object.
- `title` / `description` — warn past the character limits, don't block. Marketing sometimes has a reason.

### Access control

Gate the editor behind Cognito. SEO changes are publicly visible the moment they're published, and `no_index` / `allow_ai_crawlers` can deindex the site — restrict them to the marketing and admin groups rather than all authenticated users.

---

## 9. Implementation order

1. Run the migration and seed rows (§2). The site immediately starts reading real rows instead of defaults.
2. Set `REVALIDATE_SECRET` in both projects and confirm `GET /api/routes` returns 200 from HQ's server.
3. Build the per-page editor: read row → form → save → revalidate.
4. Add the two live previews.
5. Build the site settings screen with the AI crawler toggle.
6. Add publish-failure surfacing and the retry action (§7).
7. Optional: JSON-LD advanced field, and pending-publish tracking.

Steps 1–3 give a complete working loop; everything after improves usability.

---

## 10. Verification

Once wired up, confirm end to end:

```bash
# 1. Route discovery
curl -s https://paperhouse.agency/api/routes \
  -H "authorization: Bearer $REVALIDATE_SECRET"

# 2. Auth is enforced (expect 401)
curl -s -o /dev/null -w "%{http_code}\n" https://paperhouse.agency/api/routes

# 3. Unknown slugs rejected (expect 400)
curl -s -X POST https://paperhouse.agency/api/revalidate \
  -H "authorization: Bearer $REVALIDATE_SECRET" \
  -H "content-type: application/json" \
  -d '{"slug":"/does-not-exist"}'

# 4. Publish (expect 200 + revalidated tags)
curl -s -X POST https://paperhouse.agency/api/revalidate \
  -H "authorization: Bearer $REVALIDATE_SECRET" \
  -H "content-type: application/json" \
  -d '{"slug":"/"}'
```

Then, through the UI:

- [ ] Change the homepage title in HQ, publish, and confirm `curl -s https://paperhouse.agency | grep '<title>'` shows the new value within a few seconds.
- [ ] Confirm the title renders **exactly** as typed, with no ` - PaperHouse` appended.
- [ ] Toggle **Hide from search engines** on `/about`, publish, and confirm `<meta name="robots" content="noindex...">` appears and `/about` disappears from `https://paperhouse.agency/sitemap.xml`.
- [ ] Toggle **Allow AI crawlers** off, publish with `{"scope":"site"}`, and confirm `https://paperhouse.agency/robots.txt` shows `Disallow: /` for `GPTBot` and `ClaudeBot`.
- [ ] Set org name and social URLs, publish, and confirm they appear in the page's `application/ld+json` script.
- [ ] Break the secret deliberately and confirm HQ surfaces a visible publish failure rather than reporting success.

---

## 11. Gotchas

- **Publishing is two operations.** A DB write alone changes nothing on the live site. This is the single most likely bug in the integration.
- **`cacheLife('max')` means forever.** There is no TTL that will eventually pick up changes. If revalidate isn't called, the old value is served indefinitely.
- **The homepage slug is `/`.** Not `''`, not `'index'`.
- **Absolute URLs only** for every image and social link.
- **HQ owns migrations.** The site deliberately has no schema creation. Two writers to one schema is how drift starts.
- **`site_seo` is a singleton.** Always `id = 'default'`; never insert a second row.
- **`no_index` affects the sitemap too**, not just the meta tag.
- **The site fails soft.** A broken DB connection produces default metadata and a server log warning, not an error page — so a misconfiguration can look like "HQ edits do nothing" rather than an outage. Check the site's logs for `[seo] ... read failed` when debugging.
