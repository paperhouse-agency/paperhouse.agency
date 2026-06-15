import type { Metadata, Viewport } from 'next'
import { Suspense, type PropsWithChildren } from 'react'
import { ReactTempus } from 'tempus/react'
import { RealViewport } from '@/components/real-viewport'
import AppData from '@/package.json'
import { themes } from '@/styles/colors'
import '@/styles/css/index.css'

import { MicrosoftClarity } from '@/integrations/clarity'
import { GSAPRuntime } from '@/components/gsap/runtime'
import { isClarityConfigured } from '@/integrations/check-integration'
import { OrchestraTools } from '@/orchestra'
import { fontsVariable } from '@/styles/fonts'

const APP_NAME = AppData.name
const APP_DEFAULT_TITLE = 'PaperHouse'
const APP_TITLE_TEMPLATE = '%s - PaperHouse'
const APP_DESCRIPTION = AppData.description
const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: APP_BASE_URL,
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: APP_DEFAULT_TITLE,
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  authors: [
    { name: 'darkroom.engineering', url: 'https://darkroom.engineering' },
  ],
  other: {
    'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
  },
}

export const viewport: Viewport = {
  themeColor: themes.light.offwhite,
  colorScheme: 'normal',
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={fontsVariable}
      suppressHydrationWarning
    >
      <body>
        {/* Critical: CSS custom properties needed for layout */}
        <RealViewport />

        {/* Main app content */}
        {children}

        {/* Development tools - dynamically imported */}
        <Suspense>
          <OrchestraTools />
        </Suspense>

        {/* Animation framework */}
        <GSAPRuntime />

        {/* RAF management */}
        <ReactTempus />

        {/* Microsoft Clarity - only when project ID is configured */}
        {isClarityConfigured() && <MicrosoftClarity />}
      </body>
    </html>
  )
}
