import React from 'react'
import { EmbedWidget } from '@/types'

export default function EmbedCard({ data, onChange }: { data: EmbedWidget, onChange: (d: EmbedWidget)=>void }) {
  return (
    <div className="card">
      <h4>🌐 Embed</h4>
      <input
        placeholder="Paste an embeddable URL (e.g., https://...)"
        value={data.url}
        onChange={(e)=> onChange({ ...data, url: e.target.value })}
      />
      <div style={{ flex: 1, minHeight: 60 }}>
        {data.url ? (
          <iframe src={data.url} width="100%" height="100%"></iframe>
        ) : (
          <div className="small">Enter an embeddable URL. Note: some sites block embedding.</div>
        )}
      </div>
    </div>
  )
}
