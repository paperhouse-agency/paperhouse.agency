'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'

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
    <Button variant="outline" color="neutral" size="sm" onClick={handleDuplicate}>
      Duplicate
    </Button>
  )
}
