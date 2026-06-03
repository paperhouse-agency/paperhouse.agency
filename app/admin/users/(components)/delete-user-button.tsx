'use client'

import { useRouter } from 'next/navigation'

export function DeleteUserButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return

    await fetch(`/api/admin/users/${id}`, {
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
