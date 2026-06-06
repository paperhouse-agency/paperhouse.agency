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
      className="cms-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="cms-modal">
        <div className="cms-modal-header">
          <span className="cms-mono-label">Media library</span>
          <button
            type="button"
            className="cms-sidebar-collapse-btn"
            onClick={onClose}
            title="Close"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="cms-modal-body">
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
