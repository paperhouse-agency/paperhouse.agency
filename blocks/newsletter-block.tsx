'use client'

import { useActionState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/button'
import { hubspotNewsletterAction } from '@/integrations/hubspot/action'
import type { FormState } from '@/components/form/types'

const initialState: FormState = {
  status: 0,
  message: '',
  inputs: {},
  errors: new Map(),
}

const errorMessages: Record<string, string> = {
  email_required_: 'Please enter your email address.',
  invalid_email_format_: 'Please enter a valid email address.',
  subscription_failed_: 'Something went wrong. Please try again.',
  invalid_email_: 'This email address appears to be invalid.',
}

export interface NewsletterBlockProps {
  preheadingContent?: string
  headingContent?: string
  bodyContent?: string
}

export function NewsletterBlock({
  preheadingContent = 'NEWSLETTER',
  headingContent = 'Stay in the Loop',
  bodyContent = 'Get the latest insights on design, development, and digital growth delivered straight to your inbox.',
}: NewsletterBlockProps) {
  const [state, formAction, isPending] = useActionState(
    hubspotNewsletterAction,
    initialState
  )

  const isSuccess = state.status === 200
  const emailError = state.errors?.get('email')?.message
  const turnstileError = state.errors?.get('turnstile')?.message
  const serverError =
    state.status === 500
      ? (errorMessages[state.message] ??
        'Something went wrong. Please try again.')
      : null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <section className="py-15 px-5 bg-bluishgray">
        <div className="wrapper mx-auto flex flex-col items-center text-center gap-10">
          <div className="flex flex-col items-center gap-2.5">
            <p className="mono-wide text-primary">{preheadingContent}</p>
            <h2 className="heading-2 text-text">{headingContent}</h2>
            <p className="body-large text-text/60 max-w-xl">{bodyContent}</p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center gap-2.5">
              <p className="heading-4 text-text">You're in!</p>
              <p className="body-large text-text/60">
                Thanks for subscribing. We'll be in touch.
              </p>
            </div>
          ) : (
            <form
              action={formAction}
              className="flex flex-col items-center gap-5 w-full max-w-lg"
            >
              <div className="flex flex-col dt:flex-row gap-3 w-full">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  required
                  defaultValue={state.inputs?.email}
                  className="flex-1 bg-white border border-bluishgray rounded-full px-5 py-2 body text-text text-start placeholder:text-text/40 outline-none focus:border-text/40 transition-colors duration-500"
                />
                <Button
                  type="submit"
                  variant="default"
                  color="primary"
                  size="md"
                  hasIcon
                  disabled={isPending}
                  className="body!"
                >
                  {isPending ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>

              <div
                className="cf-turnstile"
                data-sitekey={
                  process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
                }
                data-theme="light"
              />

              {(emailError || turnstileError || serverError) && (
                <p className="body-small text-red-500">
                  {emailError && (errorMessages[emailError] ?? emailError)}
                  {!emailError &&
                    turnstileError &&
                    'Security verification failed. Please try again.'}
                  {!(emailError || turnstileError) && serverError}
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </>
  )
}
