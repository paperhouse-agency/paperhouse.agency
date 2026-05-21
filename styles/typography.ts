import type { CSSProperties } from 'react'

const fonts = {
  heading: '--font-heading', // Bianco Serif
  body: '--font-body', // IBM Plex Sans
  mono: '--font-mono', // PP Neue Montreal Mono
} as const

const typography: TypeStyles = {
  'heading-1': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0em',
    'font-size': { mobile: 32, desktop: 58 },
  },
  'heading-2': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0em',
    'font-size': { mobile: 26, desktop: 44 },
  },
  'heading-3': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0em',
    'font-size': { mobile: 22, desktop: 32 },
  },
  'heading-4': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0em',
    'font-size': { mobile: 18, desktop: 24 },
  },
  'heading-5': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0em',
    'font-size': { mobile: 15, desktop: 18 },
  },
  'heading-6': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0em',
    'font-size': { mobile: 14, desktop: 16 },
  },
  'body-large': {
    'font-family': `var(${fonts.body})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '130%',
    'letter-spacing': '0em',
    'font-size': { mobile: 17, desktop: 20 },
  },
  body: {
    'font-family': `var(${fonts.body})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '125%',
    'letter-spacing': '0em',
    'font-size': { mobile: 15, desktop: 16 },
  },
  'body-small': {
    'font-family': `var(${fonts.body})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '125%',
    'letter-spacing': '0em',
    'font-size': 12,
  },
  mono: {
    'font-family': `var(${fonts.mono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '100%',
    'letter-spacing': '0em',
    'font-size': { mobile: 13, desktop: 14 },
  },
  'mono-wide': {
    'font-family': `var(${fonts.mono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '125%',
    'letter-spacing': '0.1em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 13, desktop: 16 },
  },
} as const

export { fonts, typography }

// UTIL TYPES
type TypeStyles = Record<
  string,
  {
    'font-family': string
    'font-style': CSSProperties['fontStyle']
    'font-weight': CSSProperties['fontWeight']
    'line-height':
      | `${number}%`
      | { mobile: `${number}%`; desktop: `${number}%` }
    'letter-spacing':
      | `${number}em`
      | { mobile: `${number}em`; desktop: `${number}em` }
    'font-feature-settings'?: string
    'text-transform'?: CSSProperties['textTransform']
    'font-size': number | { mobile: number; desktop: number }
  }
>
