import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'

const MAX_SIZE = 10 * 1024 * 1024

const MAGIC: Record<string, number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF....WEBP
  'image/avif': [], // skip magic check, hard to detect
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mimeFromHeader = req.headers.get('content-type')?.split(';')[0] ?? ''
  if (!mimeFromHeader.startsWith('image/')) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  // Buffer the full request body
  const buffer = await req.arrayBuffer()
  if (buffer.byteLength > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  // Check magic bytes
  if (mimeFromHeader in MAGIC) {
    const bytes = new Uint8Array(buffer)
    const magicPatterns = MAGIC[mimeFromHeader]
    const valid =
      magicPatterns.length === 0 ||
      magicPatterns.some((magic) => magic.every((b, i) => bytes[i] === b))
    if (!valid) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
    }
  }

  const filename = req.headers.get('x-filename') ?? `upload-${Date.now()}`
  const blob = await put(`cms-uploads/${filename}`, buffer, {
    access: 'public',
    contentType: mimeFromHeader,
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url })
}
