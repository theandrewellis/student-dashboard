import React, { useEffect, useMemo, useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { v4 as uuid } from 'uuid'
import { AnyWidget, PageData, WidgetType } from '@/types'
import NotesCard from '@/components/NotesCard'
import LinksCard from '@/components/LinksCard'
import EmbedCard from '@/components/EmbedCard'
import CalendarCard from '@/components/CalendarCard'
import { db, ensureUserInit, savePage } from '@/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const ResponsiveGridLayout = WidthProvider(Responsive)

function WidgetView({ w, onChange }: { w: AnyWidget, onChange: (nw: AnyWidget)=>void }) {
  switch (w.type) {
    case 'notes': return <NotesCard data={w} onChange={(d)=> onChange(d)} />
    case 'links': return <LinksCard data={w} onChange={(d)=> onChange(d)} />
    case 'embed': return <EmbedCard data={w} onChange={(d)=> onChange(d)} />
    case 'calendar': return <CalendarCard data={w} onChange={(d)=> onChange(d)} />
    default: return <div className="card">Unknown widget</div>
  }
}

const makeWidget = (type: WidgetType): AnyWidget => {
  const base = { id: uuid(), type, x: 0, y: 0, w: 4, h: 6 }
  switch (type) {
    case 'notes': return { ...base, type, text: '' }
    case 'links': return { ...base, type, links: [] }
    case 'embed': return { ...base, type, url: '' }
    case 'calendar': return { ...base, type, url: '' }
  }
}

export default function Dashboard({ uid, pageId, setPageId }: { uid: string, pageId: string, setPageId: (p:string)=>void }) {
  const [data, setData] = useState<PageData>({ title: 'Home', widgets: [] })
  const [pages, setPages] = useState<string[]>(['home'])

  // Load
  useEffect(()=>{
    const run = async () => {
      await ensureUserInit(uid)
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)
      const udata = userSnap.data() as any
      setPages(udata?.pages || ['home'])

      const pageRef = doc(db, 'users', uid, 'pages', pageId)
      const pageSnap = await getDoc(pageRef)
      if (pageSnap.exists()) {
        setData(pageSnap.data() as PageData)
      } else {
        await setDoc(pageRef, { title: 'Home', widgets: [] })
        setData({ title: 'Home', widgets: [] })
      }
    }
    run()
  }, [uid, pageId])

  const layouts = useMemo(()=> ({
    lg: data.widgets.map((w, i)=> ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h }))
  }), [data.widgets])

  const onLayoutChange = (layout:any) => {
    const updated = data.widgets.map(w => {
      const found = layout.find((l:any)=> l.i === w.id)
      if (!found) return w
      return { ...w, x: found.x, y: found.y, w: found.w, h: found.h }
    })
    const nd = { ...data, widgets: updated }
    setData(nd)
    savePage(uid, pageId, nd)
  }

  const updateWidget = (nw: AnyWidget) => {
    const updated = data.widgets.map(w => w.id === nw.id ? nw : w)
    const nd = { ...data, widgets: updated }
    setData(nd)
    savePage(uid, pageId, nd)
  }

  const addWidget = (type: WidgetType) => {
    const nw = makeWidget(type)
    const nd = { ...data, widgets: [...data.widgets, nw] }
    setData(nd)
    savePage(uid, pageId, nd)
  }

  const removeLast = () => {
    if (!data.widgets.length) return
    const nd = { ...data, widgets: data.widgets.slice(0, -1) }
    setData(nd)
    savePage(uid, pageId, nd)
  }

  const addPage = async () => {
    const name = prompt('New page id (e.g., math, personal, clubs). Letters/numbers only.', 'page-' + (pages.length+1)) || ''
    const safe = name.trim().toLowerCase().replace(/[^a-z0-9-]/g,'')
    if (!safe) return
    const newPages = pages.includes(safe) ? pages : [...pages, safe]
    setPages(newPages)
    await updateDoc(doc(db, 'users', uid), { pages: newPages })
    await setDoc(doc(db, 'users', uid, 'pages', safe), { title: safe, widgets: [] })
    setPageId(safe)
  }

  const renamePage = async () => {
    const title = prompt('Rename page (title only):', data.title) || data.title
    const nd = { ...data, title }
    setData(nd)
    savePage(uid, pageId, nd)
  }

  const deletePage = async () => {
    if (pageId === 'home') { alert('Cannot delete the default "home" page.'); return }
    const remain = pages.filter(p => p !== pageId)
    await updateDoc(doc(db, 'users', uid), { pages: remain })
    setPages(remain)
    setPageId('home')
  }

  return (
    <div className="container">
      <div className="page-tabs">
        {pages.map((p)=>(
          <button key={p} className={'tab ' + (p===pageId?'active':'')} onClick={()=> setPageId(p)}>{p}</button>
        ))}
        <button className="btn" onClick={addPage}>+ New Page</button>
      </div>

      <div className="toolbar">
        <select className="select" id="addWidget">
          <option value="notes">Notes</option>
          <option value="links">Links</option>
          <option value="embed">Embed</option>
          <option value="calendar">Calendar</option>
        </select>
        <button className="btn" onClick={()=> addWidget((document.getElementById('addWidget') as HTMLSelectElement).value as any)}>Add Widget</button>
        <button className="btn" onClick={removeLast}>Remove Last Widget</button>
        <button className="btn" onClick={renamePage}>Rename Page</button>
        {pageId!=='home' && <button className="btn" onClick={deletePage}>Delete Page</button>}
      </div>

      <div className="grid">
        <ResponsiveGridLayout
          className="layout"
          rowHeight={30}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
          layouts={layouts as any}
          onLayoutChange={onLayoutChange}
          margin={[10, 10]}
          compactType={null}
          isResizable
          isDraggable
          draggableCancel="input,textarea,select,button,a"
        >
          {data.widgets.map((w)=>(
            <div key={w.id} className="grid-item">
              <WidgetView w={w} onChange={updateWidget} />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      <div className="footer-note">Your layout saves automatically to your account.</div>
    </div>
  )
}
