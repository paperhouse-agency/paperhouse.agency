import type { PropsWithChildren } from 'react'
import { AdminNav } from '@/components/cms/admin-nav'

export default function CmsLayout({ children }: PropsWithChildren) {
  return (
    <div className="cms-shell">
      <AdminNav />
      <div className="cms-shell-body">
        {children}
      </div>
    </div>
  )
}
