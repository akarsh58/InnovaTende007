import React from 'react'

export default function DataTable({ rows = [], cols = [], searchable = true, initialSort, pageSize = 10, enableExport = true }){
  const [q, setQ] = React.useState('')
  const [sort, setSort] = React.useState(initialSort || { key: cols[0]?.k, dir: 'asc' })
  const [page, setPage] = React.useState(1)

  const filtered = React.useMemo(()=>{
    if(!q) return rows
    const query = q.toLowerCase()
    return rows.filter(r=> Object.values(r||{}).some(v=> String(typeof v==='object'? JSON.stringify(v): v).toLowerCase().includes(query)))
  }, [rows, q])

  const sorted = React.useMemo(()=>{
    const list = [...filtered]
    if(!sort?.key) return list
    list.sort((a,b)=>{
      const av = getValue(a, sort.key)
      const bv = getValue(b, sort.key)
      if(av === bv) return 0
      return (av > bv ? 1 : -1) * (sort.dir==='asc'? 1 : -1)
    })
    return list
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageRows = React.useMemo(()=> sorted.slice((page-1)*pageSize, page*pageSize), [sorted, page, pageSize])

  const toggleSort = (key) => { setSort(s=> s?.key===key ? { key, dir: s.dir==='asc'?'desc':'asc' } : { key, dir:'asc' }); setPage(1) }

  const exportCsv = () => {
    const header = cols.map(c=> c.t).join(',')
    const lines = sorted.map(r=> cols.map(c=> csvEscape(c.render? c.render(r): getValue(r, c.k))).join(','))
    const csv = [header, ...lines].join('\n')
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden' }}>
      <div style={{ display:'flex', gap:8, alignItems:'center', padding:8, borderBottom:'1px solid #e5e7eb', background:'#fafafa' }}>
        {searchable && <input value={q} onChange={e=> { setQ(e.target.value); setPage(1) }} placeholder="Search" style={{ flex:1, padding:8, border:'1px solid #cbd5e1', borderRadius:6 }} />}
        {enableExport && <button onClick={exportCsv}>Export CSV</button>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns: `repeat(${cols.length}, 1fr)`, background:'#f8fafc', padding:'8px 10px', fontWeight:600 }}>
        {cols.map(c=> (
          <div key={c.k} style={{ cursor:'pointer' }} onClick={()=> toggleSort(c.k)}>
            {c.t} {sort?.key===c.k ? (sort.dir==='asc'?'▲':'▼') : ''}
          </div>
        ))}
      </div>
      {pageRows?.length ? pageRows.map((r,i)=> (
        <div key={i} style={{ display:'grid', gridTemplateColumns: `repeat(${cols.length}, 1fr)`, padding:'8px 10px', borderTop:'1px solid #e5e7eb' }}>
          {cols.map(c=> <div key={c.k}>{c.render? c.render(r): getValue(r, c.k)}</div>)}
        </div>
      )) : <div style={{ padding:12, color:'#6b7280' }}>No data</div>}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:8, borderTop:'1px solid #e5e7eb', background:'#fafafa' }}>
        <span>Page {page} / {totalPages}</span>
        <div style={{ display:'flex', gap:6 }}>
          <button onClick={()=> setPage(1)} disabled={page===1}>«</button>
          <button onClick={()=> setPage(p=> Math.max(1, p-1))} disabled={page===1}>‹</button>
          <button onClick={()=> setPage(p=> Math.min(totalPages, p+1))} disabled={page===totalPages}>›</button>
          <button onClick={()=> setPage(totalPages)} disabled={page===totalPages}>»</button>
        </div>
      </div>
    </div>
  )
}

function getValue(obj, path){
  if(!obj) return ''
  if(!path.includes('.')) return obj[path]
  return path.split('.').reduce((acc, key)=> (acc && acc[key] != null ? acc[key] : ''), obj)
}

function csvEscape(v){
  const s = String(v ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}
