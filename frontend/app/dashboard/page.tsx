'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  Check,
  Download,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { MetricCard } from '@/components/ui/MetricCard'
import { MiniChart } from '@/components/ui/MiniChart'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/components/providers/AuthProvider'

export default function DashboardPage() {
  const { user } = useAuth()
  const [range, setRange] = useState('Last 30 days')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('Good morning')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetchApi(`/api/v1/analytics/dashboard?range=${encodeURIComponent(range)}`)
        setDashboardData(res.data)
      } catch (e) {
        console.error('Failed to load dashboard data', e)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [range])

  const metrics = [
    ['Total leads', dashboardData?.total_leads || '0', '+0%', Users, 'blue'],
    ['Calls made', dashboardData?.calls_made || '0', '+0%', Phone, 'violet'],
    ['Connected calls', dashboardData?.connected_calls || '0', '+0%', Activity, 'green'],
    ['Qualified leads', dashboardData?.qualified_leads || '0', '+0%', Target, 'orange'],
    ['Interested leads', dashboardData?.interested_leads || '0', '+0%', Sparkles, 'blue'],
    ['Conversion rate', dashboardData?.conversion_rate || '0%', '+0%', TrendingUp, 'green'],
  ] as const

  const tLeads = dashboardData?.total_leads || 0
  const calcPct = (val: number) => tLeads > 0 ? `${Math.min(Math.round(((val || 0) / tLeads) * 100), 100)}%` : '0%'

  const funnel = [
    ['Total leads', tLeads, '100%'], 
    ['Contacted', dashboardData?.contacted_leads || 0, calcPct(dashboardData?.contacted_leads)], 
    ['Connected', dashboardData?.connected_calls || 0, calcPct(dashboardData?.connected_calls)], 
    ['Interested', dashboardData?.interested_leads || 0, calcPct(dashboardData?.interested_leads)], 
    ['Qualified', dashboardData?.qualified_leads || 0, calcPct(dashboardData?.qualified_leads)], 
    ['Converted', dashboardData?.converted_leads || 0, calcPct(dashboardData?.converted_leads)],
  ]

  const campaigns = dashboardData?.active_campaigns || []
  const visibleCampaigns = campaigns.filter((c: any) => c.name?.toLowerCase().includes(query.toLowerCase()))
  const toggleCampaign = (name: string) => setSelected((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name])

  const handleDownload = () => {
    if (!dashboardData) return alert("No data to download")
    const csv = [
      "Metric,Value",
      `Total Leads,${dashboardData.total_leads || 0}`,
      `Calls Made,${dashboardData.calls_made || 0}`,
      `Connected Calls,${dashboardData.connected_calls || 0}`,
      `Qualified Leads,${dashboardData.qualified_leads || 0}`,
      `Interested Leads,${dashboardData.interested_leads || 0}`,
      `Conversion Rate,${dashboardData.conversion_rate || '0%'}`,
    ]
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dashboard_metrics.csv'
    a.click()
  }

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex h-[400px] items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Dashboard">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-primary">Overview / Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.06em] sm:text-[34px]">
            {greeting}, {user?.name || 'User'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your AI calling today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/campaigns" className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-semibold hover:bg-muted">
            <Plus size={15} />Create Campaign
          </Link>
          <Link href="/leads" className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90">
            <Upload size={15} />Upload Leads
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((item) => (
          <MetricCard key={item[0]} label={item[0] as string} value={item[1] as string} change={item[2] as string} Icon={item[3] as any} tone={item[4] as any} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Performance</p>
              <h2 className="mt-1 text-lg font-bold">Calling performance</h2>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
              {['Today', '7 Days', '30 Days', '90 Days'].map((item) => (
                <button key={item} onClick={() => setRange(item)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${range === item ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-[11px] text-muted-foreground">
            <span><i className="legend-dot bg-primary/25" />Calls made</span>
            <span><i className="legend-dot bg-primary" />Connected calls</span>
          </div>
          <MiniChart data={dashboardData?.chart_data} />
        </article>

        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Conversion path</p>
              <h2 className="mt-1 text-lg font-bold">Lead funnel</h2>
            </div>
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Funnel options"><MoreHorizontal size={17} /></button>
          </div>
          <div className="mt-5 space-y-3">
            {funnel.map(([label, value, percentage], index) => (
              <div key={label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{label}</span>
                  <span className="font-semibold">{value} <span className="ml-1 text-muted-foreground">{percentage}</span></span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${index < 2 ? 'bg-primary' : index < 4 ? 'bg-primary/70' : 'bg-primary/45'}`} style={{ width: `${Math.min(Math.max(percentage === '100%' ? 100 : parseFloat(percentage as string), 0), 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>


    </AppLayout>
  )
}
