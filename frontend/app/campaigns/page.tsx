'use client'

import { useEffect, useState, useRef } from 'react'
import { Check, Download, Plus, Search, Zap, Loader2, X, Upload } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { fetchApi, getAuthToken, API_BASE_URL } from '@/lib/api'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: '', property: '' })
  const [creating, setCreating] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingCampaignId, setUploadingCampaignId] = useState<string | null>(null)

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      const data = await fetchApi('/api/v1/campaigns')
      setCampaigns(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  const visibleCampaigns = campaigns.filter((c) => c.name?.toLowerCase().includes(query.toLowerCase()))
  const toggleCampaign = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      await fetchApi('/api/v1/campaigns', {
        method: 'POST',
        body: JSON.stringify(newCampaign)
      })
      setShowModal(false)
      setNewCampaign({ name: '', property: '' })
      loadCampaigns()
    } catch (e) {
      alert('Failed to create campaign')
    } finally {
      setCreating(false)
    }
  }

  const handleUploadClick = (campaignId: string) => {
    setUploadingCampaignId(campaignId)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadingCampaignId) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('campaign_id', uploadingCampaignId)

      const token = getAuthToken()
      const response = await fetch(`${API_BASE_URL}/api/v1/leads/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')
      
      const result = await response.json()
      alert(`Successfully uploaded ${result.inserted_count} leads to the campaign!`)
      loadCampaigns()
    } catch (error) {
      alert('Failed to upload leads')
    } finally {
      setUploadingCampaignId(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleStartCalling = async () => {
    try {
      await fetchApi('/api/v1/calls/trigger-campaigns', {
        method: 'POST',
        body: JSON.stringify({
          campaign_ids: selected
        })
      })
      alert('Calls dispatched successfully!')
      setSelected([])
    } catch (e: any) {
      alert(`Failed to dispatch calls: ${e.message}`)
    }
  }

  const handleDownload = () => {
    if (campaigns.length === 0) return alert("No data to download")
    const csv = ["Campaign Name,Property,Leads,Calls,Connected,Interested,Status"]
    campaigns.forEach(c => csv.push(`${c.name},${c.property},${c.leads},${c.calls},${c.connected},${c.interested},${c.status}`))
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'campaigns_export.csv'
    a.click()
  }

  return (
    <AppLayout title="Campaigns">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-primary">Workspace / Campaigns</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.06em] sm:text-[34px]">Campaign Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your AI outbound calling campaigns.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90">
            <Plus size={15} />Create Campaign
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">Active campaigns</h2>
            <p className="mt-1 text-xs text-muted-foreground">Monitor campaigns and keep your calling engine moving.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-primary" size={14} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search campaigns" className="h-9 w-44 rounded-lg border border-primary ring-1 ring-primary/20 bg-background pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <button onClick={handleDownload} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted"><Download size={15} /></button>
          </div>
        </div>
        
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border h-12 text-sm font-bold uppercase tracking-wider text-foreground">
                <th className="px-4 font-semibold w-[28%]">Campaign & Property</th>
                <th className="px-2 text-center font-semibold w-[9%]">Leads</th>
                <th className="px-2 text-center font-semibold w-[9%]">Calls</th>
                <th className="px-2 text-center font-semibold w-[11%]">Connected</th>
                <th className="px-2 text-center font-semibold w-[11%]">Interested</th>
                <th className="px-2 text-center font-semibold w-[11%]">Conversion</th>
                <th className="px-2 font-semibold w-[10%]">Status</th>
                <th className="px-4 text-right font-semibold w-[11%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">Loading campaigns...</td></tr>
              ) : visibleCampaigns.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">No campaigns found. Create one above!</td></tr>
              ) : (
                visibleCampaigns.map((campaign) => (
                  <tr key={campaign.campaign_id} className="group h-16 hover:bg-muted/30 transition-colors">
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleCampaign(campaign.campaign_id)} 
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${selected.includes(campaign.campaign_id) ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:border-primary/50 bg-background'}`}
                        >
                          {selected.includes(campaign.campaign_id) && <Check size={12} strokeWidth={3} />}
                        </button>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground truncate max-w-[200px]" title={campaign.name}>{campaign.name}</span>
                          <span className="text-xs font-medium text-muted-foreground truncate max-w-[200px]" title={campaign.property}>{campaign.property || 'No Property'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 text-center text-sm font-medium">{campaign.leads}</td>
                    <td className="px-2 text-center text-sm font-medium">{campaign.calls}</td>
                    <td className="px-2 text-center text-sm font-medium">{campaign.connected}</td>
                    <td className="px-2 text-center text-sm font-medium">{campaign.interested}</td>
                    <td className="px-2 text-center text-sm font-bold text-primary">{campaign.conversion}</td>
                    <td className="px-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`/leads?campaign_id=${campaign.campaign_id}`}
                          className="inline-flex h-8 items-center justify-center whitespace-nowrap gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                        >
                          View Leads
                        </a>
                        <button 
                          onClick={() => handleUploadClick(campaign.campaign_id)}
                          disabled={uploadingCampaignId === campaign.campaign_id}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          title="Upload Leads"
                        >
                          {uploadingCampaignId === campaign.campaign_id ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          <span>Upload</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{selected.length} campaigns selected</span>
          </p>
          <button onClick={handleStartCalling} disabled={selected.length === 0} className="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-2.5 text-xs font-semibold text-background hover:opacity-90 disabled:opacity-50">
            <Zap size={14} />Start AI calling
          </button>
        </div>
      </section>

      <input type="file" accept=".csv,.xlsx" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Create Campaign</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Campaign Name</label>
                <input required value={newCampaign.name} onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. Summer Outreach" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Property / Project (Optional)</label>
                <input value={newCampaign.property} onChange={(e) => setNewCampaign({...newCampaign, property: e.target.value})} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="e.g. Luxury Villas" />
              </div>
              <button disabled={creating} className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {creating ? <Loader2 size={16} className="animate-spin" /> : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

