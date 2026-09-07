'use client'

import { useActionState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/button'
import { contactFormAction } from './contact-action'
import type { ContactFormState } from './contact-action'

export interface FormCtaPlaceholders {
  fullName: string
  email: string
  budget: string
  referral: string
  details: string
}

export interface FormCtaBlockProps {
  headingLine1?: string
  headingLine2?: string
  headingHighlight: string
  bodyContent?: string
  placeholders: FormCtaPlaceholders
  submitLabel: string
  submittingLabel: string
  submittedLabel: string
}

const initialState: ContactFormState = { status: 'idle', message: '' }

export function FormCtaBlock({
  headingLine1,
  headingLine2,
  headingHighlight,
  bodyContent,
  placeholders,
  submitLabel: submitLabelText,
  submittingLabel,
  submittedLabel,
}: FormCtaBlockProps) {
  const [state, formAction, isPending] = useActionState(
    contactFormAction,
    initialState
  )

  let submitLabel = submitLabelText
  if (isPending) submitLabel = submittingLabel
  if (state.status === 'success') submitLabel = submittedLabel

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
                {headingLine2} <span className="text-primary">{headingHighlight}</span>
              </h2>
              <p className="body-large text-offwhite/60">{bodyContent}</p>
            </div>

            {/* Right: Contact form */}
            <form action={formAction} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 dt:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="fullName"
                  placeholder={placeholders.fullName}
                  required
                  className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder={placeholders.email}
                  required
                  className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500"
                />
              </div>

              <div className="grid grid-cols-1 dt:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="budget"
                  placeholder={placeholders.budget}
                  className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500"
                />
                <input
                  type="text"
                  name="referral"
                  placeholder={placeholders.referral}
                  className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500"
                />
              </div>

              <textarea
                name="message"
                placeholder={placeholders.details}
                rows={4}
                className="bg-text border border-bluishgray rounded px-2.5 py-2 body text-offwhite placeholder:text-offwhite/40 outline-none focus:border-offwhite/60 transition-colors duration-500 resize-none"
              />

              <div
                className="cf-turnstile"
                data-sitekey={
                  process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
                }
                data-appearance="interaction-only"
                data-size="invisible"
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
