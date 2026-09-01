'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { MetricCard } from '@/components/ui/MetricCard'
import { Phone, Clock, DollarSign, Target, ArrowDownLeft, ArrowUpRight, Loader2, Users, Star } from 'lucide-react'
import { fetchApi } from '@/lib/api'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetchApi('/api/v1/analytics/overall')
        setData(res.data)
      } catch (e) {
        console.error('Failed to load analytics', e)
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <AppLayout title="Analytics">
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    )
  }

  if (!data) {
    return (
      <AppLayout title="Analytics">
        <div className="flex h-[400px] items-center justify-center text-muted-foreground">
          Failed to load analytics data.
        </div>
      </AppLayout>
    )
  }

  const metrics = [
    ['Total Calls', data.total_calls.toString(), '+0%', Phone, 'violet'],
    ['Total Leads', data.total_leads?.toString() || '0', '+0%', Users, 'blue'],
    ['Avg Lead Score', data.average_lead_score ? data.average_lead_score.toString() : '0', '+0%', Star, 'green'],
    ['Avg Conversion', `${data.average_conversion_probability}%`, '+0%', Target, 'orange'],
  ] as const

  // For the intent breakdown
  const totalLeadsWithIntent = (data.hot_leads || 0) + (data.warm_leads || 0) + (data.cold_leads || 0)
  const calcPct = (val: number) => totalLeadsWithIntent > 0 ? (val / totalLeadsWithIntent) * 100 : 0

  const hotPct = calcPct(data.hot_leads)
  const warmPct = calcPct(data.warm_leads)
  const coldPct = calcPct(data.cold_leads)

  // For the call breakdown
  const totalCallsDirection = (data.inbound_calls || 0) + (data.outbound_calls || 0)
  const inboundPct = totalCallsDirection > 0 ? (data.inbound_calls / totalCallsDirection) * 100 : 0
  const outboundPct = totalCallsDirection > 0 ? (data.outbound_calls / totalCallsDirection) * 100 : 0

  return (
    <AppLayout title="Analytics">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-primary">Workspace / Analytics</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.06em] sm:text-[34px]">Analytics</h1>
          <p className="mt-2 text-sm text-muted-foreground">Deep dive into your campaign performance.</p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => (
          <MetricCard key={item[0]} label={item[0] as string} value={item[1] as string} change={item[2] as string} Icon={item[3] as any} tone={item[4] as any} />
        ))}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Buyer Intent Distribution</h2>
            <div className="flex gap-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-500" />Hot</span>
              <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-orange-400" />Warm</span>
              <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-400" />Cold</span>
            </div>
          </div>
          
          <div className="relative flex h-8 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${hotPct}%` }} />
            <div className="h-full bg-orange-400 transition-all duration-1000" style={{ width: `${warmPct}%` }} />
            <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${coldPct}%` }} />
            {totalLeadsWithIntent === 0 && <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">No data available</div>}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-500">{data.hot_leads}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Hot Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">{data.warm_leads}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Warm Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{data.cold_leads}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Cold Leads</p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Call Direction</h2>
          </div>

          <div className="flex h-[130px] items-center justify-center gap-12">
            <div className="relative flex flex-col items-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-violet-100">
                <svg className="absolute inset-0 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-violet-500 transition-all duration-1000" strokeDasharray={`${inboundPct * 2.89} 289`} />
                </svg>
                <div className="flex flex-col items-center">
                  <ArrowDownLeft size={20} className="text-violet-500" />
                  <span className="mt-1 font-bold">{Math.round(inboundPct)}%</span>
                </div>
              </div>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Inbound</p>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-100">
                <svg className="absolute inset-0 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-emerald-500 transition-all duration-1000" strokeDasharray={`${outboundPct * 2.89} 289`} />
                </svg>
                <div className="flex flex-col items-center">
                  <ArrowUpRight size={20} className="text-emerald-500" />
                  <span className="mt-1 font-bold">{Math.round(outboundPct)}%</span>
                </div>
              </div>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Outbound</p>
            </div>
          </div>
        </article>
      </div>
    </AppLayout>
  )
}
