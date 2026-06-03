import type { PropsWithChildren } from 'react'
import { AdminNav } from './(components)/admin-nav'
import './admin.css'

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="admin">
      <AdminNav />
      <main className="admin-main">{children}</main>
    </div>
  )
}
