[![PaperHouse](./public/paperhouse-banner.jpg)](https://github.com/paperhouse-agency/paperhouse.agency)

# PaperHouse

PaperHouse Agency WEbsite

<!-- [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/darkroomengineering/satus) -->

<!-- > **Note**: This README is for developers working on the PaperHouse template. For client/team handoff documentation, see [PROD-README.md](PROD-README.md) (replace this README in production projects). -->

## Quick Start

```bash
# Install dependencies
bun install

# Create .env.local (see Environment Variables below)
# touch .env.local

# Start development server with Turbopack
bun dev

# Build for production
bun build

# Start production server
bun start
```

## 🛠 Tech Stack

- **[Next.js](https://nextjs.org)** - React framework with App Router and Turbopack
- **[React 19.2.0](https://react.dev)** - Latest React with `<Activity />`, `useEffectEvent`, and `cacheSignal`
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com)** - CSS-first configuration
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[GSAP](https://greensock.com/gsap/)** - Timeline-based animations
- **[Biome](https://biomejs.dev)** - Fast formatter and linter
- **[Bun](https://bun.sh)** - All-in-one JavaScript runtime

## 📁 Project Structure

```
satus/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── integrations/           # Third-party service integrations
│   ├── hubspot/           # HubSpot forms integration
│   └── sanity/            # Headless CMS
├── libs/                   # Utility functions and helpers
├── orchestra/              # Debug and development tools
│   ├── grid/              # Grid overlay
│   ├── minimap/           # Page minimap
│   ├── stats/             # Performance stats
│   └── theatre/           # Animation tools
├── styles/                 # Global styles and configuration
├── webgl/                  # 3D graphics and WebGL components
└── public/                 # Static assets
```

## Managing Integrations

Check which integrations are configured:

```bash
bun validate:env              # Check environment setup
bun cleanup:integrations      # List unused integrations
```

Remove unused integrations to reduce bundle size (~250-400KB potential savings). See [Integrations Documentation](integrations/README.md) for detailed removal instructions.

## 🌐 Environment Variables

Create a `.env.local` file with:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_STUDIO_URL="http://localhost:3000/studio"
SANITY_API_WRITE_TOKEN="your-write-token"

# HubSpot
HUBSPOT_ACCESS_TOKEN="your-access-token"
NEXT_PUBLIC_HUBSPOT_PORTAL_ID="your-portal-id"

# App Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 📚 Documentation

- [App](app/README.md) - Next.js structure and routing
- [Integrations](integrations/README.md) - Third-party integrations
- [Components](components/README.md) - UI components
- [Hooks](hooks/README.md) - Custom React hooks
- [Libs](libs/README.md) - Utility libraries
- [Styles](styles/README.md) - Styling system
- [Scripts](styles/scripts/README.md) - Style generation
- [WebGL](webgl/README.md) - 3D graphics
- [Orchestra](orchestra/README.md) - Debug tools

## Deployment

Deploy to Vercel (recommended):

```bash
vercel
```

### Pre-deployment Checklist
- [ ] Environment variables configured
- [ ] Sanity webhooks set up
- [ ] GSAP license valid (if using premium)
- [ ] SSL certificates configured
- [ ] Performance metrics validated

### Other Platforms
Supports any Next.js-compatible platform: Vercel, Netlify, AWS Amplify, Google Cloud Run, or self-hosted.

## Important Notes

**Images & Links**
- ✅ Always use `~/components/link` (auto-detects external, smart prefetch)
- ✅ Always use `~/components/image` for DOM (never `next/image`)
- ✅ Use `~/webgl/components/image` in WebGL contexts

**GSAP & Animation**
- Add `<GSAPRuntime />` in `app/layout.tsx` for ScrollTrigger + Lenis
- No manual ticker setup needed

**Sanity**
- Requires draft mode routes: `/api/draft-mode/enable` and `/api/draft-mode/disable`
- Must set `NEXT_PUBLIC_BASE_URL` for preview resolution

**Orchestra**
- Toggle debug tools with `Cmd/Ctrl + O`
- State persists in `localStorage` and syncs across tabs
- Automatically excluded from production builds

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/fix-everything`)
3. Commit your changes (`git commit -m 'Add fix everything feature'`)
4. Push to the branch (`git push origin feature/fix-everything`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built by [darkroom.engineering](https://darkroom.engineering)
- Inspired by modern web development best practices
- Community contributions and feedback
