import React from 'react'
import { CalendarWidget } from '@/types'

export default function CalendarCard({ data, onChange }: { data: CalendarWidget, onChange: (d: CalendarWidget)=>void }) {
  return (
    <div className="card">
      <h4>🗓️ Calendar</h4>
      <input
        placeholder="Paste a Google Calendar embed URL"
        value={data.url}
        onChange={(e)=> onChange({ ...data, url: e.target.value })}
      />
      <div style={{ flex: 1, minHeight: 60 }}>
        {data.url ? (
          <iframe src={data.url} width="100%" height="100%"></iframe>
        ) : (
          <div className="small">Use Google Calendar → Settings → Integrate calendar → 'Public URL to this calendar' or 'Embed code' (make public if needed).</div>
        )}
      </div>
    </div>
  )
}
