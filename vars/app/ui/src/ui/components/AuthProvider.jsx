import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const API = (p) => (import.meta.env.VITE_API_BASE || 'http://localhost:3000') + p

export function AuthProvider({ children }){
  const [token, setToken] = useState(()=> localStorage.getItem('token') || '')
  const [user, setUser] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('user')||'null') } catch { return null }
  })

  useEffect(()=> { token ? localStorage.setItem('token', token) : localStorage.removeItem('token') }, [token])
  useEffect(()=> { user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user') }, [user])

  async function login(username, password){
    const r = await fetch(API('/auth/login'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) })
    const j = await r.json(); if(!j.success) throw new Error(j.error || 'Login failed')
    const newUser = { username: j.data.username, role: j.data.role, org: j.data.org, token: j.data.token }
    setToken(j.data.token)
    setUser({ username: newUser.username, role: newUser.role, org: newUser.org })
    return newUser
  }
  function logout(){ setToken(''); setUser(null) }

  const value = useMemo(()=>({ token, user, login, logout }), [token, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
