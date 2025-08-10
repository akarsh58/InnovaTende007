import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const API = (path) => (import.meta.env.VITE_API_BASE || 'http://localhost:3000') + path

export default function RFQPage(){
  const [tid, setTid] = useState('RFQ-' + new Date().toISOString().replace(/[-:.TZ]/g,''))
  const [log, setLog] = useState('')
  const append = (m) => setLog(prev=> prev + '\n' + m)

  const post = async (url, body) => {
    const res = await fetch(API(url), { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body||{}) })
    const j = await res.json(); if(!j.success) throw new Error(j.error); return j.data
  }
  const createRFQ = async () => {
    const rfq = {
      id: tid,
      projectScope: {
        description: 'Civil works RFQ created from UI',
        objectives: ['Quality construction', 'On-time delivery'],
        deliverables: ['As per specifications', 'Quality documentation'],
        technicalSpecs: ['MORTH standards', 'Quality materials'],
        qualityStandards: ['ISO 9001'],
        budget: {
          currency: 'USD',
          estimatedMin: 100000,
          estimatedMax: 500000,
          paymentTerms: 'Net 30'
        }
      },
      deadlines: { 
        rfqIssueDate: new Date().toISOString(), 
        bidSubmissionDeadline: new Date(Date.now()+7*864e5).toISOString(),
        projectStartDate: new Date(Date.now()+14*864e5).toISOString(),
        projectEndDate: new Date(Date.now()+90*864e5).toISOString()
      },
      evaluationCriteria: [
        { id: 'PRICE', name: 'Total Cost', weight: 50, type: 'QUANTITATIVE', scoringMethod: 'LOWEST_PRICE', description: 'Overall project cost', mandatoryRequirement: false },
        { id: 'EXPERIENCE', name: 'Experience', weight: 50, type: 'QUALITATIVE', scoringMethod: 'HIGHEST_SCORE', description: 'Relevant experience', mandatoryRequirement: false }
      ],
      bidRequirements: {
        financialRequirements: { auditedFinancials: true, yearsOfFinancials: 3, currency: 'USD' },
        experienceRequirements: { minYearsInBusiness: 5, similarProjectsMin: 1 }
      },
      ownerDetails: {
        organizationName: 'Sample Organization',
        contactPerson: { name: 'Project Manager', email: 'pm@example.com', phone: '+1-555-0123' }
      }
    }
    await post('/rfq', rfq); append('Enhanced RFQ created ' + tid)
  }
  const publish = async () => { await post(`/tenders/${tid}/publish`); append('Published') }

  return (
    <div>
      <h3>RFQs</h3>
      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
        <input value={tid} onChange={e=>setTid(e.target.value)} style={{ padding:8, flex:1 }} />
        <button onClick={createRFQ}>Create RFQ</button>
        <button onClick={publish}>Publish</button>
        <NavLink to="/rfqs/new" style={{ marginLeft:'auto' }}>Open RFQ Wizard →</NavLink>
      </div>
      <pre style={{ background:'#111', color:'#0f0', padding:10, marginTop:16, height:160, overflow:'auto' }}>{log}</pre>
    </div>
  )
}
