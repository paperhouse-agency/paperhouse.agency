# Cursor Rules Documentation

This directory contains consolidated Cursor AI rules for the Satus project. The rules are organized into 5 focused files for easy maintenance and efficient AI context loading.

## 📁 File Structure

### 1. `main.mdc` - Project Overview & Cross-Cutting Concerns
**Purpose**: High-level overview and concerns that apply across the entire project

**Contents**:
- Technology stack (Next.js 15.6, React 19.2, Tailwind v4, Bun)
- React 19.2 new features (`<Activity />`, `useEffectEvent`, `cacheSignal`)
- File organization
- React Compiler & memoization guidelines (single source of truth)
- Image optimization guidelines (single source of truth)
- Development vs production guidelines (single source of truth)
- Core utility libraries

**When to reference**: Starting a new project, understanding the tech stack, cross-cutting concerns

---

### 2. `components.mdc` - React Component Patterns & WebGL
**Purpose**: All React component patterns including standard components and WebGL/Three.js

**Contents**:
- Component structure and imports
- Props interfaces and React 19 ref handling
- Forms and responsive design
- Performance best practices (code splitting)
- Error handling
- WebGL/Three.js setup and patterns
- React Three Fiber
- Drei components
- Custom shaders
- Animation and interaction
- Post-processing

**When to reference**: Building React components, creating WebGL experiences, working with Three.js

---

### 3. `styling.mdc` - CSS Modules & Tailwind CSS v4
**Purpose**: All styling approaches including CSS Modules and Tailwind CSS v4

**Contents**:
- CSS Modules (file naming, class naming, imports)
- Responsive design (viewport functions, breakpoints, grid system)
- Typography and colors
- Animations and transitions
- Tailwind CSS v4 (CSS-first configuration, theme variables, new features)
- 3D transforms, gradients, shadows
- New variants (composable, `starting`, `not-*`, `nth-*`)
- Custom extensions (`@utility`, `@variant`, `@plugin`)
- Breaking changes and migration
- Project-specific custom utilities (`dr-*` classes)
- PostCSS functions

**When to reference**: Styling components, using Tailwind, creating responsive designs

---

### 4. `integrations.mdc` - Third-Party Integrations
**Purpose**: Guidelines for all third-party service integrations

**Contents**:
- **HubSpot**: Form integration, newsletter subscriptions
- General best practices (environment variables, API resilience, error handling)
- Type safety and performance
- Security and integration management
- Webhook handling

**When to reference**: Integrating with HubSpot or other third-party services

---

### 5. `architecture.mdc` - Architecture Patterns & Best Practices
**Purpose**: Architectural patterns, state management, routing, and code quality guidelines

**Contents**:
- Type safety (TypeScript configuration)
- State management (React state, Zustand)
- Routing & navigation (Next.js App Router, Link component)
- Metadata & SEO
- Performance (server components, code splitting, caching)
- Security (environment variables, input validation, authentication)
- Testing & debugging (unit tests, debugging tools, error boundaries)
- Code quality (linting, formatting, code organization)
- Development workflow (package manager, git workflow, client/server boundaries)

**When to reference**: Architectural decisions, state management, routing patterns, code quality

---

## 🎯 Quick Reference Guide

### I want to...

- **Start a new feature** → Read `main.mdc` for overview, then `architecture.mdc` for patterns
- **Build a React component** → `components.mdc`
- **Add WebGL/Three.js** → `components.mdc` § WebGL Components & Activity Integration
- **Style with CSS Modules** → `styling.mdc` § CSS Modules
- **Style with Tailwind** → `styling.mdc` § Tailwind CSS v4
- **Use custom utilities** → `styling.mdc` § Project-Specific Custom Utilities
- **Integrate HubSpot** → `integrations.mdc` § HubSpot Forms
- **Manage state** → `architecture.mdc` § State Management
- **Add routing** → `architecture.mdc` § Routing & Navigation
- **Optimize performance** → `architecture.mdc` § Performance
- **Handle security** → `architecture.mdc` § Security
- **Debug issues** → `architecture.mdc` § Testing & Debugging
- **Understand React Compiler** → `main.mdc` § React Compiler & Memoization
- **Handle images** → `main.mdc` § Image Optimization
- **Dev vs prod differences** → `main.mdc` § Development vs Production

---

## 🔄 Migration from Old Structure

### What Changed?

**5 files**:
1. `main.mdc` - Overview + cross-cutting concerns
2. `components.mdc` - React + WebGL
3. `styling.mdc` - CSS Modules + Tailwind
4. `integrations.mdc` - Third-party integrations (HubSpot, etc.)
5. `architecture.mdc` - Architecture patterns

### Benefits of Consolidation

✅ **Reduced duplication**: React Compiler, Image optimization, Dev/Prod guidelines now in ONE place
✅ **Easier to find**: Related content is together (e.g., all styling in one file)
✅ **Better context for AI**: Fewer files means more efficient context loading
✅ **Easier maintenance**: Less jumping between files, clearer organization
✅ **Clearer separation**: Each file has a distinct purpose

---

## 📝 Maintenance Guidelines

### When Editing Rules

1. **Avoid Duplication**: If content applies to multiple areas, put it in `main.mdc` and reference it
2. **Use Cross-References**: Link to other sections instead of duplicating content
3. **Keep It Focused**: Each file should maintain its specific purpose
4. **Update Dates**: Update the "Last updated" date when making changes
5. **Check Dependencies**: When updating one file, check if related files need updates

### Example Cross-Reference Pattern

```markdown
<!-- In components.mdc -->
## Performance Optimization
See main.mdc § React Compiler & Memoization for optimization guidelines.
```

### Adding New Content

**Ask yourself**:
- Is this component-specific? → `components.mdc`
- Is this styling-related? → `styling.mdc`
- Is this an integration? → `integrations.mdc`
- Is this architectural? → `architecture.mdc`
- Is this cross-cutting? → `main.mdc`

---

## 🚀 For Developers

### Quick Setup
1. These rules are automatically loaded by Cursor AI
2. All files have `alwaysApply: true` in frontmatter
3. Files apply to: `*.tsx, *.jsx, *.css, *.js, *.ts`

### Contributing
When adding new guidelines:
1. Choose the appropriate file
2. Follow existing formatting patterns
3. Add clear examples
4. Update this README if needed
5. Keep content focused and actionable

---

## 📊 File Statistics

| File | Purpose | Lines | Key Topics |
|------|---------|-------|------------|
| `main.mdc` | Overview & Cross-cutting | 244 | Tech stack, React 19.2, React Compiler, Images, Dev/Prod |
| `components.mdc` | React & WebGL | 467 | Components, Forms, WebGL, Three.js, Shaders, Activity |
| `styling.mdc` | All Styling | 467 | CSS Modules, Tailwind v4, Responsive, Custom utilities |
| `integrations.mdc` | Third-party Services | 451 | HubSpot, Best practices |
| `architecture.mdc` | Patterns & Quality | 391 | State, Routing, Performance, Security, Testing |

**Total**: 2,020 lines of consolidated, focused guidelines

---

Last updated: 2025-10-08

For questions or suggestions about these rules, contact the development team.

