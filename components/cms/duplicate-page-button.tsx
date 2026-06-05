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
      className="cms-btn cms-btn-ghost"
      style={{ height: 34, padding: '0 14px', fontSize: 12 }}
      onClick={handleDuplicate}
    >
      Duplicate
    </button>
  )
}
