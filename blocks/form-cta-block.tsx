'use client'

import { useActionState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/button'
import { contactFormAction } from './contact-action'
import type { ContactFormState } from './contact-action'

export interface FormCtaBlockProps {
  headingLine1?: string
  headingLine2?: string
  bodyContent?: string
}

const initialState: ContactFormState = { status: 'idle', message: '' }

export function FormCtaBlock({
  headingLine1 = 'Have a project?',
  headingLine2 = "Let's",
  bodyContent = 'Explore our portfolio of exceptional web design and custom websites that drive results for businesses worldwide.',
}: FormCtaBlockProps) {
  const [state, formAction, isPending] = useActionState(
    contactFormAction,
    initialState
  )

  let submitLabel = 'Send Message'
  if (isPending) submitLabel = 'Sending...'
  if (state.status === 'success') submitLabel = 'Message Sent!'

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <section className="py-15 bg-text dt:bg-transparent dt:px-5">
        <div className="wrapper mx-auto">
          <div className="dt:bg-text dt:rounded-[12px] px-5 py-0 dt:p-10 grid grid-cols-1 dt:grid-cols-2 gap-10 dt:gap-[220px]">
            {/* Left: Heading + description */}
            <div className="flex flex-col gap-5 justify-center">
              <h2 className="heading-2 text-offwhite">
                {headingLine1}
                <br />
                {headingLine2} <span className="text-primary">Talk!</span>
              </h2>
              <p className="body-large text-offwhite/60">{bodyContent}</p>
            </div>

            {/* Right: Contact form */}
            <form action={formAction} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 dt:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  required
                  className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500"
                />
              </div>

              <div className="grid grid-cols-1 dt:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="budget"
                  placeholder="Budget"
                  className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500"
                />
                <input
                  type="text"
                  name="referral"
                  placeholder="How did you hear about us?"
                  className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500"
                />
              </div>

              <textarea
                name="message"
                placeholder="Enter details here..."
                rows={4}
                className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500 resize-none"
              />

              <div
                className="cf-turnstile"
                data-sitekey={
                  process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
                }
                data-theme="dark"
              />

              {state.status === 'error' && (
                <p className="body-small text-red-400">{state.message}</p>
              )}

              <div>
                <Button
                  type="submit"
                  color="neutral"
                  size="sm"
                  disabled={isPending || state.status === 'success'}
                >
                  {submitLabel}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
