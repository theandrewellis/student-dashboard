import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { watchUser } from '@/firebase'
import Dashboard from '@/pages/Dashboard'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [pageId, setPageId] = useState<string>('home')

  useEffect(()=>{
    const unsub = watchUser(u => setUser(u))
    return ()=> unsub()
  }, [])

  return (
    <div>
      <Navbar user={user} />
      {user ? (
        <Dashboard uid={user.uid} pageId={pageId} setPageId={setPageId} />
      ) : (
        <div className="container" style={{ display:'grid', placeItems:'center', minHeight:'60vh' }}>
          <div className="card" style={{ width: 420 }}>
            <h4>🎒 Student Hub</h4>
            <p className="small">A fast, personal hub for everything you use — calendar, notes, links, and embeds — organized exactly how you want.</p>
            <p className="small">Sign in to start building your dashboard.</p>
            <button className="btn" onClick={()=> (document.querySelector('.actions .btn') as HTMLButtonElement)?.click()}>Sign in</button>
          </div>
        </div>
      )}
    </div>
  )
}
