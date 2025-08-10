import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { useTender } from '../context/TenderContext'

export default function LoginPage(){
  const { login } = useAuth()
  const { setRole } = useTender()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      const u = await login(username, password)
      setRole(u.role)
      navigate('/')
    } catch(e){
      setErr(e.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ maxWidth:420 }}>
      <h3>Sign in</h3>
      <form onSubmit={submit} style={{ display:'grid', gap:10 }}>
        <label style={{ display:'grid', gap:6 }}>
          <span>Username</span>
          <input value={username} onChange={e=> setUsername(e.target.value)} required autoFocus />
        </label>
        <label style={{ display:'grid', gap:6 }}>
          <span>Password</span>
          <input type="password" value={password} onChange={e=> setPassword(e.target.value)} required />
        </label>
        {err && <div role="alert" style={{ color:'#EF4444' }}>{err}</div>}
        <button type="submit" disabled={busy}>{busy? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p style={{ opacity:0.7, marginTop:8 }}>Demo: owner/owner123, bidder/bidder123, admin/admin123</p>
    </div>
  )
}
