import React from 'react'
import { googleLogin } from '@/firebase'

export default function Login() {
  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ width: 360 }}>
        <h4>Welcome to 🎒 Student Hub</h4>
        <p className="small">Sign in to create your personal dashboard.</p>
        <button className="btn" onClick={googleLogin}>Sign in with Google</button>
      </div>
    </div>
  )
}
