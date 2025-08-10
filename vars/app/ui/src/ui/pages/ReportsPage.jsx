import React from 'react'
import DataTable from '../components/DataTable'
import Chip from '../components/Chip'
import BlockchainWorkflow from '../components/BlockchainWorkflow'
import { useApi } from '../components/api'
import { useToast } from '../components/ToastProvider'
import { useTender } from '../context/TenderContext'

export default function ReportsPage(){
  const api = useApi()
  const toast = useToast()
  const { role } = useTender()
  const isAdmin = role === 'admin'

  const [tenders, setTenders] = React.useState([])
  const [bids, setBids] = React.useState([])
  const [history, setHistory] = React.useState([])
  const [statistics, setStatistics] = React.useState({})
  const [tid, setTid] = React.useState('')
  const [selectedTender, setSelectedTender] = React.useState(null)

  const loadTenders = async () => { 
    try {
      const d = await api.get('/tenders?status=PUBLISHED')
      setTenders(d)
      // Load statistics
      const stats = await api.get('/tenders/statistics')
      setStatistics(stats)
    } catch(e) {
      toast.error('Failed to load tenders: ' + e.message)
    }
  }

  const loadBids = async () => { 
    try {
      const d = await api.get(`/tenders/${tid}/bids`)
      setBids(d)
      const tender = await api.get(`/tenders/${tid}`)
      setSelectedTender(tender)
    } catch(e) {
      toast.error('Failed to load bids: ' + e.message)
    }
  }

  const loadHistory = async () => { 
    try {
      const d = await api.get(`/tenders/${tid}/history`)
      setHistory(d)
    } catch(e) {
      toast.error('Failed to load history: ' + e.message)
    }
  }

  const exportHistoryPdf = () => {
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Audit Trail</title>
      <style>body{font-family:Inter,system-ui;padding:20px} h1{margin-top:0} table{width:100%;border-collapse:collapse} th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left} th{background:#f8fafc}</style>
    </head><body>
      <h1>Audit Trail - ${tid}</h1>
      <table><thead><tr><th>TxID</th><th>Timestamp</th><th>Action</th><th>Value</th></tr></thead><tbody>
      ${history.map(h=> `<tr><td>${h.txId||''}</td><td>${h.timestamp||''}</td><td>${h.action||''}</td><td><pre>${escapeHtml(JSON.stringify(h.value||{},null,2))}</pre></td></tr>`).join('')}
      </tbody></table>
    </body></html>`
    const blob = new Blob([html], { type:'text/html' })
    const url = URL.createObjectURL(blob)
    const w = window.open(url, '_blank')
    if (w) { w.onload = () => w.print() }
  }

  const exportBidsMatrixPdf = () => {
    if (!bids.length) return
    const rows = bids.map(b => ({
      bidder: b?.bidder?.name || '-',
      price: Number(b?.pricing?.basePrice || 0),
      duration: b?.schedule?.totalDays || b?.timeline?.totalDays || '-',
      compliance: Array.isArray(b?.complianceFlags)? `${b.complianceFlags.filter(x=>x?.ok).length}/${b.complianceFlags.length}` : '-',
    }))
    const minPrice = Math.min(...rows.map(r=> r.price || Infinity))
    const avgPrice = rows.reduce((a,r)=> a + (r.price||0), 0) / rows.length
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Bids Comparison</title>
      <style>body{font-family:Inter,system-ui;padding:20px} h1{margin-top:0} table{width:100%;border-collapse:collapse;margin-top:10px} th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left} th{background:#f8fafc} tfoot td{font-weight:700}</style>
    </head><body>
      <h1>Bids Comparison – ${tid}</h1>
      <table><thead><tr><th>Bidder</th><th>Base Price</th><th>Normalized vs Min</th><th>Duration (days)</th><th>Compliance</th></tr></thead><tbody>
      ${rows.map(r=> `<tr><td>${escapeHtml(r.bidder)}</td><td>₹ ${Number(r.price||0).toLocaleString('en-IN')}</td><td>${minPrice && isFinite(minPrice) ? (r.price/minPrice).toFixed(2) : '-'}</td><td>${r.duration||'-'}</td><td>${r.compliance||'-'}</td></tr>`).join('')}
      </tbody><tfoot><tr><td>Summary</td><td>Avg: ₹ ${isFinite(avgPrice)? avgPrice.toLocaleString('en-IN'): '-'}</td><td>Best: 1.00</td><td></td><td></td></tr></tfoot></table>
    </body></html>`
    const blob = new Blob([html], { type:'text/html' })
    const url = URL.createObjectURL(blob)
    const w = window.open(url, '_blank')
    if (w) { w.onload = () => w.print() }
  }

  const seedDemo = async () => {
    try {
      const r = await api.post('/admin/seed', {})
      toast.success(`Seeded ${r.created?.length||0} demo tenders`)
      if (r.created?.[0]?.tenderId) setTid(r.created[0].tenderId)
      await loadTenders()
    } catch(e){ toast.error(e.message) }
  }

  return (
    <div>
      <h3>Reports</h3>
      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12, flexWrap:'wrap' }}>
        <button onClick={loadTenders}>Load Published RFQs</button>
        <input placeholder="Tender ID" value={tid} onChange={e=>setTid(e.target.value)} />
        <button onClick={loadBids}>Load Bids</button>
        <button onClick={loadHistory}>Load Audit Trail</button>
        <button onClick={exportHistoryPdf} disabled={!history.length}>Export Audit PDF</button>
        <button onClick={exportBidsMatrixPdf} disabled={!bids.length}>Export Bids Matrix PDF</button>
        {isAdmin && <button onClick={seedDemo} title="Create 3 demo tenders+bids (Admin)">Seed 3 Demo Tenders</button>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div>
          <h4>System Statistics</h4>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            <StatCard title="Total RFQs" value={statistics.totalTenders || 0} />
            <StatCard title="Active Bids" value={statistics.activeBids || 0} />
            <StatCard title="Completed Projects" value={statistics.completedProjects || 0} />
            <StatCard title="Total Value" value={`₹ ${Number(statistics.totalValue || 0).toLocaleString('en-IN')}`} />
          </div>
          
          <h4>Published RFQs</h4>
          <DataTable 
            rows={tenders} 
            cols={[
              {k:'id', t:'ID'},
              {k:'title', t:'Title'},
              {k:'status', t:'Status', render:(r)=> <Chip text={r.status} color="#2563EB" />},
              {k:'createdAt', t:'Created', render:(r)=> new Date(r.createdAt).toLocaleDateString()},
              {k:'budget', t:'Budget', render:(r)=> r.budget ? `₹ ${Number(r.budget).toLocaleString('en-IN')}` : '-'},
            ]} 
            onRowClick={(r)=> { setTid(r.id); loadBids(); }}
          />
        </div>
        <div>
          <h4>Selected RFQ Details</h4>
          {selectedTender && (
            <div style={{ marginBottom: 16 }}>
              <BlockchainWorkflow 
                currentStage={selectedTender.status} 
                rfqId={selectedTender.id}
                showDetails={true}
              />
            </div>
          )}
          
          <h4>Bids</h4>
          <DataTable 
            rows={bids} 
            cols={[
              {k:'bidId', t:'Bid ID'},
              {k:'bidder.name', t:'Bidder'},
              {k:'pricing.basePrice', t:'Price', render:(r)=> `₹ ${Number(r?.pricing?.basePrice||0).toLocaleString('en-IN')}`},
              {k:'status', t:'Status', render:(r)=> <Chip text={r.status || 'PENDING'} color="#2563EB" />},
              {k:'score', t:'Score', render:(r)=> r.score ? `${(r.score * 100).toFixed(1)}%` : '-'},
            ]} 
          />
        </div>
      </div>
      <div style={{ marginTop:12 }}>
        <h4>Audit Trail</h4>
        <DataTable rows={history} cols={[
          {k:'txId', t:'TxID'},
          {k:'timestamp', t:'Timestamp'},
          {k:'action', t:'Action'},
          {k:'value', t:'Value', render:(r)=> <code style={{ whiteSpace:'pre-wrap' }}>{JSON.stringify(r.value||{}, null, 2)}</code>},
        ]} pageSize={5} />
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div style={{ 
      padding: 16,
      backgroundColor: '#f8fafc',
      borderRadius: 8,
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b' }}>{value}</div>
    </div>
  )
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}
