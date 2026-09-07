import type { MetadataRoute } from 'next'
import { getSiteSeo } from '@/libs/seo/queries'

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:3000'

/**
 * AI crawlers that read pages to train or ground generative answers (GEO).
 * Marketing toggles these from HQ via `site_seo.allow_ai_crawlers`.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Applebot-Extended',
  'meta-externalagent',
  'Bytespider',
]

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteSeo()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: AI_CRAWLERS,
        ...(site.allowAiCrawlers
          ? { allow: '/', disallow: ['/api/'] }
          : { disallow: '/' }),
      },
    ],
    sitemap: `${APP_BASE_URL}/sitemap.xml`,
  }
}
