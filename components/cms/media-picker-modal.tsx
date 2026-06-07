'use client'

import { useEffect } from 'react'
import { MediaManager, type MediaAsset } from './media-manager'

interface Props {
  currentUrl?: string
  onSelect: (asset: MediaAsset) => void
  onClose: () => void
}

export function MediaPickerModal({ currentUrl, onSelect, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape key handled via useEffect
    <div
      className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,0.45)] backdrop-blur-[4px] flex items-center justify-center p-[24px] animate-[cms-backdrop-in_0.15s_ease]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[var(--workspace)] rounded-[14px] shadow-[0_32px_80px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.06)] flex flex-col w-[min(960px,100%)] h-[min(660px,90svh)] overflow-hidden animate-[cms-modal-in_0.18s_cubic-bezier(0.34,1.4,0.64,1)]">
        <div className="flex items-center justify-between px-[22px] py-[14px] pr-[18px] border-b border-[var(--chrome-border)] flex-none bg-[var(--chrome)]">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Media library</span>
          <button
            type="button"
            className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-[var(--chrome-muted)] cursor-pointer transition-[background,color] duration-[120ms] flex-none hover:bg-[rgba(26,26,26,0.08)] hover:text-text"
            onClick={onClose}
            title="Close"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <MediaManager
            onSelect={(asset) => {
              onSelect(asset)
              onClose()
            }}
            selectedUrl={currentUrl}
          />
        </div>
      </div>
    </div>
  )
}
