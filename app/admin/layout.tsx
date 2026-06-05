import type { PropsWithChildren } from 'react'
import { AdminNav } from './(components)/admin-nav'
import './admin.css'

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="cms-shell">
      <AdminNav />
      <div className="cms-shell-body">
        {children}
      </div>
    </div>
  )
}
