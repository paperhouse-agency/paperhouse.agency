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
    'line-height': '100%',
    'letter-spacing': '0em',
    'font-size': 96,
  },
  'heading-2': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '100%',
    'letter-spacing': '0em',
    'font-size': 72,
  },
  'heading-3': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '100%',
    'letter-spacing': '0em',
    'font-size': 48,
  },
  'heading-4': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '100%',
    'letter-spacing': '0em',
    'font-size': 32,
  },
  'heading-5': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '100%',
    'letter-spacing': '0em',
    'font-size': 24,
  },
  'heading-6': {
    'font-family': `var(${fonts.heading})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '100%',
    'letter-spacing': '0em',
    'font-size': 20,
  },
  'body-large': {
    'font-family': `var(${fonts.body})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '162.5%',
    'letter-spacing': '0em',
    'font-size': 18,
  },
  body: {
    'font-family': `var(${fonts.body})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '162.5%',
    'letter-spacing': '0em',
    'font-size': 16,
  },
  'body-small': {
    'font-family': `var(${fonts.body})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '162.5%',
    'letter-spacing': '0em',
    'font-size': 14,
  },
  mono: {
    'font-family': `var(${fonts.mono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '162.5%',
    'letter-spacing': '0em',
    'font-size': 16,
  },
  'mono-wide': {
    'font-family': `var(${fonts.mono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '162.5%',
    'letter-spacing': '0.1em',
    'text-transform': 'uppercase',
    'font-size': 14,
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
