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
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5M21 12H9" />
      </svg>
      Logout
    </button>
  )
}
