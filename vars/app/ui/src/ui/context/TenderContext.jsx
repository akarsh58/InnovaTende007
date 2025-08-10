import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TenderContext = createContext(null)

export function TenderProvider({ children }){
  const [tenderId, setTenderId] = useState(()=> localStorage.getItem('tenderId') || '')
  const [role, setRole] = useState(()=> localStorage.getItem('role') || 'owner')
  const [org, setOrg] = useState(()=> localStorage.getItem('org') || 'org1')
  const [recentTenderIds, setRecentTenderIds] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('recentTenderIds')||'[]') } catch { return [] }
  })

  useEffect(()=> { localStorage.setItem('tenderId', tenderId) }, [tenderId])
  useEffect(()=> { localStorage.setItem('role', role) }, [role])
  useEffect(()=> { localStorage.setItem('org', org) }, [org])
  useEffect(()=> { localStorage.setItem('recentTenderIds', JSON.stringify(recentTenderIds.slice(0,10))) }, [recentTenderIds])

  function addRecentTenderId(id){
    if(!id) return
    setRecentTenderIds(prev=> [id, ...prev.filter(x=> x!==id)].slice(0,10))
  }
  function removeRecentTenderId(id){ setRecentTenderIds(prev=> prev.filter(x=> x!==id)) }

  const value = useMemo(()=>({ tenderId, setTenderId, role, setRole, org, setOrg, recentTenderIds, addRecentTenderId, removeRecentTenderId }), [tenderId, role, org, recentTenderIds])
  return <TenderContext.Provider value={value}>{children}</TenderContext.Provider>
}

export function useTender(){
  const ctx = useContext(TenderContext)
  if(!ctx) throw new Error('useTender must be used within TenderProvider')
  return ctx
}
