# Orchestra — Development Tools Suite

## Overview

Orchestra is a development-only debug toolkit embedded in the app. It provides a command center (Cmd/Ctrl+O) for toggling various dev tools, all built on a **Zustand vanilla store** with `localStorage` persistence and cross-tab sync.

**Entry point:** `@/orchestra` → `OrchestraTools` component placed in `app/layout.tsx:106`.

Zero production impact — returns `null` when `NODE_ENV !== 'development'`.

## Architecture

```
orchestra/
├── orchestra.ts         # Core: Zustand store (persisted, subscribeWithSelector)
├── index.tsx            # Entry: OrchestraTools + useOrchestra hook
├── cmdo.tsx             # Cmd+O dialog (Base UI Dialog) with toggle buttons
├── toggle.tsx           # Reusable toggle button that reads/writes store
├── grid/                # Grid overlay debugger
├── minimap/             # Viewport minimap with section markers
├── stats/               # FPS/performance stats (stats-gl + tempus)
└── theatre/             # Theatre.js animation integration
    ├── index.tsx        # ProjectProvider, SheetProvider, hooks
    ├── r3f.tsx          # R3F <Group> wrapper with theatre controls
    ├── hooks/
    │   ├── use-theatre.ts   # Core hook: create sheet object, bind values
    │   └── use-studio.ts    # Lazy-load Theatre Studio, selection tracking
    └── studio/          # Studio UI overlay + config download button
```

## Data Flow

1. **Store** (`orchestra.ts`): Zustand vanilla store holding `Record<string, boolean>`. Persisted to `localStorage` under key `orchestra`. Cross-tab sync via `window.addEventListener('storage')`.
2. **Toggles** (`cmdo.tsx`): Render buttons that call `Orchestra.setState()`. Keyboard shortcut `Cmd/Ctrl+O` opens the dialog. `Shift+G` toggles grid directly.
3. **Subscription** (`index.tsx` → `useOrchestra()`): React hook that subscribes to the store and returns current boolean states.
4. **Gating**: Components render conditionally: `{stats && <Stats />}`.

## Tools Reference

| Tool | Store Key | Emoji | Description | Runtime Deps |
|------|-----------|-------|-------------|-------------|
| Grid | `grid` | 🌐 | Visual column overlay using `--columns` / `--gap` CSS vars | `hamo` |
| Stats | `stats` | 📈 | GPU-tab performance overlay via `stats-gl`, bound to `tempus` RAF | `stats-gl`, `tempus` |
| Minimap | `minimap` | 🗺️ | Fixed-position scroll minimap with colored section markers via `useMinimap()` hook | `hamo`, `zustand`, `tempus` |
| Dev mode | `dev` | 🚧 | Toggles `.dev` class on `<html>` | None |
| Screenshot | `screenshot` | 📸 | Toggles `.screenshot` class to hide UI | None |
| Theatre Studio | `studio` | ⚙️ | Full Theatre.js animation editor + config download | `@theatre/core`, `@theatre/studio` |
| WebGL | `webgl` | 🧊 | Default-enabled flag for WebGL canvas rendering | None |

## Key Implementation Details

### Orchestra Tools (`index.tsx`)
- All sub-components (Stats, Grid, Minimap) are lazy-loaded via `next/dynamic` with `ssr: false`.
- Guards: returns `null` in production; returns `null` on `/admin` routes.
- Includes `Cmdo` (command dialog) unconditionally when in dev (it too returns null in prod).

### Core Store (`orchestra.ts`)
- Uses `zustand/vanilla` (not React-bound) — framework-agnostic.
- Middleware: `persist` (localStorage) + `subscribeWithSelector` (fine-grained subscriptions).
- The `useOrchestra` hook in `index.tsx` wraps this as a React hook.

### Toggle (`toggle.tsx`)
- Each toggle subscribes to its specific key via `subscribeWithSelector` selector function.
- Supports `defaultValue` — used by WebGL toggle (defaults `true`).
- Visual feedback: green background when active.

### Grid (`grid/`)
- Reads `--columns` CSS custom property from `<html>` to determine column count.
- Uses `useMemo` recalculated on window resize.
- Renders column spans inside `dr-layout-grid`.
- CSS module adds pink column backgrounds + checkerboard row pattern.

### Minimap (`minimap/`)
- Two-part API:
  - **`useMinimap({ color })` hook** — call from any component to register a section. Returns a `ref` setter. Uses a separate Zustand store (`useMinimapStore`).
  - **`<Minimap />` component** — renders the fixed-position minimap overlay.
- Tracks body aspect ratio via `ResizeObserver`.
- Scroll progress drives a sliding viewport indicator (`::before` pseudo-element).
- Markers positioned via `tempus` RAF loop reading `getBoundingClientRect()`.

### Stats (`stats/`)
- Uses `stats-gl` package (WebGL-aware stats, not just FPS).
- Bound to `tempus` RAF: `begin()` at `NEGATIVE_INFINITY` priority, `end()` + `update()` at `POSITIVE_INFINITY` priority.
- CSS forces bottom positioning (stats-gl defaults to top-left).

### Theatre (`theatre/`)
- **`TheatreProjectProvider`**: Fetches JSON config, calls `getProject(id, { state })`. Sets `window.THEATRE_PROJECT_ID`.
- **`SheetProvider`**: Provides `ISheet` via context. Supports optional `sheetId` and `instanceId`.
- **`useTheatre` hook** (`hooks/use-theatre.ts`): Creates a sheet object from a config. Returns `{ get, values, set, object }`. Lazy mode (default) only exposes values via `get()` ref; set `lazy: false` for reactive re-renders.
- **`Group`** (`r3f.tsx`): R3F `<group>` wrapper with `position/rotation/scale/visible` bound to theatre.
- **`Studio`** (`studio/`): Full Theatre Studio overlay. Includes a save button that downloads current config as JSON.
- **`useStudio` hook** (`hooks/use-studio.ts`): Dynamically imports `@theatre/studio` only when the `studio` toggle is enabled. Prevents bundling the heavy studio package unnecessarily.

## Dependencies Table

| Package | Used By | Bundled Always? | Approx Weight |
|---------|---------|----------------|---------------|
| `zustand` | Core store, Minimap | Yes | ~3KB |
| `@base-ui-components/react/dialog` | `cmdo.tsx` | Yes (dev only) | ~15KB |
| `stats-gl` | `stats/index.ts` | Yes (dev only) | ~30KB |
| `@theatre/core` | Theatre hooks | Yes | ~100KB |
| `@theatre/studio` | Studio overlay | Lazy via `import()` | ~200KB |
| `hamo` | Grid, Minimap | Yes (dev only) | ~2KB |
| `tempus` | Stats, Minimap | Yes (already in project) | ~3KB |
| `three` (R3F) | `r3f.tsx` | Already in project | N/A |

## Integration Points

Checked usage across the codebase:

| File | What It Uses |
|------|-------------|
| `app/layout.tsx` | `OrchestraTools` |
| `hooks/use-scroll-trigger.ts` | `useOrchestra` (minimap toggle) + `useMinimap` |
| `webgl/utils/fluid/index.tsx` | `useCurrentSheet` + `useTheatre` |
| `webgl/utils/flowmaps/index.tsx` | `useCurrentSheet` + `useTheatre` |
| `webgl/components/tunnel/index.tsx` | `SheetContext`, `SheetProvider`, `useSheet` |
| `webgl/components/canvas/webgl.tsx` | `SheetProvider` |
| `app/(pages)/r3f/page.tsx` | `TheatreProjectProvider` |
| `app/(pages)/r3f/(components)/box/webgl.tsx` | `useCurrentSheet` + `useTheatre` |

## Production Safety

- `OrchestraTools` returns `null` when `process.env.NODE_ENV !== 'development'` (`index.tsx:35`).
- Also returns `null` on `/admin` routes (`index.tsx:36`).
- Sub-components are `next/dynamic` with `ssr: false` — never shipped to client in production builds, though bundler may still include modules. Verify with `pnpm build:analyze`.
- Console logs in Theatre providers are present but will be stripped in production builds (project-level convention).

## Verdict: Keep All Tools

| Tool | Keep? | Rationale |
|------|-------|-----------|
| Grid | Keep | Essential layout debugging, zero overhead |
| Stats | Keep | Critical for WebGL/animations perf tuning |
| Minimap | Keep | Useful for long-scroll pages |
| Dev mode | Keep | Zero cost class toggle |
| Screenshot | Keep | Useful for marketing assets |
| WebGL | Keep | Gates WebGL canvas rendering |
| Theatre Studio | Keep | Powers active animation features in 5+ WebGL files |
| Theatre Core | Keep | Required by Studio; hooks used across codebase |

**Note:** If production bundle size becomes a concern, `@base-ui-components/react/dialog` (used only in `cmdo.tsx`) is the most replaceable dependency — a native `<dialog>` element would suffice for the dev command palette.
