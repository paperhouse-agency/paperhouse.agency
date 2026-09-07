import { NextResponse } from 'next/server'
import { listPublishedPosts } from '@/libs/cms/storage'

const POSTS_PER_PAGE = 6
const MAX_LIMIT = 24

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const pageParam = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

  const limitParam = Number.parseInt(
    searchParams.get('limit') ?? `${POSTS_PER_PAGE}`,
    10
  )
  const limit =
    Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(limitParam, MAX_LIMIT)
      : POSTS_PER_PAGE

  const result = await listPublishedPosts(page, limit)
  return NextResponse.json(result)
}
