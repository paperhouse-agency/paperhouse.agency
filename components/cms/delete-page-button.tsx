'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'

export function DeletePageButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return

    await fetch(`/api/admin/pages/${id}`, {
      method: 'DELETE',
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    })

    router.refresh()
  }

  return (
    <Button variant="outline" color="primary" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  )
}
