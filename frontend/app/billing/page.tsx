'use client'

import AppLayout from '@/components/layout/AppLayout'
import { TrendingUp } from 'lucide-react'

export default function BillingPage() {
  return (
    <AppLayout title="Billing & Usage">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-primary">Management / Billing & Usage</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.06em] sm:text-[34px]">Billing & Usage</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your subscription and monitor API consumption.</p>
        </div>
      </section>

      <section className="mt-6 flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-card p-5 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <TrendingUp size={32} />
        </div>
        <h2 className="text-xl font-bold">Usage Dashboard</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Your current minute consumption and billing details will appear here.
        </p>
      </section>
    </AppLayout>
  )
}
