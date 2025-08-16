import React from 'react'
import { LinksWidget } from '@/types'

export default function LinksCard({ data, onChange }: { data: LinksWidget, onChange: (d: LinksWidget)=>void }) {
  const addLink = () => {
    const label = prompt('Label for the link (e.g., Classroom)') || ''
    const url = prompt('URL (https://...)') || ''
    if (!url) return
    onChange({ ...data, links: [...data.links, { label: label || url, url }] })
  }
  const remove = (idx: number) => {
    const links = data.links.slice()
    links.splice(idx,1)
    onChange({ ...data, links })
  }
  return (
    <div className="card">
      <h4>🔗 Quick Links</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.links.map((l, i)=>(
          <a key={i} href={l.url} target="_blank" rel="noreferrer" className="btn" style={{ textAlign: 'left' }}>
            {l.label}
          </a>
        ))}
      </div>
      <hr className="divider" />
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" onClick={addLink}>Add Link</button>
        {data.links.length>0 && <button className="btn" onClick={()=> remove(data.links.length-1)}>Remove Last</button>}
      </div>
    </div>
  )
}
