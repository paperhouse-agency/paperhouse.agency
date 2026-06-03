'use client'

import { useRouter } from 'next/navigation'

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
    <button
      type="button"
      onClick={handleDelete}
      data-variant='danger' style={{ fontFamily: 'monospace', fontSize: '14px' }}
    >
      Delete
    </button>
  )
}
