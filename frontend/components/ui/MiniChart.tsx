import { useState } from 'react'

interface ChartData {
  date: string
  calls_made: number
  connected_calls: number
}

export function MiniChart({ data }: { data?: ChartData[] }) {
  const [hovered, setHovered] = useState<ChartData | null>(null)

  if (!data || data.length === 0) {
    return <div className="mt-5 h-[188px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>
  }

  // Calculate the maximum value to scale heights properly
  const maxCalls = Math.max(...data.map(d => d.calls_made), 1) // Avoid division by zero

  return (
    <div className="relative mt-5 h-[188px]">
      <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-muted-foreground pointer-events-none">
        <span>{maxCalls}</span>
        <span>{Math.round(maxCalls * 0.66)}</span>
        <span>{Math.round(maxCalls * 0.33)}</span>
        <span>0</span>
      </div>
      <div className="ml-7 flex h-[168px] items-end gap-3 border-b border-l border-border px-3 pb-0 pt-3 relative">
        {hovered && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md border border-border whitespace-nowrap pointer-events-none transition-all">
            <span className="font-semibold">{hovered.date}:</span> {hovered.calls_made} made, {hovered.connected_calls} connected
          </div>
        )}
        {data.map((item, i) => {
          const heightMade = (item.calls_made / maxCalls) * 100
          const heightConnected = (item.connected_calls / maxCalls) * 100
          
          return (
            <div 
              key={i} 
              className="group flex h-full flex-1 items-end relative cursor-pointer"
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-full rounded-t-sm bg-primary/25 transition-all group-hover:bg-primary/40 relative" style={{ height: `${heightMade}%` }}>
                <div className="absolute bottom-0 w-full rounded-t-sm bg-primary transition-all group-hover:bg-primary/80" style={{ height: `${heightConnected > 0 ? (item.connected_calls / item.calls_made) * 100 : 0}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="ml-7 mt-2 flex justify-between text-[10px] text-muted-foreground">
        {data.filter((_, i) => i % (data.length > 7 ? 3 : 1) === 0).map((item, i) => (
          <span key={i}>{item.date}</span>
        ))}
      </div>
    </div>
  )
}
