'use client'

import { useState, useEffect } from 'react'
import type { WebhookEvent } from '@/lib/supabase/types'

function statusBadge(status: string) {
  switch (status) {
    case 'processed':
      return 'bg-green-500/10 text-green-400'
    case 'error':
      return 'bg-red-500/10 text-red-400'
    case 'warning':
      return 'bg-amber-500/10 text-amber-400'
    default:
      return 'bg-white/10 text-white/40'
  }
}

export function WebhookEventsPanel() {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/webhook-events')
      .then((res) => res.json())
      .then((data) => setEvents(data.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
          Webhook Events
        </h2>
        <div className="text-white/30 text-sm">Loading...</div>
      </div>
    )
  }

  if (events.length === 0) return null

  const displayEvents = expanded ? events : events.slice(0, 5)

  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
        Webhook Events
      </h2>
      <div className="space-y-2">
        {displayEvents.map((event) => {
          const summary = event.summary as Record<string, unknown>
          return (
            <div
              key={event.id}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(event.status)}`}>
                  {event.status}
                </span>
                <span className="text-sm font-mono text-white/70">{event.event_type}</span>
                {typeof summary?.action === 'string' && (
                  <span className="text-xs text-white/30">{summary.action}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {event.error_message && (
                  <span className="text-xs text-red-400 max-w-[200px] truncate" title={event.error_message}>
                    {event.error_message}
                  </span>
                )}
                <span className="text-xs text-white/20">
                  {new Date(event.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      {events.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {expanded ? 'Show less' : `Show all ${events.length} events`}
        </button>
      )}
    </div>
  )
}
