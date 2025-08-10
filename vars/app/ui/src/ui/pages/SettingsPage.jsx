import React from 'react'
import { useTender } from '../context/TenderContext'

export default function SettingsPage(){
  const { role, setRole, tenderId, setTenderId, org, setOrg } = useTender()
  return (
    <div>
      <h3>Settings</h3>
      <div style={{ display:'grid', gap:12, maxWidth:480 }}>
        <label style={{ display:'grid', gap:6 }}>
          <span>Role</span>
          <select value={role} onChange={e=> setRole(e.target.value)}>
            <option value="owner">Owner</option>
            <option value="bidder">Bidder</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label style={{ display:'grid', gap:6 }}>
          <span>Organization</span>
          <select value={org} onChange={e=> setOrg(e.target.value)}>
            <option value="org1">Org1</option>
            <option value="org0">Org0</option>
          </select>
        </label>
        <label style={{ display:'grid', gap:6 }}>
          <span>Working Tender ID</span>
          <input value={tenderId} onChange={e=> setTenderId(e.target.value)} />
        </label>
        <RoleHelp role={role} org={org} />
      </div>
    </div>
  )
}

function RoleHelp({ role, org }){
  const map = {
    owner: ['Dashboard','RFQs','Bids','Projects','Reports','Settings'],
    bidder: ['Dashboard','RFQs (browse)','Bids (submit)','Settings'],
    admin: ['Dashboard','Reports','Settings'],
  }
  return (
    <div style={{ background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:8, padding:12 }}>
      <div style={{ color:'#6b7280', fontSize:12 }}>Current role/org</div>
      <div style={{ fontWeight:600 }}>{role} • {org.toUpperCase()}</div>
      <div style={{ marginTop:6 }}>{map[role].join(' • ')}</div>
      <div style={{ marginTop:6, color:'#6b7280', fontSize:12 }}>All API calls include header <code>x-org: {org}</code></div>
    </div>
  )
}
