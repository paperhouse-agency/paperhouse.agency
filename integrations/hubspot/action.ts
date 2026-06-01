'use server'

import { fetchWithTimeout } from '@/libs/fetch-with-timeout'
import { validateFormWithTurnstile } from '@/integrations/turnstile'
import type { ErrorField, FormState } from '@/components/form/types'

export interface ContactFormState {
  status: 'idle' | 'success' | 'error'
  message: string
}

async function submitToHubspot(
  formId: string | undefined,
  fields: Array<{ name: string; value: string }>
): Promise<{ ok: boolean }> {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID
  if (!(portalId && formId)) {
    throw new Error(
      'Missing HubSpot configuration: NEXT_PUBLIC_HUBSPOT_PORTAL_ID or form ID'
    )
  }

  const response = await fetchWithTimeout(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
      timeout: 8000,
    }
  )

  return { ok: response.ok }
}

export async function hubspotNewsletterAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email')?.toString().trim() ?? ''
  const errors = new Map() as ErrorField

  const turnstile = await validateFormWithTurnstile(formData)
  if (!turnstile.isValid) {
    for (const error of turnstile.errors) {
      errors.set('turnstile', { state: true, message: error })
    }
  }

  if (!email) {
    errors.set('email', { state: true, message: 'email_required_' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.set('email', { state: true, message: 'invalid_email_format_' })
  }

  if (errors.size > 0) {
    return { status: 400, message: 'invalid_input_', errors, inputs: { email } }
  }

  try {
    const { ok } = await submitToHubspot(process.env.NEXT_HUBSPOT_FORM_ID, [
      { name: 'email', value: email },
    ])

    if (!ok) {
      return {
        status: 500,
        message: 'subscription_failed_',
        errors: new Map(),
        inputs: { email },
      }
    }

    return {
      status: 200,
      message: 'subscription_successful_',
      errors: new Map(),
      inputs: {},
    }
  } catch (error) {
    console.error('HubSpot newsletter error:', error)
    return {
      status: 500,
      message: 'subscription_failed_',
      errors: new Map(),
      inputs: { email },
    }
  }
}

export async function hubspotContactAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const turnstile = await validateFormWithTurnstile(formData)
  if (!turnstile.isValid) {
    return {
      status: 'error',
      message: 'Security verification failed. Please try again.',
    }
  }

  const fullName = formData.get('fullName')?.toString().trim() ?? ''
  const email = formData.get('email')?.toString().trim() ?? ''
  const message = formData.get('message')?.toString().trim() ?? ''
  const budget = formData.get('budget')?.toString().trim() ?? ''
  const referral = formData.get('referral')?.toString().trim() ?? ''

  if (!(fullName && email && message)) {
    return { status: 'error', message: 'Please fill in all required fields.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const [firstname, ...rest] = fullName.split(' ')
  const lastname = rest.join(' ')

  const fields: Array<{ name: string; value: string }> = [
    { name: 'firstname', value: firstname },
    { name: 'lastname', value: lastname },
    { name: 'email', value: email },
    { name: 'message', value: message },
  ]
  if (budget) fields.push({ name: 'budget', value: budget })
  if (referral)
    fields.push({ name: 'how_did_you_hear_about_us_', value: referral })

  try {
    const { ok } = await submitToHubspot(
      process.env.NEXT_HUBSPOT_CONTACT_FORM_ID,
      fields
    )

    if (!ok) {
      return {
        status: 'error',
        message: 'Something went wrong. Please try again.',
      }
    }

    return { status: 'success', message: '' }
  } catch (error) {
    console.error('HubSpot contact error:', error)
    return {
      status: 'error',
      message: 'Something went wrong. Please try again.',
    }
  }
}
