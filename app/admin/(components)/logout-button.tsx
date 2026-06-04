'use client'

export function LogoutButton() {
  return (
    <button
      type="button"
      className="cms-logout-btn"
      onClick={async () => {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: { 'x-requested-with': 'XMLHttpRequest' },
        })
        window.location.href = '/admin/login'
      }}
    >
      Logout
    </button>
  )
}
