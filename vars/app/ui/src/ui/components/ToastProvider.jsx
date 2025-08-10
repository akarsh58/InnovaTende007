import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])
  const add = useCallback((type, message)=>{
    const id = Date.now() + Math.random()
    setToasts(prev=> [...prev, { id, type, message }])
    setTimeout(()=> setToasts(prev=> prev.filter(t=> t.id !== id)), 3000)
  }, [])
  const api = {
    success: (m)=> add('success', m),
    error: (m)=> add('error', m),
    info: (m)=> add('info', m),
  }
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div style={{ position:'fixed', right:16, bottom:16, display:'flex', flexDirection:'column', gap:8, zIndex:50 }}>
        {toasts.map(t=> (
          <div key={t.id} style={{ padding:'10px 14px', borderRadius:8, color:'#fff', background: t.type==='success' ? '#10B981' : t.type==='error' ? '#EF4444' : '#2563EB', boxShadow:'0 8px 20px rgba(0,0,0,0.15)' }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastContext)
  if(!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
