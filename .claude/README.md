# Claude Code Configuration for PaperHouse

This directory contains configuration for Claude Code to ensure consistent development patterns.

## What's Configured

### 1. `.clauderc` (Project Root)
Tells Claude Code to automatically load and apply the project rules from `.claude/rules/`.

**Configuration includes:**
- All 5 rule files are enabled by default
- System prompt with key principles
- Project metadata (Next.js framework, Bun package manager)

### 2. `CLAUDE.md` (Project Root)
Comprehensive quick reference guide for Claude Code including:
- All development commands
- Architecture overview
- Critical code patterns and examples
- Links to detailed rules in `.claude/rules/`

### 3. `.claude/rules/` (Project Rules)
5 MDC files with comprehensive coding standards (2,020 lines total):

1. **main.mdc** - Tech stack, React 19.2, React Compiler, cross-cutting concerns
2. **components.mdc** - React patterns, WebGL/Three.js, Activity component
3. **styling.mdc** - CSS Modules, Tailwind v4, responsive design, custom utilities
4. **integrations.mdc** - Sanity CMS, HubSpot, API best practices
5. **architecture.mdc** - State management, routing, performance, security

## How It Works

When Claude Code operates in this repository:

1. **Automatic Rule Loading**: `.clauderc` tells Claude to load all rules from `.claude/rules/`
2. **System Prompt**: Provides high-level context and key principles upfront
3. **Quick Reference**: `CLAUDE.md` offers commands and architecture overview
4. **Detailed Rules**: `.claude/rules/*.mdc` files contain comprehensive patterns

## Key Principles (Always Applied)

✅ **React Compiler is ENABLED** - no manual memoization (except useRef for objects)
✅ **Use `@/` path alias** for all imports
✅ **Use `@/components/image`** never `next/image`
✅ **Use `@/components/link`** for all navigation
✅ **'use client' only when needed** (state, effects, browser APIs)
✅ **Tailwind v4 CSS-first** configuration with custom `dr-*` utilities
✅ **Import CSS modules as `s`** (`import s from './styles.module.css'`)
✅ **Separate WebGL logic** into `webgl.tsx` files
✅ **Use `<Activity />`** for off-screen optimization
✅ **Gate debug UI components** (not auto-stripped in production)
✅ **Validate env vars** with `@/libs/validate-env`
✅ **Use `fetchWithTimeout`** for external API calls
✅ **Sanity GROQ**: Use `defineQuery` with `SCREAMING_SNAKE_CASE`
✅ **Bun is the package manager** for all operations

## Quick Command Reference

```bash
# Development
bun dev                    # Start dev server
bun build                  # Production build
bun lint                   # Run linter
bun typecheck              # Type checking

# Sanity
bun sanity:typegen         # Generate types after schema changes

# Analysis
bun build:analyze          # Bundle size analysis
bun cleanup:integrations   # Find unused integrations
```

## For Developers

When working on this project:

1. Claude Code will automatically follow these rules
2. Refer to `CLAUDE.md` for quick reference
3. Check `.claude/rules/README.md` for detailed rule navigation
4. All rules are enforced consistently across the codebase

## Updating Rules

To modify project rules:

1. Edit files in `.claude/rules/`
2. Update `CLAUDE.md` if adding new patterns
3. No need to update `.clauderc` unless changing rule file locations
4. Follow the maintenance guidelines in `.claude/rules/README.md`

---

Last updated: 2025-11-29
