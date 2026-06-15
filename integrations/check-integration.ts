/**
 * Integration Configuration Checker
 *
 * Utilities to check if integrations are configured via environment variables.
 * This helps with tree-shaking unused integrations from the bundle.
 */

/**
 * Check if HubSpot is configured
 * Requires: HUBSPOT_ACCESS_TOKEN or NEXT_PUBLIC_HUBSPOT_PORTAL_ID
 */
export function isHubSpotConfigured(): boolean {
  return Boolean(
    process.env.HUBSPOT_ACCESS_TOKEN ||
      process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID
  )
}

/**
 * Check if Google Analytics is configured
 * Requires: NEXT_PUBLIC_GOOGLE_ANALYTICS or NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
 */
export function isAnalyticsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ||
      process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID ||
      process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
  )
}

/**
 * Check if Microsoft Clarity is configured
 * Requires: NEXT_PUBLIC_CLARITY_PROJECT_ID
 */
export function isClarityConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID)
}

/**
 * Check if Cloudflare Turnstile is configured
 * Requires: NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY and CLOUDFLARE_TURNSTILE_SECRET_KEY
 */
export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY &&
      process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  )
}

/**
 * Get a list of all configured integrations
 */
export function getConfiguredIntegrations(): string[] {
  const integrations: string[] = []

  if (isHubSpotConfigured()) integrations.push('HubSpot')
  if (isTurnstileConfigured()) integrations.push('Turnstile')
  if (isClarityConfigured()) integrations.push('Clarity')

  return integrations
}

/**
 * Get a list of all unconfigured integrations
 */
export function getUnconfiguredIntegrations(): string[] {
  const integrations: string[] = []

  if (!isHubSpotConfigured()) integrations.push('HubSpot')
  if (!isTurnstileConfigured()) integrations.push('Turnstile')
  if (!isClarityConfigured()) integrations.push('Clarity')

  return integrations
}
