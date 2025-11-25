const colors = {
  primary: '#ff4d00',
  secondary: '#4b749f',
  accent: '#fa971a',
  offwhite: '#f9f7f4',
  bluishgray: '#e8ebef',
  foreground: '#f9f7f4',
  white: '#ffffff',
  black: '#000000',
  text: '#000000',
} as const

const themeNames = ['light', 'dark'] as const
const colorNames = ['offwhite', 'bluishgray', 'text'] as const

const themes = {
  light: {
    offwhite: '#f9f7f4',
    bluishgray: '#e8ebef',
    text: '#000000',
  },
  dark: {
    offwhite: '#000000',
    bluishgray: '#1a1a1a',
    text: '#f9f7f4',
  },
} as const satisfies Themes

export { colors, themeNames, themes }

// UTIL TYPES
export type Themes = Record<
  (typeof themeNames)[number],
  Record<(typeof colorNames)[number], string>
>
