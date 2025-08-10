import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTender } from '../context/TenderContext'
import { sampleRFQs } from '../data/demoData'
import BlockchainWorkflow from '../components/BlockchainWorkflow'

export default function DashboardPage(){
  const { tenderId, setTenderId, role, recentTenderIds, addRecentTenderId } = useTender()

  const useId = (id) => { setTenderId(id); addRecentTenderId(id) }

  const formatCurrency = (amount, currency) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  };

  return (
    <div>
      <h3>Enhanced RFQ Dashboard</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12 }}>
        <StatCard label="Total RFQs" value={sampleRFQs.length} />
        <StatCard label="Published RFQs" value={sampleRFQs.filter(rfq => rfq.status === 'PUBLISHED').length} />
        <StatCard label="Draft RFQs" value={sampleRFQs.filter(rfq => rfq.status === 'DRAFT').length} />
        <StatCard label="Total Value" value={formatCurrency(
          sampleRFQs.reduce((sum, rfq) => sum + (rfq.projectScope.budget.estimatedMax || 0), 0),
          'INR'
        ).replace('₹', '₹')} />
      </div>
      <div style={{ marginTop:16, display:'flex', gap:8, flexWrap:'wrap' }}>
        {role==='owner' && <NavLink to="/rfqs/new" style={btnPrimary}>Create RFQ</NavLink>}
        <NavLink to="/bids" style={btn}>Go to Bids</NavLink>
        {role==='owner' && <NavLink to="/projects" style={btn}>Go to Projects</NavLink>}
        <div style={{ display:'inline-flex', gap:8, alignItems:'center' }}>
          <input placeholder="Working Tender ID" value={tenderId} onChange={e=> useId(e.target.value)} style={{ padding:8, border:'1px solid #cbd5e1', borderRadius:6 }} />
        </div>
      </div>

      <div style={{ marginTop:12 }}>
        <h4>Recent Tender IDs</h4>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {recentTenderIds?.length ? recentTenderIds.map(id=> (
            <button key={id} onClick={()=> useId(id)} style={{ padding:'6px 10px', border:'1px solid #cbd5e1', borderRadius:6 }}>{id}</button>
          )) : <div style={{ color:'#6b7280' }}>No recent IDs yet</div>}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h4>Sample Enhanced RFQs</h4>
        <div style={{ display: 'grid', gap: 16 }}>
          {sampleRFQs.slice(0, 2).map((rfq, index) => (
            <div key={index} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: 8, 
              padding: 16,
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h5 style={{ margin: 0, color: '#111827', cursor: 'pointer' }} onClick={() => useId(rfq.id)}>
                    {rfq.id}
                  </h5>
                  <p style={{ margin: '4px 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
                    {rfq.ownerDetails.organizationName}
                  </p>
                </div>
                <span style={{ 
                  backgroundColor: rfq.status === 'PUBLISHED' ? '#10b981' : '#f59e0b', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: 4, 
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {rfq.status}
                </span>
              </div>
              
              <p style={{ margin: '0 0 12px 0', color: '#374151', lineHeight: 1.5, fontSize: '14px' }}>
                {rfq.projectScope.description.substring(0, 150)}...
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, fontSize: '13px' }}>
                <div>
                  <strong>Budget:</strong><br/>
                  {formatCurrency(rfq.projectScope.budget.estimatedMin, rfq.projectScope.budget.currency)} - {formatCurrency(rfq.projectScope.budget.estimatedMax, rfq.projectScope.budget.currency)}
                </div>
                <div>
                  <strong>Deadline:</strong><br/>
                  {new Date(rfq.deadlines.bidSubmissionDeadline).toLocaleDateString('en-IN')}
                </div>
                <div>
                  <strong>Contact:</strong><br/>
                  {rfq.ownerDetails.contactPerson.name}
                </div>
              </div>
              
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {rfq.projectScope.objectives.slice(0, 2).map((objective, idx) => (
                    <span key={idx} style={{ 
                      backgroundColor: '#f3f4f6', 
                      padding: '2px 6px', 
                      borderRadius: 4, 
                      fontSize: '11px',
                      color: '#374151'
                    }}>
                      {objective.length > 35 ? objective.substring(0, 35) + '...' : objective}
                    </span>
                  ))}
                  {rfq.projectScope.objectives.length > 2 && (
                    <span style={{ 
                      backgroundColor: '#e5e7eb', 
                      padding: '2px 6px', 
                      borderRadius: 4, 
                      fontSize: '11px',
                      color: '#6b7280'
                    }}>
                      +{rfq.projectScope.objectives.length - 2} more
                    </span>
                  )}
                </div>
                
                {/* Blockchain Workflow */}
                <BlockchainWorkflow 
                  currentStage={rfq.blockchainStage} 
                  rfqId={rfq.id}
                  showDetails={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }){
  return (
    <div style={{ border:'1px solid #e5e7eb', borderRadius:12, padding:14 }}>
      <div style={{ color:'#6b7280', fontSize:12 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:700 }}>{value}</div>
    </div>
  )
}

const btn = { padding:'10px 14px', borderRadius:8, border:'1px solid #1e293b', color:'#1e293b', textDecoration:'none' }
const btnPrimary = { ...btn, background:'#2563EB', color:'#fff', borderColor:'#2563EB' }
