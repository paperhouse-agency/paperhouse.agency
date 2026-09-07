'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { ArticleCard } from '@/components/molecules/article-card'
import type { CmsPostSummary } from '@/libs/cms/storage'

export interface PostsGridBlockProps {
  preheadingContent?: string
  headingContent: string
  bodyContent?: string
}

interface PostsResponse {
  posts: CmsPostSummary[]
  hasMore: boolean
}

function parseHeading(content: string) {
  const parts = content.split(/(<span>.*?<\/span>)/g).filter(Boolean)
  return parts.map((part) => {
    if (part.startsWith('<span>') && part.endsWith('</span>')) {
      const text = part.replace('<span>', '').replace('</span>', '')
      return (
        <span key={part} className="text-primary">
          {text}
        </span>
      )
    }
    return <span key={part}>{part}</span>
  })
}

export function PostsGridBlock({
  preheadingContent,
  headingContent,
  bodyContent,
}: PostsGridBlockProps) {
  const [posts, setPosts] = useState<CmsPostSummary[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadFirstPage() {
      const res = await fetch('/api/posts?page=1')
      const data = (await res.json()) as PostsResponse
      if (cancelled) return
      setPosts(data.posts)
      setHasMore(data.hasMore)
      setIsLoading(false)
    }
    loadFirstPage()
    return () => {
      cancelled = true
    }
  }, [])

  async function loadMore() {
    setIsLoading(true)
    try {
      const nextPage = page + 1
      const res = await fetch(`/api/posts?page=${nextPage}`)
      const data = (await res.json()) as PostsResponse
      setPosts((prev) => [...prev, ...data.posts])
      setPage(nextPage)
      setHasMore(data.hasMore)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoading && posts.length === 0) return null

  return (
    <section className="py-15 dt:px-5">
      <div className="wrapper mx-auto">
        <div className="bg-white -mx-5 dt:mx-0 dt:rounded-[12px] dt:shadow-[4px_4px_5px_rgba(0,0,0,0.05)] px-5 py-10 dt:p-10 flex flex-col gap-2.5">
          {preheadingContent && (
            <p className="mono-wide text-primary">{preheadingContent}</p>
          )}
          <h2 className="heading-2 text-text">
            {parseHeading(headingContent)}
          </h2>
          {bodyContent && (
            <p className="body-large text-text dt:max-w-1/2 mb-3">
              {bodyContent}
            </p>
          )}

          <div className="grid grid-cols-1 dt:grid-cols-3 gap-5">
            {posts.map((post) => (
              <ArticleCard
                key={post.id}
                image={post.image}
                heading={post.title}
                content={post.excerpt}
                ctaUrl={`/${post.slug}`}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-5">
              <Button
                variant="outline"
                color="primary"
                size="md"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? 'Loading…' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
