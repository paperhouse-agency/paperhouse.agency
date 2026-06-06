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
      className="cms-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget && !uploading) onClose() }}
    >
      <div className="cms-upload-modal">
        {/* Header */}
        <div className="cms-modal-header">
          <div>
            <span className="cms-upload-modal-eyebrow">MEDIA</span>
            <span className="cms-mono-label">Upload files</span>
          </div>
          <button
            type="button"
            className="cms-sidebar-collapse-btn"
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
          className={`cms-upload-dropzone${dragging ? ' cms-upload-dropzone--active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
        >
          <div className="cms-upload-dropzone-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="cms-upload-dropzone-title">Drag & drop images here</p>
          <p className="cms-upload-dropzone-sub">or <span>click to browse</span> — PNG, JPG, WebP, GIF up to 10 MB</p>
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
          <div className="cms-upload-filelist">
            {files.map((item) => (
              <div key={item.id} className={`cms-upload-file cms-upload-file--${item.status}`}>
                {/* biome-ignore lint/performance/noImgElement: admin-only preview */}
                <img className="cms-upload-file-thumb" src={item.preview} alt={item.file.name} />
                <div className="cms-upload-file-info">
                  <span className="cms-upload-file-name">{item.file.name}</span>
                  <span className="cms-upload-file-meta">{formatSize(item.file.size)}</span>
                </div>
                <div className="cms-upload-file-status">
                  {item.status === 'pending' && (
                    <button type="button" className="cms-upload-file-remove" onClick={() => removeFile(item.id)} title="Remove">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  )}
                  {item.status === 'uploading' && (
                    <span className="cms-upload-spinner-sm" />
                  )}
                  {item.status === 'done' && (
                    <span className="cms-upload-file-done">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="cms-upload-file-error" title={item.error}>✕</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="cms-upload-modal-footer">
          <span className="cms-upload-file-count">
            {files.length === 0 ? 'No files selected' : `${files.length} file${files.length !== 1 ? 's' : ''} selected`}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="cms-upload-cancel-btn"
              onClick={onClose}
              disabled={uploading}
            >
              {allDone ? 'Close' : 'Cancel'}
            </button>
            {!allDone && (
              <button
                type="button"
                className="cms-upload-submit-btn"
                onClick={handleUpload}
                disabled={!hasPending || uploading}
              >
                {uploading ? (
                  <><span className="cms-media-upload-spinner" /> Uploading…</>
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
