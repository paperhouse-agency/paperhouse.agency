import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/pages' as string as never)
}
