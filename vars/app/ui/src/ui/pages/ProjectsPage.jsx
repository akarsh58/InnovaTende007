import React from 'react'
import DataTable from '../components/DataTable'
import Chip from '../components/Chip'
import { useTender } from '../context/TenderContext'
import BlockchainWorkflow from '../components/BlockchainWorkflow'
import { sampleRFQs } from '../data/demoData'

const API = (p) => (import.meta.env.VITE_API_BASE || 'http://localhost:3000') + p

export default function ProjectsPage(){
  const { tenderId, setTenderId, role } = useTender()
  const [milestones, setMilestones] = React.useState([])
  const [summary, setSummary] = React.useState(null)
  const [amount, setAmount] = React.useState(50000)
  const isOwner = role === 'owner'

  const get = async (url) => { const r = await fetch(API(url)); const j = await r.json(); if(!j.success) throw new Error(j.error); return j.data }
  const post = async (url, body) => { const r = await fetch(API(url), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body||{})}); const j = await r.json(); if(!j.success) throw new Error(j.error); return j.data }

  const load = async () => {
    if(!tenderId) return
    const ms = await get(`/tenders/${tenderId}/milestones`); setMilestones(ms||[])
    const s = await get(`/tenders/${tenderId}/financial-summary`); setSummary(s||{})
  }
  const approve = async (mid) => { await post(`/tenders/${tenderId}/milestones/${mid}/approve`); await load() }
  const payPartial = async (mid) => { await post(`/tenders/${tenderId}/milestones/${mid}/partial`, { amount }); await load() }
  const releaseRetention = async () => { await post(`/tenders/${tenderId}/retention/release`); await load() }

  const exportSummaryPdf = () => {
    const s = summary || {}
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Financial Summary</title>
      <style>body{font-family:Inter,system-ui;padding:20px} h1{margin-top:0} table{width:100%;border-collapse:collapse;margin-top:10px} th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left} th{background:#f8fafc}</style>
    </head><body>
      <h1>Financial Summary - ${tenderId}</h1>
      <table><tbody>
        <tr><th>Budget</th><td>${fmt(s.budget)}</td></tr>
        <tr><th>Approved Payments</th><td>${fmt(s.approvedPayments)}</td></tr>
        <tr><th>Retention (%)</th><td>${s.retentionPercent ?? '-'}</td></tr>
        <tr><th>Retention Amount</th><td>${fmt(s.retentionAmount)}</td></tr>
        <tr><th>Retention Released</th><td>${s.retentionReleased ? 'Yes' : 'No'}</td></tr>
        <tr><th>Total Paid</th><td>${fmt(s.totalPaid)}</td></tr>
        <tr><th>Balance</th><td>${fmt(s.balance)}</td></tr>
      </tbody></table>
    </body></html>`
    const blob = new Blob([html], { type:'text/html' }); const url = URL.createObjectURL(blob); const w = window.open(url, '_blank'); if (w) { w.onload = () => w.print() }
  }

  // Get current project's blockchain stage
  const getCurrentBlockchainStage = () => {
    const project = sampleRFQs.find(rfq => rfq.id === tenderId);
    return project?.blockchainStage || 'DRAFT';
  };

  return (
    <div>
      <h3>Projects & Blockchain Tracking</h3>
      
      {/* Blockchain Workflow Display */}
      {tenderId && (
        <div style={{ marginBottom: 24 }}>
          <BlockchainWorkflow 
            currentStage={getCurrentBlockchainStage()} 
            rfqId={tenderId}
            showDetails={true}
          />
        </div>
      )}

      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:12 }}>
        <input placeholder="Tender ID" value={tenderId} onChange={e=> setTenderId(e.target.value)} style={{ padding:8 }} />
        <button onClick={load} disabled={!tenderId}>Load</button>
        {isOwner && <button onClick={releaseRetention} disabled={!tenderId || summary?.retentionReleased}>Release Retention</button>}
        <button onClick={exportSummaryPdf} disabled={!summary}>Export Summary PDF</button>
        {isOwner && (
          <span style={{ marginLeft:'auto', display:'inline-flex', gap:6, alignItems:'center' }}>
            <span>Partial amount</span>
            <input type="number" value={amount} onChange={e=> setAmount(Number(e.target.value||0))} style={{ width:140, padding:6 }} />
          </span>
        )}
      </div>

      {/* Quick Access to Sample Projects */}
      <div style={{ marginBottom: 16 }}>
        <h4>Sample Blockchain Projects</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {sampleRFQs.map((project, index) => (
            <button 
              key={index}
              onClick={() => setTenderId(project.id)}
              style={{
                padding: '8px 12px',
                backgroundColor: tenderId === project.id ? '#3b82f6' : 'white',
                color: tenderId === project.id ? 'white' : '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {project.id} ({project.blockchainStage.replace('_', ' ')})
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12 }}>
        <div>
          <h4>Milestones</h4>
          <DataTable
            rows={milestones}
            pageSize={8}
            cols={[
              { k:'milestoneId', t:'ID' },
              { k:'description', t:'Description' },
              { k:'status', t:'Status', render:(r)=> <Chip text={r.status || '-'} color={r.status==='APPROVED'?'#10B981':'#2563EB'} /> },
              { k:'amount', t:'Amount', render:(r)=> fmt(r.amount) },
              { k:'paidAmount', t:'Paid', render:(r)=> fmt(r.paidAmount) },
              { k:'', t:'Actions', render:(r)=> (
                <div style={{ display:'flex', gap:6 }}>
                  {isOwner && <button onClick={()=> approve(r.milestoneId)} disabled={!tenderId}>Approve</button>}
                  {isOwner && <button onClick={()=> payPartial(r.milestoneId)} disabled={!tenderId || amount<=0}>Partial</button>}
                </div>
              )}
            ]}
          />
        </div>
        <div>
          <h4>Financial Summary</h4>
          {summary ? (
            <div style={{ border:'1px solid #e5e7eb', borderRadius:8, padding:12, display:'grid', gap:6 }}>
              <Row k="Budget" v={fmt(summary.budget)} />
              <Row k="Approved Payments" v={fmt(summary.approvedPayments)} />
              <Row k="Retention (%)" v={summary.retentionPercent ?? '-'} />
              <Row k="Retention Amount" v={fmt(summary.retentionAmount)} />
              <Row k="Retention Released" v={summary.retentionReleased ? 'Yes' : 'No'} />
              <Row k="Total Paid" v={fmt(summary.totalPaid)} />
              <Row k="Balance" v={fmt(summary.balance)} />
            </div>
          ) : <div style={{ color:'#6b7280' }}>Load to view summary</div>}
        </div>
      </div>
    </div>
  )
}

function Row({ k, v }){ return <div style={{ display:'flex', justifyContent:'space-between' }}><span>{k}</span><strong>{v}</strong></div> }
function fmt(n){ const x = Number(n||0); return isFinite(x) ? `₹ ${x.toLocaleString('en-IN')}` : '-' }
