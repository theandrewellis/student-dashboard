import React from 'react'
import { NotesWidget } from '@/types'

export default function NotesCard({ data, onChange }: { data: NotesWidget, onChange: (d: NotesWidget)=>void }) {
  return (
    <div className="card">
      <h4>📝 Notes</h4>
      <textarea
        value={data.text}
        onChange={(e)=> onChange({ ...data, text: e.target.value })}
        placeholder="Type your notes here..."
      />
    </div>
  )
}
