'use client'

import { useState, useRef, useEffect } from 'react'
import type { MediaAsset } from './media-manager'

interface UploadFile {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  result?: MediaAsset
  error?: string
}

interface Props {
  onClose: () => void
  onUploaded: (assets: MediaAsset[]) => void
}

export function UploadModal({ onClose, onUploaded }: Props) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !uploading) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, uploading])

  function addFiles(incoming: FileList | File[]) {
    const arr = Array.from(incoming).filter((f) => f.type.startsWith('image/'))
    const next: UploadFile[] = arr.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }))
    setFiles((prev) => [...prev, ...next])
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id)
      if (f) URL.revokeObjectURL(f.preview)
      return prev.filter((x) => x.id !== id)
    })
  }

  async function handleUpload() {
    const pending = files.filter((f) => f.status === 'pending')
    if (!pending.length) return
    setUploading(true)

    const uploaded: MediaAsset[] = []

    for (const item of pending) {
      setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'uploading' } : f))

      try {
        const res = await fetch('/api/admin/media', {
          method: 'POST',
          headers: {
            'Content-Type': item.file.type,
            'x-filename': item.file.name,
            'x-requested-with': 'XMLHttpRequest',
          },
          body: item.file,
        })
        const data = (await res.json()) as MediaAsset & { error?: string }
        if (!(res.ok && data.url)) throw new Error(data.error ?? 'Upload failed')
        uploaded.push(data)
        setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'done', result: data } : f))
      } catch (e) {
        setFiles((prev) => prev.map((f) =>
          f.id === item.id ? { ...f, status: 'error', error: e instanceof Error ? e.message : 'Failed' } : f,
        ))
      }
    }

    setUploading(false)
    if (uploaded.length > 0) {
      onUploaded(uploaded)
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const allDone = files.length > 0 && files.every((f) => f.status === 'done' || f.status === 'error')
  const hasPending = files.some((f) => f.status === 'pending')

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape handled via useEffect
    <div
      className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,0.45)] backdrop-blur-[4px] flex items-center justify-center p-[24px] animate-[cms-backdrop-in_0.15s_ease]"
      onClick={(e) => { if (e.target === e.currentTarget && !uploading) onClose() }}
    >
      <div className="bg-[var(--workspace)] rounded-[14px] shadow-[0_32px_80px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.06)] flex flex-col w-[min(560px,100%)] max-h-[min(720px,90svh)] overflow-hidden animate-[cms-modal-in_0.18s_cubic-bezier(0.34,1.4,0.64,1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-[22px] py-[14px] pr-[18px] border-b border-[var(--chrome-border)] flex-none bg-[var(--chrome)]">
          <div>
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary block mb-[2px]">MEDIA</span>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--chrome-muted)]">Upload files</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-[var(--chrome-muted)] cursor-pointer transition-[background,color] duration-[120ms] flex-none hover:bg-[rgba(26,26,26,0.08)] hover:text-text disabled:opacity-40 disabled:cursor-default"
            onClick={onClose}
            disabled={uploading}
            title="Close"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drop zone */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: drag zone */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: file input triggered via ref */}
        <div
          className={`m-[20px] border-[1.5px] border-dashed rounded-[12px] py-[36px] px-[24px] flex flex-col items-center gap-[10px] cursor-pointer bg-[var(--c-card)] transition-[border-color,background] duration-150 relative${dragging ? ' border-primary bg-[rgba(255,77,0,0.02)]' : ' border-[var(--chrome-border)] hover:border-primary hover:bg-[rgba(255,77,0,0.02)]'}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-[52px] h-[52px] rounded-[14px] bg-[var(--chrome)] border border-[var(--chrome-border)] flex items-center justify-center text-[var(--chrome-muted)] mb-[4px]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="font-body text-[14px] font-semibold text-text m-0">Drag &amp; drop images here</p>
          <p className="font-body text-[12.5px] text-[var(--chrome-muted)] m-0 text-center">or <span className="text-primary font-medium">click to browse</span> — PNG, JPG, WebP, GIF up to 10 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && addFiles(e.target.files)}
            style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="overflow-y-auto max-h-[260px] mx-[20px] flex flex-col gap-[6px]">
            {files.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-[10px] py-[8px] px-[12px] rounded-[8px] border bg-[var(--c-card)]${item.status === 'done' ? ' border-[#86efac] bg-[#f0fdf4]' : item.status === 'error' ? ' border-[#fca5a5] bg-[#fef2f2]' : ' border-[var(--chrome-border)]'}`}
              >
                {/* biome-ignore lint/performance/noImgElement: admin-only preview */}
                <img className="w-[40px] h-[40px] rounded-[6px] object-cover flex-none bg-[var(--chrome)]" src={item.preview} alt={item.file.name} />
                <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                  <span className="font-body text-[12.5px] font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap">{item.file.name}</span>
                  <span className="font-mono text-[10.5px] text-[var(--chrome-muted)]">{formatSize(item.file.size)}</span>
                </div>
                <div className="flex-none">
                  {item.status === 'pending' && (
                    <button type="button" className="w-[22px] h-[22px] rounded-[6px] border-none bg-transparent text-[var(--chrome-muted)] cursor-pointer flex items-center justify-center transition-[background,color] duration-100 hover:bg-[var(--chrome)] hover:text-text" onClick={() => removeFile(item.id)} title="Remove">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  )}
                  {item.status === 'uploading' && (
                    <span className="inline-block w-[16px] h-[16px] rounded-full border-2 border-[var(--chrome-border)] border-t-[var(--chrome-muted)] animate-[cms-spin_0.7s_linear_infinite]" />
                  )}
                  {item.status === 'done' && (
                    <span className="w-[22px] h-[22px] rounded-full bg-[#22c55e] text-white flex items-center justify-center">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="text-[13px] text-[#ef4444] cursor-help" title={item.error}>✕</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-[12px] px-[20px] py-[16px] border-t border-[var(--chrome-border)] bg-[var(--chrome)] flex-none mt-[16px]">
          <span className="font-mono text-[11px] text-[var(--chrome-muted)] tracking-[0.04em]">
            {files.length === 0 ? 'No files selected' : `${files.length} file${files.length !== 1 ? 's' : ''} selected`}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="h-[36px] px-[16px] rounded-[8px] border border-[var(--chrome-border)] bg-transparent font-body text-[13px] text-text cursor-pointer transition-[background] duration-[120ms] hover:not-disabled:bg-[var(--c-card)] disabled:opacity-40 disabled:cursor-default"
              onClick={onClose}
              disabled={uploading}
            >
              {allDone ? 'Close' : 'Cancel'}
            </button>
            {!allDone && (
              <button
                type="button"
                className="inline-flex items-center gap-[7px] h-[36px] px-[18px] rounded-[8px] border-none bg-primary text-white font-body text-[13px] font-medium cursor-pointer transition-[background,opacity] duration-[120ms] hover:not-disabled:bg-[#e54300] disabled:opacity-50 disabled:cursor-default"
                onClick={handleUpload}
                disabled={!hasPending || uploading}
              >
                {uploading ? (
                  <><span className="inline-block w-[13px] h-[13px] rounded-full border-2 border-[rgba(255,255,255,0.3)] border-t-white animate-[cms-spin_0.7s_linear_infinite]" /> Uploading…</>
                ) : (
                  `Upload ${hasPending ? files.filter(f => f.status === 'pending').length : ''} file${files.filter(f => f.status === 'pending').length !== 1 ? 's' : ''}`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
