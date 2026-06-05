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
      className="cms-btn cms-btn-ghost"
      style={{ height: 34, padding: '0 14px', fontSize: 12, color: 'var(--color-primary)', borderColor: 'rgba(255,77,0,0.3)' }}
    >
      Delete
    </button>
  )
}
