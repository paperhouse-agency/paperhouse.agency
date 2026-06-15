'use client'

import { useState } from 'react'

type State = 'idle' | 'loading' | 'success' | 'error'

export function PublishButton() {
  const [state, setState] = useState<State>('idle')

  async function handlePublish() {
    if (state === 'loading') return
    setState('loading')
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'x-requested-with': 'XMLHttpRequest' },
      })
      setState(res.ok ? 'success' : 'error')
    } catch {
      setState('error')
    } finally {
      setTimeout(() => setState('idle'), 3000)
    }
  }

  const label = state === 'loading' ? 'Publishing…' : state === 'success' ? 'Published!' : state === 'error' ? 'Failed' : 'Publish'

  const colors =
    state === 'success'
      ? 'bg-green-600 text-white'
      : state === 'error'
        ? 'bg-red-600 text-white'
        : 'bg-primary text-offwhite hover:opacity-80'

  return (
    <button
      type="button"
      onClick={handlePublish}
      disabled={state === 'loading'}
      className={`font-mono text-[12.5px] tracking-[0.06em] px-[14px] py-[7px] rounded-full cursor-pointer whitespace-nowrap transition-[background,opacity] duration-150 disabled:cursor-not-allowed ${colors}`}
    >
      {label}
    </button>
  )
}
