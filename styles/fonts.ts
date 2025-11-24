import { IBM_Plex_Sans } from 'next/font/google'
import localFont from 'next/font/local'

// Heading font - Bianco Serif (local)
const heading = localFont({
  src: [
    {
      path: '../public/fonts/BiancoSerif/BiancoSerif-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/BiancoSerif/BiancoSerif-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/BiancoSerif/BiancoSerif-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/BiancoSerif/BiancoSerif-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/BiancoSerif/BiancoSerif-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/BiancoSerif/BiancoSerif-ExtraBoldItalic.woff2',
      weight: '800',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-heading',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

// Body font - IBM Plex Sans (Google Fonts)
const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-body',
  preload: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'sans-serif',
  ],
})

// Monospace font - PP Neue Montreal Mono (local)
const mono = localFont({
  src: [
    {
      path: '../public/fonts/PPNeueMontrealMono/PPNeueMontrealMono-Book.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPNeueMontrealMono/PPNeueMontrealMono-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/PPNeueMontrealMono/PPNeueMontrealMono-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPNeueMontrealMono/PPNeueMontrealMono-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPNeueMontrealMono/PPNeueMontrealMono-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-mono',
  preload: true,
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'monospace',
  ],
})

const fonts = [heading, body, mono]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable, heading, body, mono }
