import React from 'react'
import { googleLogin, logout } from '@/firebase'

export default function Navbar({ user }: { user: any }) {
  return (
    <div className="navbar">
      <div className="brand">🎒 Student Hub</div>
      <div className="actions">
        {user ? (
          <>
            <span className="small">Hi, {user.displayName || user.email}</span>
            <button className="btn" onClick={logout}>Sign out</button>
          </>
        ) : (
          <button className="btn" onClick={googleLogin}>Sign in with Google</button>
        )}
      </div>
    </div>
  )
}
