'use client'

import { useEffect, useState } from 'react'
import {
  Download,
  Phone,
  Search,
  MoreHorizontal,
  X,
  User,
  Sparkles,
  MessageSquare,
  Clock,
  Activity,
  Trash2
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { fetchApi } from '@/lib/api'

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selectedCall, setSelectedCall] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const [selectedCalls, setSelectedCalls] = useState<string[]>([])
  const LIMIT = 20

  const loadCalls = async (pageNum: number) => {
    if (pageNum === 0) setLoading(true)
    try {
      const data = await fetchApi(`/api/v1/calls?limit=${LIMIT}&skip=${pageNum * LIMIT}`)
      if (data && data.length > 0) {
        if (pageNum === 0) {
          setCalls(data)
        } else {
          setCalls(prev => [...prev, ...data])
        }
        if (data.length < LIMIT) setHasMore(false)
      } else {
        if (pageNum === 0) setCalls([])
        setHasMore(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalls(page)
  }, [page])

  const handleDownload = () => {
    if (calls.length === 0) return alert("No data to download")
    const csv = ["Call ID,Customer,Phone,Direction,Duration,Status,Sentiment"]
    calls.forEach(c => csv.push(`${c.call_id},${c.customer_name},${c.customer_phone || ''},${c.direction},${c.duration_seconds},${c.status},${c.sentiment}`))
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'calls_export.csv'
    a.click()
  }

  const handleDeleteSelected = async () => {
    if (selectedCalls.length === 0) return alert('Please select at least one call to delete.')
    if (!confirm(`Are you sure you want to delete ${selectedCalls.length} selected call(s)? This cannot be undone.`)) return
    try {
      await fetchApi('/api/v1/calls/delete-bulk', { 
        method: 'POST',
        body: JSON.stringify({ call_ids: selectedCalls })
      })
      alert('Selected calls deleted successfully!')
      setSelectedCalls([])
      fetchCalls(1, true)
    } catch (e: any) {
      alert(`Failed to delete calls: ${e.message}`)
    }
  }

  const visibleCalls = calls
    .filter((c) => 
      (c.customer_name || '').toLowerCase().includes(query.toLowerCase()) || 
      String(c.customer_phone || '').includes(query)
    )
    .filter((c) => {
      if (!filterStatus || filterStatus === 'All Statuses') return true;
      if (filterStatus === 'Qualified') return c.analysis?.lead_temperature === 'Hot';
      if (filterStatus === 'Interested') return c.analysis?.lead_temperature === 'Warm';
      if (filterStatus === 'Not Interested') return c.analysis?.lead_temperature === 'Cold';
      return c.status === filterStatus;
    })

  return (
    <AppLayout title="Calls">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-primary">Workspace / Calls</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.06em] sm:text-[34px]">Call History</h1>
          <p className="mt-2 text-sm text-muted-foreground">Review transcripts and analytics for completed calls.</p>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-muted-foreground" size={14} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search calls" className="h-9 w-64 rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus || 'All Statuses'}
              onChange={(e) => setFilterStatus(e.target.value === 'All Statuses' ? null : e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Qualified">Qualified (Hot)</option>
              <option value="Interested">Interested (Warm)</option>
              <option value="Not Interested">Not Interested (Cold)</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={handleDeleteSelected} className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={15} />Delete Selected</button>
            <button onClick={handleDownload} className="rounded-lg border border-border bg-muted/50 p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Download size={15} /></button>
          </div>
        </div>
        
        <div className="mt-5 overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Loading calls...</div>
          ) : visibleCalls.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No calls found.</div>
          ) : (
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="pb-3 pl-4 font-semibold w-10">
                    <input 
                      type="checkbox" 
                      checked={visibleCalls.length > 0 && selectedCalls.length === visibleCalls.length}
                      onChange={(e) => setSelectedCalls(e.target.checked ? visibleCalls.map((c: any) => c.call_id) : [])}
                      className="rounded border-border accent-primary cursor-pointer w-3.5 h-3.5"
                    />
                  </th>
                  <th className="pb-3 font-semibold">Lead</th>
                  <th className="pb-3 font-semibold">Phone</th>
                  <th className="pb-3 font-semibold">Language</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCalls.map((call) => {
                  const durationSecs = call.duration_seconds || 0;
                  const hasDuration = !!call.duration || durationSecs > 0;
                  const isNotReceived = !hasDuration || call.duration === '00:00' || call.duration === '0';
                  const displayStatus = isNotReceived ? 'Not Received' : call.status;
                  
                  const formatDuration = (secs: number) => {
                    const m = Math.floor(secs / 60);
                    const s = secs % 60;
                    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                  };
                  const durationDisplay = isNotReceived ? '--:--' : (call.duration || formatDuration(durationSecs));
                  
                  return (
                  <tr key={call.call_id} className="border-b border-border/70 last:border-0 hover:bg-muted/30">
                    <td className="py-4 pl-4">
                      <input 
                        type="checkbox" 
                        checked={selectedCalls.includes(call.call_id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCalls([...selectedCalls, call.call_id])
                          else setSelectedCalls(selectedCalls.filter(id => id !== call.call_id))
                        }}
                        className="rounded border-border accent-primary cursor-pointer w-3.5 h-3.5"
                      />
                    </td>
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><Phone size={14} /></span>
                        <p className="text-sm font-semibold">{call.customer_name || 'Phone Lead'}</p>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-mono text-muted-foreground">{call.customer_id}</td>
                    <td className="py-4 text-xs">{call.language || 'English'}</td>
                    <td className="py-4 text-xs font-mono text-muted-foreground">{durationDisplay}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold
                        ${displayStatus === 'Completed' || displayStatus === 'completed' ? 'bg-emerald-50 text-emerald-700' : ''}
                        ${displayStatus === 'Failed' || displayStatus === 'failed' ? 'bg-destructive/10 text-destructive' : ''}
                        ${displayStatus === 'Initiating' ? 'bg-blue-50 text-blue-700' : ''}
                        ${displayStatus === 'Not Received' ? 'bg-orange-50 text-orange-700' : ''}
                        ${displayStatus === 'Analyzed' ? 'bg-purple-50 text-purple-700' : 'bg-muted text-muted-foreground'}
                      `}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-muted-foreground">
                      {new Date(call.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => setSelectedCall(call)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          )}
          
          {calls.length > 0 && hasMore && (
            <div className="mt-6 flex justify-center pb-4">
              <button 
                onClick={() => setPage(p => p + 1)} 
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-border/50 bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="relative border-b border-border/50 bg-muted/30 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{selectedCall.customer_name || 'Phone Lead'}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Phone size={14} />
                    <span className="font-medium">{selectedCall.customer_phone || selectedCall.customer_id}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCall(null)} 
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    <Clock size={14} className="text-primary" /> Duration
                  </div>
                  <div className="text-sm font-medium line-clamp-2">{selectedCall.duration_seconds ? `${Math.floor(selectedCall.duration_seconds / 60)}:${(selectedCall.duration_seconds % 60).toString().padStart(2, '0')}` : '--:--'}</div>
                </div>
                
                <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    <MessageSquare size={14} className="text-primary" /> Language
                  </div>
                  <div className="text-sm font-medium line-clamp-2">{selectedCall.language || 'English'}</div>
                </div>
                
                <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    <Activity size={14} className="text-blue-500" /> Status
                  </div>
                  <div className="text-sm font-bold text-foreground capitalize">
                    {selectedCall.status}
                  </div>
                </div>
                
                <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    <Sparkles size={14} className="text-amber-500" /> AI Intent
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {selectedCall.analysis?.lead_temperature || '-'}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
                    <Sparkles size={16} className="text-primary" /> Call Summary
                  </h3>
                  <div className="rounded-xl border border-border/50 bg-card p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                    {selectedCall.summary || selectedCall.analysis?.summary || 'No summary available.'}
                  </div>
                </div>
                
                {selectedCall.transcript && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
                      <MessageSquare size={16} className="text-primary" /> Transcript
                    </h3>
                    <div className="rounded-xl border border-border/50 bg-card p-4 text-sm leading-relaxed text-muted-foreground shadow-sm max-h-[250px] overflow-y-auto whitespace-pre-wrap">
                      {selectedCall.transcript}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
