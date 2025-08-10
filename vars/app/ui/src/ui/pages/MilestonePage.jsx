import React, { useState } from 'react'
import { useTender } from '../context/TenderContext'
import { useToast } from '../components/ToastProvider'
import { useApi } from '../components/api'

export default function MilestonePage(){
  const { tenderId, setTenderId, role } = useTender()
  const [mid, setMid] = useState('MS-001')
  const toast = useToast()
  const api = useApi()

  const submit = async () => { try { const ms = { milestoneId: mid, description:'Work package', acceptanceCriteria:'Quality OK', amount: 100000 }; await api.post(`/tenders/${tenderId}/milestones`, { milestone: ms }); toast.success('Submitted') } catch(e){ toast.error(e.message) } }
  const approve = async () => { try { await api.post(`/tenders/${tenderId}/milestones/${mid}/approve`); toast.success('Approved') } catch(e){ toast.error(e.message) } }
  const partial = async () => { try { await api.post(`/tenders/${tenderId}/milestones/${mid}/partial`, { amount: 50000 }); toast.success('Partial 50k') } catch(e){ toast.error(e.message) } }
  const release = async () => { try { await api.post(`/tenders/${tenderId}/retention/release`); toast.success('Retention released') } catch(e){ toast.error(e.message) } }

  const list = async () => { try { const d = await api.get(`/tenders/${tenderId}/milestones`); toast.info(`${d.length||0} milestones`) } catch(e){ toast.error(e.message) } }

  const isOwner = role === 'owner'
  const disabled = !tenderId || !mid

  return (
    <div>
      <h3>Milestones</h3>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <input placeholder="Tender ID" value={tenderId} onChange={e=>setTenderId(e.target.value)} style={{ padding:8, flex:1 }} />
        <input placeholder="Milestone ID" value={mid} onChange={e=>setMid(e.target.value)} style={{ padding:8, width:160 }} />
        {isOwner && <button onClick={submit} disabled={disabled}>Submit</button>}
        {isOwner && <button onClick={approve} disabled={disabled}>Approve</button>}
        {isOwner && <button onClick={partial} disabled={disabled}>Partial 50k</button>}
        {isOwner && <button onClick={release} disabled={!tenderId}>Release Retention</button>}
        <button onClick={list} disabled={!tenderId}>List</button>
      </div>
    </div>
  )
}
