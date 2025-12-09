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

---

### AnimatedFlowSteps
**File:** `animated-flow-steps.tsx`

Progressive scroll-based reveal of flow step cards with animated connecting line.

**Features:**
- Full-screen pinned section during scroll
- First card visible on entry with 20% line width
- Subsequent cards fade in from right to left as you scroll
- Line grows by 25% for each card (20% → 45% → 70% → 95% → 120%)
- Active card dynamically receives alternate styling
- Section unpins after all cards are revealed

**Usage:**
```tsx
import { AnimatedFlowSteps } from '@/animations/animated-flow-steps'

<AnimatedFlowSteps
  steps={[
    { icon: MyIcon, number: '01', heading: 'Step 1', content: 'Description' }
  ]}
/>
```

**Props:**
- `steps`: Array of `FlowStepCard` objects (icon, number, heading, content, alternate)

**Technical Details:**
- Uses ScrollTrigger with `pin: true`, `pinSpacing: true`, and `scrub: 1`
- Duration: `steps.length * 150%` of scroll distance (150% viewport height per card)
- Active index updates dynamically based on scroll progress
- Only the currently active card receives `alternate={true}` styling
- Smooth scroll integration via Lenis

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
