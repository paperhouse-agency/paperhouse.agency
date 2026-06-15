import { put, list, del } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { getSession } from '@/libs/cms/auth/session'

const MAX_SIZE = 10 * 1024 * 1024
const PREFIX = 'cms-media/'
const STORAGE_LIMIT = Number(process.env.BLOB_STORAGE_LIMIT_MB ?? 500) * 1024 * 1024

function inferContentType(pathname: string): string {
  const ext = pathname.split('.').pop()?.toLowerCase() ?? ''
  const types: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', avif: 'image/avif',
    svg: 'image/svg+xml',
    mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }
  return types[ext] ?? 'application/octet-stream'
}

const MAGIC: Record<string, number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
  'image/avif': [],
  'image/svg+xml': [],
}

async function requireSession() {
  const session = await getSession()
  if (!session.isLoggedIn) return null
  return session
}

export async function GET() {
  if (!(await requireSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const blobs: { url: string; pathname: string; size: number; uploadedAt: string; contentType: string }[] = []
  let cursor: string | undefined

  do {
    const page = await list({ prefix: PREFIX, limit: 100, cursor })
    for (const b of page.blobs) {
      blobs.push({
        url: b.url,
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt.toISOString(),
        contentType: inferContentType(b.pathname),
      })
    }
    cursor = page.cursor
  } while (cursor)

  const storageUsed = blobs.reduce((sum, b) => sum + b.size, 0)

  return NextResponse.json({ blobs, storageUsed, storageLimit: STORAGE_LIMIT })
}

export async function POST(req: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mimeFromHeader = req.headers.get('content-type')?.split(';')[0] ?? ''
  if (!mimeFromHeader.startsWith('image/') && mimeFromHeader !== 'image/svg+xml') {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
  }

  const buffer = await req.arrayBuffer()
  if (buffer.byteLength > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
  }

  if (mimeFromHeader in MAGIC) {
    const bytes = new Uint8Array(buffer)
    const patterns = MAGIC[mimeFromHeader]
    const valid =
      patterns.length === 0 ||
      patterns.some((magic) => magic.every((b, i) => bytes[i] === b))
    if (!valid) {
      return NextResponse.json({ error: 'File content does not match declared type' }, { status: 400 })
    }
  }

  const filename = req.headers.get('x-filename') ?? `upload-${Date.now()}`
  const blob = await put(`${PREFIX}${filename}`, buffer, {
    access: 'public',
    contentType: mimeFromHeader,
    addRandomSuffix: true,
  })

  return NextResponse.json({
    url: blob.url,
    pathname: blob.pathname,
    size: buffer.byteLength,
    uploadedAt: new Date().toISOString(),
    contentType: mimeFromHeader,
  })
}

export async function DELETE(req: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { url } = (await req.json()) as { url?: string }
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  await del(url)
  return NextResponse.json({ ok: true })
}
