# Paperhouse Agency — Design System

This document is the single source of truth for all design decisions in this project.
**Claude must always follow these guidelines when writing or modifying any UI code.**

---

## 1. Color Palette

All colors are CSS custom properties defined in `styles/colors.ts` and exposed via Tailwind.

| Token | Tailwind class | Hex | Usage |
|---|---|---|---|
| `primary` | `text-primary` / `bg-primary` | `#ff4d00` | CTAs, highlights, links, accent text |
| `secondary` | `text-secondary` / `bg-secondary` | `#4b749f` | Secondary cards, info states |
| `accent` | `text-accent` / `bg-accent` | `#fa971a` | Icon wrappers on primary buttons, highlight chips |
| `text` | `text-text` | `#1a1a1a` | All body text, headings (default) |
| `offwhite` | `bg-offwhite` | `#f9f7f4` | Page background |
| `bluishgray` | `bg-bluishgray` | `#e8ebef` | Section backgrounds, icon wrappers, secondary cards |
| `white` | `bg-white` | `#ffffff` | Card backgrounds, overlays |
| `black` | `text-black` | `#000000` | Rarely used; prefer `text-text` |

### Opacity modifiers
Use Tailwind opacity modifiers on any color token:
```
text-text/60   → rgba(26, 26, 26, 0.6)  — body copy, captions
text-text/40   → rgba(26, 26, 26, 0.4)  — placeholder, disabled
bg-white/50    → semi-transparent white overlay
```

### Dark mode
Theme tokens flip automatically via `data-theme="dark"`:
| Light | Dark |
|---|---|
| `offwhite` → `#f9f7f4` | `offwhite` → `#000000` |
| `bluishgray` → `#e8ebef` | `bluishgray` → `#1a1a1a` |
| `text` → `#1a1a1a` | `text` → `#f9f7f4` |

`primary`, `secondary`, `accent` do **not** flip.

### Rules
- Never hardcode hex values in components — always use a token.
- For dark text on light bg: `text-text`. For muted text: `text-text/60`.
- Use `bg-offwhite` for page-level backgrounds, `bg-white` for card surfaces.
- Highlight spans inside headings always use `text-primary`.

---

## 2. Typography

### Fonts

| Variable | Family | Usage |
|---|---|---|
| `--font-heading` | **Bianco Serif** (local, woff2) | All headings `h1`–`h6` |
| `--font-body` | **IBM Plex Sans** (Google Fonts) | Body copy, buttons, UI labels |
| `--font-mono` | **PP Neue Montreal Mono** (local, otf) | Section labels, mono tags, tertiary buttons |

### Type scale utilities

| Class | Font | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `heading-1` | Bianco Serif | 58px | 400 | 120% | 0 |
| `heading-2` | Bianco Serif | 44px | 400 | 120% | 0 |
| `heading-3` | Bianco Serif | 32px | 400 | 120% | 0 |
| `heading-4` | Bianco Serif | 24px | 400 | 120% | 0 |
| `heading-5` | Bianco Serif | 18px | 400 | 120% | 0 |
| `heading-6` | Bianco Serif | 16px | 400 | 120% | 0 |
| `body-large` | IBM Plex Sans | 20px | 400 | 130% | 0 |
| `body` | IBM Plex Sans | 16px | 400 | 125% | 0 |
| `body-small` | IBM Plex Sans | 12px | 400 | 125% | 0 |
| `mono` | PP Neue Montreal Mono | 14px | 400 | 100% | 0 |
| `mono-wide` | PP Neue Montreal Mono | 16px | 400 | 125% | 0.1em (≈1.6px at 16px) |

> `mono-wide` automatically applies `text-transform: uppercase`. Do not manually uppercase mono-wide text.

### Semantic pairings (from Figma)

| Element | Class | Color |
|---|---|---|
| Page hero heading | `heading-1` | `text-text` |
| Section heading | `heading-2` | `text-text` (orange span: `text-primary`) |
| Card heading (large) | `heading-3` | `text-text` |
| Card heading (small) | `heading-4` | `text-text` |
| Sub-item heading | `heading-5` | `text-text` |
| Section eyebrow / label | `mono-wide text-primary` | `text-primary` |
| Hero body copy | `body-large text-text/60` | `text-text/60` |
| Card body copy | `body text-text/60` | `text-text/60` |
| Small captions / tags | `body-small text-text/60` | `text-text/60` |
| Section description | `body-large text-text` | `text-text` (full — no /60) |

### Heading highlight pattern
Headings frequently have one orange word/phrase. Always use `<span className="text-primary">` inline — never a separate element:
```tsx
// Section headings accept <span> tags parsed to orange:
headingContent="Three steps for your <span>Digital Growth!</span>"
```
The `parseHeading` helper in blocks handles this pattern.

---

## 3. Spacing System

Tailwind's default 4px scale. Key values used in this project:

| Utility | Value | Usage |
|---|---|---|
| `gap-2.5` | 10px | Tight element gaps (within cards, heading + body) |
| `gap-5` | 20px | Card internal gaps, grid gaps |
| `gap-10` | 40px | Section content padding |
| `gap-15` | 60px | Section vertical padding (`py-15`) |
| `p-5` | 20px | Card padding (small) |
| `p-10` | 40px | Card padding (large, e.g. Recent Works container) |
| `px-5` | 20px | Section horizontal padding |
| `py-15` | 60px | Standard section vertical rhythm |
| `mb-15` | 60px | Gap between section header and card grid |

### Section anatomy
Every page section follows this pattern:
```tsx
<section className="py-15 px-5 [bg-color?]">
  <div className="wrapper mx-auto">
    {/* content */}
  </div>
</section>
```

The `.wrapper` class (in `global.css`) sets:
- `width: 100%`
- `max-width: 1440px`
- `padding-left: 20px; padding-right: 20px`

---

## 4. Layout System

### Breakpoints
| Name | Value | Usage |
|---|---|---|
| `dt` | 800px | Only breakpoint. Mobile-first; `dt:` prefix for desktop |

Mobile: `< 800px` — Desktop: `≥ 800px`

```tsx
// Mobile-first, desktop override:
<div className="grid grid-cols-1 dt:grid-cols-3 gap-5">
```

> Use `dt:` not `md:` — this project uses a custom breakpoint, not Tailwind defaults.

### Grid
| | Mobile | Desktop |
|---|---|---|
| Columns | 4 | 12 |
| Gap | 16px | 16px |
| Safe margin | 16px | 16px |

### Common layout patterns
```tsx
// 2-col content + image
<div className="grid grid-cols-1 dt:grid-cols-2 gap-15 items-center">

// 3-col card grid
<div className="grid grid-cols-1 dt:grid-cols-3 gap-5">

// Centered section header
<div className="flex flex-col items-center text-center gap-2.5 mb-15">
```

---

## 5. Button Component

**Always use `@/components/button`** — never build inline button HTML.

### API
```tsx
<Button
  variant="default" | "tertiary" | "outline"
  color="primary" | "secondary" | "neutral"
  size="sm" | "md" | "lg"
  hasIcon={boolean}
  url="/path"          // renders as <Link>
  onClick={fn}         // renders as <button>
>
  Label
</Button>
```

### Variant matrix

| Variant | Color | Appearance |
|---|---|---|
| `default` (filled) | `primary` | `bg-primary text-offwhite` — main CTA |
| `default` (filled) | `secondary` | `bg-secondary text-offwhite` |
| `default` (filled) | `neutral` | `bg-bluishgray text-primary` — secondary CTA |
| `outline` | `primary` | `border-2 border-primary text-primary` |
| `outline` | `neutral` | `border-2 border-bluishgray text-text` |
| `tertiary` | `primary` | `mono-wide text-primary p-0` — text-only with arrow |
| `tertiary` | `neutral` | `mono-wide text-text p-0` |

### Size × padding

| Size | Without icon | With icon | Font class |
|---|---|---|---|
| `sm` | `px-3 py-1.5` | `pl-3 pr-1.5 py-1.5` | `body` (16px IBM) |
| `md` | `px-5 py-2.5` | `pl-4 pr-2 py-2` | `body-large` (20px IBM) |
| `lg` | `px-[30px] py-5` | `pl-[30px] pr-2 py-2` | `body-large` (20px IBM) |

### Icon wrapper sizes (when `hasIcon`)
| Size | Icon wrapper | Icon itself |
|---|---|---|
| `sm` | 18 × 18px | 12 × 12px |
| `md` | 30 × 30px | 16 × 16px |
| `lg` | 50 × 50px | 24 × 24px |

**Icon wrapper colors:**
- `default primary` → `bg-accent`
- `default neutral` → `bg-white`
- `tertiary` → `bg-primary text-white` (overrides all)

### Common button recipes

```tsx
// Primary CTA (hero)
<Button size="lg" color="primary">Schedule a Meeting</Button>

// Secondary CTA with icon
<Button size="lg" color="neutral" hasIcon>Explore Projects</Button>

// Card section CTA (small outline)
// For custom pill CTAs that don't fit Button, use inline:
<Link href={url} className="inline-flex items-center justify-center border border-text rounded-full px-3 py-1.5 body-small text-text whitespace-nowrap">
  See Design Process →
</Link>

// Tertiary text link with arrow
<Button variant="tertiary" color="primary" size="sm" hasIcon>READ MORE</Button>
```

---

## 6. Core Components

### `@/components/image`
**Always use this instead of `next/image`.** Accepts same props as `next/image`.
```tsx
import { Image } from '@/components/image'
<Image src={src} alt={alt} fill className="object-cover" />
// For card images with fixed aspect ratio:
<div className="relative w-full aspect-[440/293] rounded-lg overflow-hidden">
  <Image src={src} alt={alt} fill className="object-cover" />
</div>
```

### `@/components/link`
**Always use this instead of `<a>` or `next/link`.** Auto-detects external URLs and adds `target="_blank" rel="noopener noreferrer"`.
```tsx
import { Link } from '@/components/link'
<Link href="/about">Internal</Link>
<Link href="https://example.com">External (auto)</Link>
```

### `@/components/button`
See section 5 above.

### `@/components/content-with-button`
Renders a preheading + heading + body + buttons block. Heading supports `<span>` for orange highlights.
```tsx
<ContentWithButton
  preheadingContent="SECTION LABEL"   // mono-wide text-primary
  headingContent="Title with <span>Highlight</span>"
  bodyContent="Description text."
  buttons={[{ label: 'CTA', size: 'lg' }]}
/>
```
> Does **not** center text automatically. Wrap with `flex flex-col items-center text-center` if you need centered layout.

### `@/components/icon-content-card`
Small card with icon, heading, and body. Two modes:
```tsx
<IconContentCard
  icon={LightbulbIcon}
  heading="Innovation"
  content="Breaking boundaries."
  alternate={false}  // white bg with border; true = secondary blue bg
/>
```

---

## 7. Card Patterns

### Standard feature card (used in Solutions block)
```
bg-white | rounded-lg (8px) | shadow-[4px_4px_5px_rgba(0,0,0,0.05)] | p-5
flex-col | items-center | gap-5 | text-center
```
Contents: `mono-wide text-primary` label → `heading-3 text-text` → `body text-text/60` → CTA → image

### Article/work card (used in Recent Works block)
```
flex-col | gap-5 | items-start
```
Contents: `aspect-[440/293] rounded-lg` image → `heading-4 text-text` → `body text-text/60` → tertiary button

### Metric / highlight card (used in Impact Metrics block)
```
bg-accent | rounded-[12px] | p-5 | flex-col | justify-between
```
Contents: large number (`text-[64px]`) → `heading-4` label → `body` description

### Icon feature card (used in ImageContentWithCards block)
```
bg-white/50 | border border-text/60 | rounded-lg | p-5 | flex-col | gap-2.5
```
Contents: `48×48 rounded-full bg-bluishgray` icon → `heading-5 text-text` → `body-small text-text/60`

---

## 8. Section Background Patterns

| Background | Token | Use case |
|---|---|---|
| Default page bg | `bg-offwhite` | Most sections (no class needed — body default) |
| Alternate section | `bg-bluishgray` | Every other section for rhythm |
| Dark section | `bg-text` | Contact forms, footers, dark CTAs |
| White card surface | `bg-white` | Cards lifted above page bg |

---

## 9. Border Radius

| Value | Class | Usage |
|---|---|---|
| 4px | `rounded` | Small inline elements |
| 8px | `rounded-lg` | Cards, images, standard UI |
| 12px | `rounded-[12px]` | Large section containers |
| 99px / full | `rounded-full` | Buttons, pills, icon wrappers |

---

## 10. Shadow

One shadow style used throughout:
```
shadow-[4px_4px_5px_rgba(0,0,0,0.05)]
```
Applied to card containers (white on offwhite bg). Do not use Tailwind's default `shadow-*` utilities — they don't match the design.

---

## 11. Animations & Easings

Named easings available as CSS variables (`--ease-*`) and in `styles/easings.ts`:

| Name | Curve |
|---|---|
| `gleasing` | `cubic-bezier(0.4, 0, 0, 1)` — preferred for UI transitions |
| `out-quint` | `cubic-bezier(0.23, 1, 0.32, 1)` — smooth exits |
| `out-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` — fast exits |
| `in-out-quart` | `cubic-bezier(0.77, 0, 0.175, 1)` — bidirectional |

In Tailwind: `duration-500` for standard transitions (`transition-colors duration-500`).
In GSAP: access via `import { easings } from '@/styles/easings'`.

---

## 12. Existing Blocks

Blocks live in `/blocks/`. Each exports a typed props interface.

| Block | File | Description |
|---|---|---|
| `HeroVideoBlock` | `hero-video-block.tsx` | Split hero with video thumbnail |
| `ImageContentWithCards` | `image-content-with-cards.tsx` | Image + content + 3 icon cards |
| `FlowStepsBlock` | `flow-steps-block.tsx` | Animated 4-step process |
| `SolutionsBlock` | `solutions-block.tsx` | 3-col service cards with image |
| `RecentWorksBlock` | `recent-works-block.tsx` | White container, 3-col article cards |
| `CoreValuesBlock` | `core-values-block.tsx` | Full-width image + 2-col text |

### Block authoring rules
1. Blocks are server components by default — only add `'use client'` when state/effects are needed.
2. Export a typed `*Props` interface alongside the component.
3. All data comes through props — no hardcoded copy inside the component.
4. Use `wrapper mx-auto` inside `section py-15 px-5` for layout.
5. Use `parseHeading()` (or `ContentWithButton`) for headings with `<span>` highlights.
6. Never use `next/image` or `<a>` — always use `@/components/image` and `@/components/link`.

---

## 13. Responsive Rules

- **Mobile-first**: base styles are mobile, `dt:` overrides for desktop (≥ 800px).
- **Single breakpoint**: this project uses only `dt` (800px). Do not use `sm:`, `md:`, `lg:`, `xl:` etc.
- Grids stack to single column on mobile: `grid-cols-1 dt:grid-cols-3`.
- Hide on mobile: `hidden dt:block`. Hide on desktop: `block dt:hidden`.
- Images: always use `fill` + `object-cover` inside a sized container.

---

## 14. Do's and Don'ts

### DO
- Use design tokens (`text-primary`, `bg-bluishgray`, etc.) — never raw hex values.
- Use `@/components/image` and `@/components/link` for all media and navigation.
- Use typography classes (`heading-2`, `body`, `mono-wide`) — never inline `text-[44px]` etc.
- Use `dt:` for responsive overrides, not `md:`.
- Keep section spacing consistent: `py-15 px-5` outer, `wrapper mx-auto` inner.
- Always set explicit `text-text` on headings — don't rely solely on inheritance.
- Use `shadow-[4px_4px_5px_rgba(0,0,0,0.05)]` for card shadows — not default Tailwind shadows.

### DON'T
- Don't hardcode colors: ~~`text-[#ff4d00]`~~ → `text-primary`.
- Don't hardcode font sizes: ~~`text-[44px]`~~ → `heading-2`.
- Don't use `useMemo` / `useCallback` / `React.memo` — React Compiler handles it.
- Don't use `next/image` directly — use `@/components/image`.
- Don't use `<a>` or `next/link` directly — use `@/components/link`.
- Don't use `md:` breakpoint — use `dt:`.
- Don't use default Tailwind shadow classes (`shadow-sm`, `shadow-md`) — use the custom shadow.
- Don't add `'use client'` unless state, effects, or browser APIs are required.
