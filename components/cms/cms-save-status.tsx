'use client'

import { useCmsStatus } from '@/libs/cms/status-store'

export function CmsSaveStatus() {
  const { isSaving, isDirty, lastSaved } = useCmsStatus()

  if (isSaving) {
    return <span className="font-mono text-[11.5px] tracking-[0.04em] text-[var(--chrome-muted)] whitespace-nowrap">Saving…</span>
  }

  if (isDirty) {
    return <span className="font-mono text-[11.5px] tracking-[0.04em] text-[#b87c20] whitespace-nowrap">● Unsaved</span>
  }

  if (lastSaved) {
    return <span className="font-mono text-[11.5px] tracking-[0.04em] text-[#1f8a5b] whitespace-nowrap">✓ Saved</span>
  }

  return null
}
