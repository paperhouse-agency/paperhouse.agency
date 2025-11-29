# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Project Rules

**This project has comprehensive coding rules in `.claude/rules/` that MUST be followed at all times.**

The rules are organized into 5 focused files (2,020 lines total):

1. **`main.mdc`** - Technology stack, React 19.2 features, React Compiler, Image optimization, cross-cutting concerns
2. **`components.mdc`** - React component patterns, WebGL/Three.js integration, Activity component
3. **`styling.mdc`** - CSS Modules, Tailwind CSS v4, responsive design, custom utilities (`dr-*`)
4. **`integrations.mdc`** - Sanity CMS (GROQ queries, schema), HubSpot, API best practices
5. **`architecture.mdc`** - State management, routing, performance, security, testing, code quality

**Quick reference guide** is in `.claude/rules/README.md` - consult it to find relevant sections.

**These rules are automatically loaded via `.clauderc`** - always adhere to them when writing code.

## Commands

### Development
```bash
bun dev                    # Start dev server with style watcher
bun dev:https              # Start dev with HTTPS (experimental)
bun build                  # Build for production (runs setup:styles first)
bun start                  # Start production server
```

### Code Quality
```bash
bun lint                   # Run Biome linter
bun lint:fix               # Auto-fix linting issues
bun format                 # Format code with Biome
bun typecheck              # Run TypeScript type checking
```

### Utilities
```bash
bun setup:styles           # Generate Tailwind utilities and theme
bun validate:env           # Check environment variables
bun cleanup:integrations   # List unused integrations for removal
```

### Sanity CMS
```bash
bun sanity:schema-extract  # Extract Sanity schema
bun sanity:typegen         # Generate TypeScript types from Sanity schema
```

### Analysis & Testing
```bash
bun build:analyze          # Analyze bundle size
bun build:profile          # Profile build performance
bun lighthouse             # Run Lighthouse on localhost:3000
bun storybook              # Start Storybook on port 6006
bun build-storybook        # Build Storybook for production
```

## Architecture

### Technology Stack
- **Next.js 16.0.0** with App Router and Turbopack
- **React 19.2.0** with React Compiler enabled (manual memoization rarely needed)
- **TypeScript** with strict mode
- **Tailwind CSS 4.1.15** with CSS-first configuration
- **Biome 2.2.7** for linting and formatting
- **Bun** as JavaScript runtime and package manager

### Project Structure
```
├── app/                    # Next.js App Router pages and layouts
│   ├── (pages)/           # Route groups for pages
│   └── (components)/      # Shared layout components
├── blocks/                 # Reusable page sections/blocks
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── integrations/           # Third-party integrations (Sanity, HubSpot)
├── libs/                   # Utility functions and helpers
├── orchestra/              # Debug tools (dev-only, toggle with Cmd+O)
├── styles/                 # Global styles, config, and generation scripts
├── webgl/                  # WebGL/Three.js components
└── public/                 # Static assets
```

### Path Alias
- Use `@/` prefix for all imports from project root
- Example: `import { Button } from '@/components/button'`
- Configured in `tsconfig.json` with `"@/*": ["./*"]`

### Component Organization Patterns

**Page Blocks**: Sections that compose pages should be in `/blocks/` at project root:
```
blocks/
  hero-video-block.tsx      # Complete page sections
  features-block.tsx
  testimonials-block.tsx
```

**Reusable Components**: Generic UI components in `/components/`:
```
components/
  button/
    index.tsx
    button.module.css
  form/
    index.tsx
    hook.ts
```

**WebGL Separation**: Keep WebGL logic in separate `webgl.tsx` files:
```
components/
  scene/
    index.tsx              # React component
    webgl.tsx              # Three.js/R3F logic
    scene.module.css       # Styles
```

### Server vs Client Components
- **Default to Server Components** - only add `'use client'` when needed
- Use client components for: state, effects, browser APIs, event handlers
- React 19 no longer requires `forwardRef` - ref is passed as a regular prop

### React Compiler & Optimization
- **React Compiler is ENABLED** - handles optimization automatically
- **DO NOT use `useMemo`, `useCallback`, or `React.memo`** in new code
- **EXCEPTION**: Use `useRef` for object instantiation to prevent infinite loops:
```tsx
// ❌ DON'T: Creates new reference every render
const instance = new SomeClass()

// ✅ DO: Use useRef for objects
const instanceRef = useRef<SomeClass | null>(null)
if (!instanceRef.current) {
  instanceRef.current = new SomeClass()
}
```

### React 19.2 New Features

**`<Activity />` Component**: Optimize off-screen components
```tsx
import { Activity } from 'react'

<Activity mode={isActive ? 'visible' : 'hidden'}>
  <ExpensiveComponent />
</Activity>
```
Use cases: tabs, carousels, accordions, off-screen WebGL scenes

**`useEffectEvent` Hook**: Separate event logic from effect dependencies
```tsx
import { useEffect, useEffectEvent } from 'react'

const onConnected = useEffectEvent(() => {
  showNotification('Connected!', theme) // theme won't trigger reconnect
})

useEffect(() => {
  const connection = createConnection(url)
  connection.on('connected', onConnected)
  connection.connect()
  return () => connection.disconnect()
}, [url]) // Only url triggers effect
```

**`cacheSignal` (Server Components)**: Auto-abort on cache expiry
```tsx
import { cacheSignal } from 'react'

async function fetchData(id: string) {
  const signal = cacheSignal()
  const response = await fetch(`/api/data/${id}`, { signal })
  return response.json()
}
```

### Image & Link Components
- **ALWAYS use `@/components/image`** for images (never `next/image`)
- **ALWAYS use `@/components/link`** for links (auto-detects external URLs)
- **For WebGL contexts**: Use `@/webgl/components/image`

### Styling System

**Tailwind CSS v4** with CSS-first configuration:
- Configuration in CSS using `@theme` directive (not `tailwind.config.js`)
- Import syntax: `@import "tailwindcss"` instead of `@tailwind` directives
- All design tokens available as CSS variables (`--color-*`, `--font-*`, etc.)

**Custom Utilities** (generated from `styles/scripts/`):
- `dr-*` utilities for responsive scaling (e.g., `dr-text-xl`, `dr-w-200`)
- Column-based sizing: `dr-w-col-6` (spans 6 grid columns)
- Layout utilities: `dr-grid`, `dr-layout-block`, `dr-layout-grid`
- Device utilities: `mobile-only`, `desktop-only`

**CSS Modules**:
- Always import as `s`: `import s from './component.module.css'`
- Use camelCase for class names
- File naming: `component-name.module.css`

**PostCSS Functions**:
```css
.element {
  width: mobile-vw(150);      /* 150px at mobile viewport */
  height: desktop-vh(100);    /* 100px at desktop viewport */
  margin: columns(6);         /* Width of 6 grid columns */
}
```

### State Management
- **React state** for component-local state
- **Zustand** for global state (stores in `@/libs/store.ts`)
- **Context** for shared UI state (theme, modals)

### WebGL/Three.js Architecture
- Use `@/webgl/components/canvas` (custom Canvas wrapper)
- Separate WebGL logic into `webgl.tsx` files
- Use `@react-three/fiber` for React integration
- Use `@react-three/drei` for common helpers
- **Always use `useRef` for Three.js object instantiation**
- Wrap WebGL scenes with `<Activity />` for performance when off-screen

### Development vs Production
- Console logs auto-stripped in production (except `console.error`, `console.warn`)
- **Debug UI components MUST be gated** - not auto-removed:
```tsx
{process.env.NODE_ENV === 'development' && <DebugPanel />}
```

### Orchestra Debug Tools
- Toggle with `Cmd/Ctrl + O`
- Includes grid overlay, minimap, performance stats, Theatre.js
- State persists in localStorage and syncs across tabs
- Auto-excluded from production builds

### Integrations
- **Sanity CMS**: Headless CMS with draft mode
  - Requires `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_WRITE_TOKEN`
  - Draft mode routes: `/api/draft-mode/enable`, `/api/draft-mode/disable`
  - Run `bun sanity:typegen` after schema changes
- **HubSpot**: Forms integration
  - Requires `HUBSPOT_ACCESS_TOKEN`, `NEXT_PUBLIC_HUBSPOT_PORTAL_ID`

### GSAP & Animation
- Add `<GSAPRuntime />` in `app/layout.tsx` for ScrollTrigger + Lenis integration
- No manual ticker setup needed
- Use `lenis` for smooth scrolling
- Use `tempus` for timing utilities

### Type Safety
- Strict TypeScript mode enabled
- Avoid `any` types
- Use `import type` for type-only imports
- Validate environment variables with `bun validate:env`

### Performance Best Practices
- Server components by default
- Code splitting with `next/dynamic` for heavy components
- Use `<Activity />` for off-screen optimization
- Check bundle impact of new dependencies (`bun build:analyze`)
- Run `bun cleanup:integrations` to identify removable integrations

### Security
- Never commit API keys (use `.env.local`)
- Validate environment variables at runtime (`@/libs/validate-env`)
- Use server actions for sensitive operations
- Validate all user inputs server-side

### Key Utilities
- `@/libs/validate-env` - Runtime environment validation
- `@/libs/cleanup-integrations` - Find unused integrations
- `@/libs/fetch-with-timeout` - Resilient API calls with timeout
- `@/libs/metadata` - SEO and metadata generation

### Breakpoints
- Mobile: < 800px
- Desktop: ≥ 800px
- Defined in `styles/config.ts`

### Git Workflow
- Use conventional commits
- DO NOT use `--force` without permission
- DO NOT skip hooks (`--no-verify`) unless requested
- Run `bun lint` before committing

### Package Manager
- **Always use Bun** for all package operations
- `bun install`, `bun add`, `bun remove`

## Critical Rules from .cursor/rules/

### React Compiler & Memoization (main.mdc)
```tsx
// ❌ DON'T: React Compiler handles this automatically
const value = useMemo(() => expensive(a, b), [a, b])
const callback = useCallback(() => doSomething(), [])

// ✅ DO: Let React Compiler optimize
const value = expensive(a, b)
const callback = () => doSomething()

// ⚠️ EXCEPTION: Use useRef for object instantiation
const instanceRef = useRef<SomeClass | null>(null)
if (!instanceRef.current) {
  instanceRef.current = new SomeClass()
}
```

### Component Structure (components.mdc)
```tsx
'use client' // Only when needed

import s from './component.module.css'
import type { ComponentProps } from 'react'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary'
}

function Button({ variant = 'primary', ...props }: ButtonProps) {
  return <button className={cn(s.button, s[variant])} {...props} />
}

export default Button
```

### WebGL Separation (components.mdc)
```
components/scene/
  index.tsx         # React component with DOM
  webgl.tsx         # Three.js/R3F logic only
  scene.module.css
```

### Sanity GROQ Queries (integrations.mdc)
```tsx
// ALWAYS use defineQuery and SCREAMING_SNAKE_CASE
import { defineQuery } from 'groq'

export const PAGE_QUERY = defineQuery(`*[
  _type == "page"
  && slug.current == $slug
][0]{
  _id,
  title,
  content,
  author->{
    _id,
    name
  }
}`)
```

### Sanity Schema Patterns (integrations.mdc)
```tsx
// Use defineType, defineField, defineArrayMember
import { defineType, defineField } from 'sanity'

export const pageType = defineType({
  name: 'page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().error('Title is required'),
    }),
    // Always array of references, never single reference
    defineField({
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
  ],
})
```

### API Resilience (integrations.mdc)
```tsx
import { fetchWithTimeout } from '@/libs/fetch-with-timeout'

// Always use timeouts for external APIs
const response = await fetchWithTimeout(url, options, 8000) // 8s for HubSpot
```

### Tailwind v4 CSS-First Config (styling.mdc)
```css
/* In CSS file, not tailwind.config.js */
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", "sans-serif";
  --color-brand: oklch(0.84 0.18 117.33);
  --breakpoint-3xl: 1920px;
}
```

### Custom Responsive Functions (styling.mdc)
```css
.element {
  width: mobile-vw(150);      /* Responsive to mobile viewport */
  height: desktop-vh(100);    /* Responsive to desktop viewport */
  margin: columns(6);         /* 6 grid columns width */
}
```

### Activity Component for Performance (components.mdc)
```tsx
import { Activity } from 'react'

<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ExpensiveWebGLScene />
</Activity>
```

### Server vs Client Components (architecture.mdc)
```tsx
// ✅ Server Component (default) - no 'use client'
async function ServerPage() {
  const data = await fetchData() // Server-side fetch
  return <ClientComponent data={data} />
}

// ✅ Client Component - 'use client' only when needed
'use client'
function ClientComponent({ data }) {
  const [state, setState] = useState(data)
  return <div onClick={() => setState(!state)}>{state}</div>
}
```

### React 19 Ref Handling (components.mdc)
```tsx
// No forwardRef needed in React 19 - ref is a regular prop
function Input({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

### Environment Variable Validation (integrations.mdc)
```tsx
import { validateEnv } from '@/libs/validate-env'

validateEnv([
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'SANITY_API_WRITE_TOKEN',
  'HUBSPOT_ACCESS_TOKEN'
])
```
