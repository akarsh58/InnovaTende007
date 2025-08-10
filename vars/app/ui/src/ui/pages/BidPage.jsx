import React from 'react'
import { useTender } from '../context/TenderContext'
import { useToast } from '../components/ToastProvider'
import { useApi } from '../components/api'

export default function BidPage(){
  const { tenderId, setTenderId, role } = useTender()
  const toast = useToast()
  const api = useApi()

  const submit = async () => { try { const bid = { pricing:{ basePrice:100000 }, documents:[], bidder:{ name:'Demo Co.' } }; await api.post(`/tenders/${tenderId}/bids`, { bid }); toast.success('Bid submitted') } catch(e){ toast.error(e.message) } }
  const closeT = async () => { try { await api.post(`/tenders/${tenderId}/close`); toast.success('Closed') } catch(e){ toast.error(e.message) } }
  const evalB = async () => { try { await api.post(`/tenders/${tenderId}/evaluate`); toast.success('Evaluated') } catch(e){ toast.error(e.message) } }
  const award = async () => { try { await api.post(`/tenders/${tenderId}/award`); toast.success('Awarded') } catch(e){ toast.error(e.message) } }

  const isOwner = role === 'owner'
  const disabled = !tenderId

  return (
    <div>
      <h3>Bids</h3>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        <input placeholder="Tender ID" value={tenderId} onChange={e=>setTenderId(e.target.value)} style={{ padding:8, flex:1 }} />
        <button onClick={submit} disabled={disabled}>Submit Bid</button>
        {isOwner && <button onClick={closeT} disabled={disabled}>Close</button>}
        {isOwner && <button onClick={evalB} disabled={disabled}>Evaluate</button>}
        {isOwner && <button onClick={award} disabled={disabled}>Award Best</button>}
      </div>
    </div>
  )
}
