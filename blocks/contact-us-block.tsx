'use client'

import { useState } from 'react'
import { Button } from '@/components/button'

export interface ContactUsBlockProps {
  headingLine1?: string
  headingLine2?: string
  bodyContent?: string
}

export function ContactUsBlock({
  headingLine1 = "Have a project?",
  headingLine2 = "Let's",
  bodyContent = 'Explore our portfolio of exceptional web design and custom websites that drive results for businesses worldwide.',
}: ContactUsBlockProps) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('pending')
    // TODO: Wire up to HubSpot contact form action
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus('success')
  }

  let submitLabel = 'Send Message'
  if (status === 'pending') submitLabel = 'Sending...'
  if (status === 'success') submitLabel = 'Message Sent!'

  return (
    <section className="py-15 px-5">
      <div className="wrapper mx-auto">
        <div className="bg-text rounded-[12px] p-10 grid grid-cols-1 dt:grid-cols-2 gap-10 dt:gap-[220px]">
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

            <div>
              <Button
                type="submit"
                color="neutral"
                size="sm"
                disabled={status === 'pending' || status === 'success'}
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
