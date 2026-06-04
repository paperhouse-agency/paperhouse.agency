'use client'
import type { BlockSchema } from '@/libs/cms/block-schema'

import { useActionState } from 'react'
import Script from 'next/script'
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
  preheadingContent = 'THE PAPER TRAIL',
  headingContent = 'One sharp idea on design & building, every two weeks',
  bodyContent = "No fluff, no spam. Just the things we're learning in the studio. Join 4,000+ founders and makers",
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
      ? (errorMessages[state.message] ?? 'Something went wrong. Please try again.')
      : null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <section className="py-15 px-5">
        <div className="wrapper mx-auto">
          <div className="relative bg-primary rounded-3xl overflow-hidden px-8 py-12 dt:px-16 dt:py-20 flex flex-col dt:flex-row dt:items-center gap-10 dt:gap-20">

            {/* Decorative circles */}
            <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-28 right-32 w-96 h-96 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

            {/* Left: text content */}
            <div className="relative flex flex-col gap-5 dt:flex-1">
              <p className="mono-wide text-offwhite/70">{preheadingContent}</p>
              <h2 className="heading-2 text-offwhite">{headingContent}</h2>
              <p className="body text-offwhite/70">{bodyContent}</p>
            </div>

            {/* Right: form */}
            <div className="relative flex flex-col gap-3 w-full dt:w-96 dt:shrink-0">
              {isSuccess ? (
                <div className="flex flex-col gap-2.5">
                  <p className="heading-4 text-offwhite">You're in!</p>
                  <p className="body text-offwhite/70">
                    Thanks for subscribing. We'll be in touch.
                  </p>
                </div>
              ) : (
                <>
                  <form action={formAction} className="flex flex-col gap-3">
                    <div className="flex items-center bg-white rounded-full p-1.5 gap-2">
                      <input
                        type="email"
                        name="email"
                        placeholder="you@company.com"
                        required
                        defaultValue={state.inputs?.email}
                        className="flex-1 bg-transparent pl-3 body text-text placeholder:text-text/40 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isPending}
                        className="bg-text text-offwhite body rounded-full px-5 py-2 shrink-0 transition-colors duration-500 hover:bg-text/80 disabled:opacity-60"
                      >
                        {isPending ? 'Subscribing...' : 'Subscribe'}
                      </button>
                    </div>

                    <div
                      className="cf-turnstile"
                      data-sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
                      data-theme="dark"
                    />

                    {(emailError || turnstileError || serverError) && (
                      <p className="body-small text-offwhite/80">
                        {emailError && (errorMessages[emailError] ?? emailError)}
                        {!emailError && turnstileError && 'Security verification failed. Please try again.'}
                        {!(emailError || turnstileError) && serverError}
                      </p>
                    )}
                  </form>

                  <p className="mono-wide text-offwhite/60" style={{ fontSize: '11px' }}>
                    Unsubscribe any time. We respect your inbox
                  </p>
                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  )
}


export const cmsSchema: BlockSchema = {
  type: 'newsletter',
  label: 'Newsletter',
  icon: 'Mail',
  fields: [
    { key: 'preheadingContent', label: 'Preheading', type: 'text', placeholder: 'THE PAPER TRAIL' },
    { key: 'headingContent', label: 'Heading', type: 'text', span: 'full', placeholder: 'One sharp idea on design & building, every two weeks' },
    { key: 'bodyContent', label: 'Body', type: 'textarea', span: 'full', description: 'Short subheading below the main heading' },
  ],
  defaultData: () => ({
    _id: crypto.randomUUID(),
    _type: 'newsletter',
    preheadingContent: '',
    headingContent: '',
    bodyContent: '',
  }),
}
