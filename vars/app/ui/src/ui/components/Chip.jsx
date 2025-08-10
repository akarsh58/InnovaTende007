import React from 'react'

export default function Chip({ text, color, tone = 'solid' }){
  const styles = tone === 'solid'
    ? { background: color || '#e5e7eb', color: '#fff' }
    : { background: 'transparent', color: color || '#1f2937', border: `1px solid ${color || '#e5e7eb'}` }
  return (
    <span style={{ ...styles, padding:'2px 8px', borderRadius:999, fontSize:12, display:'inline-block' }}>{text}</span>
  )
}
