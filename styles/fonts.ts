import localFont from 'next/font/local'

// Heading font - P22 Mackinac Pro (local)
const heading = localFont({
  src: [
    {
      path: '../public/fonts/Mackinac/P22MackinacPro-Book_25.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Mackinac/P22MackinacPro-BookItalic_15.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/Mackinac/P22MackinacPro-Medium_26.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Mackinac/P22MackinacPro-MedItalic_18.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/Mackinac/P22MackinacPro-Bold_16.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Mackinac/P22MackinacPro-BoldItalic_11.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/Mackinac/P22MackinacPro-ExtraBold_12.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/Mackinac/P22MackinacPro-ExBoldItalic_17.otf',
      weight: '800',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-heading',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

// Body font - Quiet Sans (local)
const body = localFont({
  src: [
    {
      path: '../public/fonts/QuietSans/Flatit  QuietSansExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  Quiet Sans ExtraLight Italic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  QuietSansLight.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  Quiet Sans Light Italic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  QuietSansRegular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  Quiet Sans Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  QuietSansSemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  Quiet Sans SemiBold Italic.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  Quiet Sans Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  Quiet Sans Bold Italic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  QuietSansExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/QuietSans/Flatit  Quiet Sans ExtraBold Italic.otf',
      weight: '800',
      style: 'italic',
    },
  ],
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
