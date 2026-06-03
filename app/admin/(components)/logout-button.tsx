'use client'

export function LogoutButton() {
  return (
    <button
      type="button"
      data-variant="secondary"
      onClick={async () => {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: { 'x-requested-with': 'XMLHttpRequest' },
        })
        window.location.href = '/admin/login'
      }}
      style={{ fontFamily: 'monospace', fontSize: '14px' }}
    >
      Logout
    </button>
  )
}
