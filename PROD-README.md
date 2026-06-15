# PaperHouse

Production documentation for PaperHouse, built with the Satūs framework by [darkroom.engineering](https://darkroom.engineering).

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Get environment variables from Vercel
vercel link
vercel env pull

# 3. Start development
bun dev
```

## Environment Variables

Required in `.env.local`:

```env
# Base URL
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# GSAP (if using premium features)
GSAP_AUTH_TOKEN="your-gsap-token"
```

## Core Technologies

### Animation
- **GSAP**: General animations and timeline sequences
- **Theatre.js**: Complex animation choreography
- [GSAP Documentation](components/gsap/README.md)

### Styling
- **Hybrid System**: Tailwind CSS v4 + PostCSS
- **Responsive Units**: `mobile-vw()` and `desktop-vw()` functions
- **Grid**: 4 columns (mobile) / 12 columns (desktop)
- [Styling Documentation](styles/README.md)

## Tech Stack

**Core**
- Next.js, React, TypeScript, Bun

**3D & Animation**
- Three.js, React Three Fiber, Theatre.js, GSAP

**Integrations**
- HubSpot

**UI & Styling**
- CSS Modules, Tailwind CSS, Base UI

**Performance**
- Lenis, Hamo, Tempus, Zustand

## Available Scripts

```bash
bun dev              # Development server
bun build            # Production build
bun start            # Start production server
bun lint             # Run linter
bun typecheck        # TypeScript validation
bun setup:styles     # Regenerate styles
bun analyze          # Bundle analysis
```

## Debug Tools (CMD+O)

- Theatre.js Studio (⚙️)
- Performance Stats (📈)
- Grid Debug (🌐)
- Development Mode (🚧)
- Minimap (🗺️)

## Project Structure

```
project/
├── app/                # Next.js pages and routes
│   └── (pages)/       # Page components
├── components/         # Reusable UI components
├── integrations/       # Third-party integrations (HubSpot)
├── libs/              # Utilities and helpers
├── styles/            # Styling system
└── webgl/             # 3D graphics and WebGL
```

## Documentation

- [Integrations](integrations/README.md) - All third-party integrations
- [Styles System](styles/README.md) - Styling and theming
- [Components Guide](components/README.md) - UI components
- [Hooks Documentation](hooks/README.md) - Custom React hooks
- [WebGL Components](webgl/README.md) - 3D graphics

## Deployment

### Pre-deployment Checklist
1. ✅ Environment variables set in Vercel
2. ✅ GSAP license valid (if using premium)
3. ✅ SSL certificates configured
4. ✅ Performance metrics validated

### Monitoring
- Vercel Analytics Dashboard
- Lighthouse CI Reports
- Performance hooks (`hooks/use-performance.ts`)

---

Built with [Satūs](https://github.com/darkroomengineering/satus) by [darkroom.engineering](https://darkroom.engineering)
