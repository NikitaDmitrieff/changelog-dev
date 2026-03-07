'use client'

import { useMemo } from 'react'
import type { Entry } from '@/lib/supabase/types'

interface SubscriberPoint {
  subscribed_at: string
}

interface Props {
  entries: Entry[]
  subscribers: SubscriberPoint[]
}

function groupByDay(dates: string[], days: number): { label: string; count: number }[] {
  const now = new Date()
  const buckets: { label: string; date: string; count: number }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    buckets.push({ label, date: key, count: 0 })
  }

  for (const dateStr of dates) {
    const key = dateStr.slice(0, 10)
    const bucket = buckets.find((b) => b.date === key)
    if (bucket) bucket.count++
  }

  return buckets.map(({ label, count }) => ({ label, count }))
}

function BarChart({
  data,
  label,
  emptyMessage,
  color = 'bg-indigo-500',
}: {
  data: { label: string; count: number }[]
  label: string
  emptyMessage: string
  color?: string
}) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const total = data.reduce((sum, d) => sum + d.count, 0)

  if (total === 0) {
    return (
      <div>
        <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">{label}</div>
        <div className="text-sm text-white/30 py-6 text-center">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-xs font-medium text-white/40 uppercase tracking-widest">{label}</div>
        <div className="text-xs text-white/30">{total} total</div>
      </div>
      <div className="flex items-end gap-[2px] h-20">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className={`w-full rounded-sm ${color} transition-opacity group-hover:opacity-100 ${d.count > 0 ? 'opacity-70' : 'opacity-20'}`}
              style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 8 : 2)}%` }}
            />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/10 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
              {d.label}: {d.count}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-white/20">{data[0]?.label}</span>
        <span className="text-[10px] text-white/20">{data[data.length - 1]?.label}</span>
      </div>
    </div>
  )
}

function TopEntriesChart({ entries }: { entries: Entry[] }) {
  const top = useMemo(
    () =>
      entries
        .filter((e) => e.is_published && e.view_count > 0)
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, 5),
    [entries]
  )

  const max = Math.max(...top.map((e) => e.view_count), 1)
  const totalViews = entries.reduce((sum, e) => sum + e.view_count, 0)

  if (top.length === 0) {
    return (
      <div>
        <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
          Top entries by views
        </div>
        <div className="text-sm text-white/30 py-6 text-center">No views yet</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-xs font-medium text-white/40 uppercase tracking-widest">
          Top entries by views
        </div>
        <div className="text-xs text-white/30">{totalViews} total views</div>
      </div>
      <div className="space-y-2">
        {top.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/70 truncate">{entry.title}</div>
              <div className="mt-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full opacity-70"
                  style={{ width: `${(entry.view_count / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-white/40 tabular-nums w-10 text-right">{entry.view_count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsPanel({ entries, subscribers }: Props) {
  const subscriberDays = useMemo(
    () => groupByDay(subscribers.map((s) => s.subscribed_at), 30),
    [subscribers]
  )

  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
        Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <TopEntriesChart entries={entries} />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <BarChart
            data={subscriberDays}
            label="Subscriber growth (30d)"
            emptyMessage="No new subscribers yet"
            color="bg-green-500"
          />
        </div>
      </div>
    </div>
  )
}
