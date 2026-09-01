'use client'

import AppLayout from '@/components/layout/AppLayout'
import { Users } from 'lucide-react'

export default function TeamPage() {
  return (
    <AppLayout title="Team">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-primary">Management / Team</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.06em] sm:text-[34px]">Team Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your workspace members and roles.</p>
        </div>
      </section>

      <section className="mt-6 flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-card p-5 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <Users size={32} />
        </div>
        <h2 className="text-xl font-bold">Team Management</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Invite members and configure role-based access control here.
        </p>
      </section>
    </AppLayout>
  )
}
