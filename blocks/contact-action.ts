'use server'

import { validateFormWithTurnstile } from '@/integrations/mailchimp/turnstile'

export interface ContactFormState {
  status: 'idle' | 'success' | 'error'
  message: string
}

export async function contactFormAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const turnstileResult = await validateFormWithTurnstile(formData)
  if (!turnstileResult.isValid) {
    return { status: 'error', message: 'Security verification failed. Please try again.' }
  }

  const name = formData.get('fullName')?.toString().trim() ?? ''
  const email = formData.get('email')?.toString().trim() ?? ''
  const message = formData.get('message')?.toString().trim() ?? ''

  if (!name || !email || !message) {
    return { status: 'error', message: 'Please fill in all required fields.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  // TODO: Wire up to HubSpot
  return { status: 'success', message: '' }
}
