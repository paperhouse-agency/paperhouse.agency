'use client'

import { useRouter } from 'next/navigation'

export function DuplicatePageButton({ id }: { id: string }) {
  const router = useRouter()

  async function handleDuplicate() {
    const res = await fetch(`/api/admin/pages/${id}/duplicate`, {
      method: 'POST',
      headers: { 'x-requested-with': 'XMLHttpRequest' },
    })
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      data-variant="secondary"
      style={{ padding: '4px 10px', fontSize: '12px' }}
      onClick={handleDuplicate}
    >
      Duplicate
    </button>
  )
}
