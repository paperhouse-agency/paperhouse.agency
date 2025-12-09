# Animation Modules

This directory contains reusable animation modules that can be used across the application.

## Structure

Each animation module should:
- Be a client component (`'use client'`)
- Use `useGSAP` hook for GSAP animations
- Integrate with Lenis via ScrollTrigger (configured in `@/components/gsap/runtime`)
- Accept props for customization
- Be self-contained and reusable

## Available Modules

### AnimatedCardsGrid
**File:** `animated-cards-grid.tsx`

Animates a grid of cards with scroll-based fade-in/fade-out effect.

**Features:**
- Cards fade in from right to left with stagger effect when scrolling down
- Reverses animation when scrolling back up
- Synced with Lenis smooth scroll
- Debug markers in development mode

**Usage:**
```tsx
import { AnimatedCardsGrid } from '@/animations/animated-cards-grid'

<AnimatedCardsGrid
  cards={[
    { icon: MyIcon, heading: 'Title', content: 'Description' }
  ]}
/>
```

**Props:**
- `cards`: Array of `CardData` objects (icon, heading, content, alternate)

## Creating New Animation Modules

1. Create a new file in this directory
2. Export a named component (not default)
3. Use `useGSAP` hook for animations
4. Configure ScrollTrigger with proper start/end points and toggleActions
5. Add markers in development: `markers: process.env.NODE_ENV === 'development'`
6. Document your module in this README

## GSAP + Lenis Integration

The `GSAPRuntime` component (in `app/layout.tsx`) handles:
- GSAP ticker synchronization with Tempus
- ScrollTrigger registration with Lenis
- Global ScrollTrigger configuration

No need to manually configure these in individual animation modules.
