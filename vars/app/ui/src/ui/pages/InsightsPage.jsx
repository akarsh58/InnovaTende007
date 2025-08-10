import React from 'react'
import { useTender } from '../context/TenderContext'
import { useToast } from '../components/ToastProvider'
const API = (path) => (import.meta.env.VITE_API_BASE || 'http://localhost:3000') + path

export default function InsightsPage(){
  const { tenderId, setTenderId } = useTender()
  const [stats, setStats] = React.useState(null)
  const [fin, setFin] = React.useState(null)
  const toast = useToast()
  const get = async (url) => { const r = await fetch(API(url)); const j = await r.json(); if(!j.success) throw new Error(j.error); return j.data }

  const loadAll = async () => {
    try {
      const s = await get(`/tenders/${tenderId}/stats`); setStats(s)
      const f = await get(`/tenders/${tenderId}/financial-summary`); setFin(f)
      toast.success('Insights loaded')
    } catch(e){ toast.error(e.message) }
  }

  return (
    <div>
      <h3>Insights</h3>
      <div style={{ display:'flex', gap:8 }}>
        <input placeholder="Tender ID" value={tenderId} onChange={e=>setTenderId(e.target.value)} style={{ padding:8, flex:1 }} />
        <button onClick={loadAll}>Load</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12 }}>
        <div>
          <h4>Statistics</h4>
          <pre>{stats? JSON.stringify(stats,null,2): '...'}</pre>
        </div>
        <div>
          <h4>Financial Summary</h4>
          <pre>{fin? JSON.stringify(fin,null,2): '...'}</pre>
        </div>
      </div>
    </div>
  )
}
