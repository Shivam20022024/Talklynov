import { TrendingUp, type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  Icon: LucideIcon;
  tone: 'blue' | 'violet' | 'green' | 'orange';
}

export function MetricCard({ label, value, change, Icon, tone }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <span className={`metric-icon ${tone} h-10 w-10`}><Icon size={18} /></span>
      </div>
      <div className="mt-8 flex items-end justify-between">
        <p className="text-4xl font-bold tracking-[-0.04em]">{value}</p>
        <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
          <TrendingUp size={16} />{change}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">vs previous period</p>
    </article>
  );
}
