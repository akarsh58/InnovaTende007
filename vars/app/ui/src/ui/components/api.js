import { useAuth } from './AuthProvider'
import { useTender } from '../context/TenderContext'

const base = (import.meta.env.VITE_API_BASE || 'http://localhost:3000')

export function useApi(){
  const { token } = useAuth()
  const { org } = useTender()
  const headers = () => ({
    ...(token? { Authorization: `Bearer ${token}` } : {}),
    'x-org': org || 'org1'
  })
  async function get(path){
    const r = await fetch(base + path, { headers: headers() })
    const j = await r.json(); if(!j.success) throw new Error(j.error); return j.data
  }
  async function post(path, body){
    const r = await fetch(base + path, { method:'POST', headers: { 'Content-Type':'application/json', ...headers() }, body: JSON.stringify(body||{}) })
    const j = await r.json(); if(!j.success) throw new Error(j.error); return j.data
  }
  return { get, post }
}
