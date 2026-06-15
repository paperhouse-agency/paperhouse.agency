# Integrations

This directory contains integrations with external services and APIs used throughout the application.

## Available Integrations

- `hubspot/` - HubSpot forms and marketing ([Documentation](hubspot/README.md))
- `mailchimp/` - Email marketing ([Documentation](mailchimp/README.md))
- `check-integration.ts` - Integration detection utilities

## HubSpot Integration

Form handling and marketing automation. [Full Documentation →](hubspot/README.md)

**Quick Example:**
```tsx
import { EmbedHubspotForm } from '@/integrations/hubspot/embed'

<EmbedHubspotForm formId="your-form-id" />
```

## Mailchimp Integration

Email marketing and audience building. [Full Documentation →](mailchimp/README.md)

**Quick Example:**
```tsx
import { mailchimpSubscriptionAction } from '@/integrations/mailchimp/action'

<Form action={mailchimpSubscriptionAction}>
  <Input name="email" type="email" required />
  <SubmitButton>Subscribe</SubmitButton>
</Form>
```

## Environment Variables

```env
# HubSpot
HUBSPOT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=your-portal-id

# Mailchimp
MAILCHIMP_API_KEY=your-api-key
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=your-audience-id

# Cloudflare Turnstile (optional, for bot protection)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your-site-key
CLOUDFLARE_TURNSTILE_SECRET_KEY=your-secret-key

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXX
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_APP_ID=your-fb-app-id
```

---

## Managing Integrations

Run the cleanup helper to identify unused integrations:

```bash
bun cleanup:integrations
```

### Conditional Loading

Conditionally load integrations based on configuration:

```tsx
import { isHubSpotConfigured } from '@/integrations/check-integration'

export default function Page() {
  if (isHubSpotConfigured()) {
    return <div>HubSpot configured</div>
  }

  return <div>HubSpot not configured</div>
}
```

**Available check functions:**
- `isHubSpotConfigured()`
- `isMailchimpConfigured()`
- `isAnalyticsConfigured()`
- `isTurnstileConfigured()`

### After Removal

1. **Clean up imports**: Run `bun lint:fix` to catch any broken imports
2. **Update dependencies**: Run `bun install` to clean up lock file
3. **Test build**: Run `bun build` to ensure everything still works
