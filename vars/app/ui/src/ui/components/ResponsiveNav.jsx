import React, { useState, useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTender } from '../context/TenderContext'
import { useAuth } from './AuthProvider'

export default function ResponsiveNav(){
  const [open, setOpen] = useState(false)
  const { role } = useTender()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const allTabs = [
    { to: '/', label: 'Dashboard', roles: ['owner','bidder','admin'] },
    { to: '/rfqs', label: 'RFQs', roles: ['owner','bidder'] },
    { to: '/bids', label: 'Bids', roles: ['owner','bidder'] },
    { to: '/projects', label: 'Projects', roles: ['owner'] },
    { to: '/reports', label: 'Reports', roles: ['owner','bidder','admin'] },
    { to: '/settings', label: 'Settings', roles: ['owner','bidder','admin'] },
  ]

  const tabs = useMemo(()=> allTabs.filter(t=> t.roles.includes(role)), [role])

  const LinkEl = ({ to, label }) => (
    <NavLink
      to={to}
      end={to==='/' }
      style={({ isActive })=> ({
        padding:'8px 12px', borderRadius:8, textDecoration:'none', cursor:'pointer',
        background: isActive ? '#1e293b' : 'transparent',
        color: isActive ? '#fff' : '#1e293b',
        border: '1px solid #1e293b'
      })}
      onClick={()=> setOpen(false)}
    >{label}</NavLink>
  )
  return (
    <div style={{ borderBottom:'1px solid #e5e7eb', marginBottom:16, position:'sticky', top:0, background:'#fff', zIndex:40, pointerEvents:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0' }}>
        <button onClick={()=> setOpen(v=>!v)} aria-label="Toggle Menu" style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:36, height:36, borderRadius:8, border:'1px solid #cbd5e1', background:'#fff', cursor:'pointer' }}>
          ☰
        </button>
        <h2 style={{ margin:0, marginRight:'auto' }}>Tender Platform</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {user ? (
            <>
              <span title={user.username} style={{ padding:'6px 10px', border:'1px solid #cbd5e1', borderRadius:8 }}>👤 {user.username}</span>
              <button onClick={()=> { logout(); navigate('/login') }} style={{ cursor:'pointer' }}>Sign out</button>
            </>
          ) : (
            <button type="button" aria-label="Sign in" onClick={()=> navigate('/login')} style={{ padding:'8px 12px', border:'1px solid #1e293b', borderRadius:8, background:'#fff', color:'#1e293b', cursor:'pointer' }}>Sign in</button>
          )}
        </div>
      </div>
      <div style={{ display:'none', gap:8, padding:'0 0 12px 0' }} className="nav-desktop">
        {tabs.map(t=> <LinkEl key={t.to} {...t} />)}
      </div>
      {open && (
        <div style={{ display:'flex', flexDirection:'column', gap:8, padding:'0 0 12px 0' }} className="nav-mobile">
          {tabs.map(t=> <LinkEl key={t.to} {...t} />)}
        </div>
      )}
      <style>{`
        @media (min-width: 1024px){
          .nav-desktop{ display:flex }
          .nav-mobile{ display:none }
        }
      `}</style>
    </div>
  )
}
