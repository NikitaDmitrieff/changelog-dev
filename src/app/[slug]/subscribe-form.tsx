'use client'

import { useState } from 'react'

interface Props {
  changelogId: string
}

export default function SubscribeForm({ changelogId }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changelog_id: changelogId, email }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
    } else {
      setSubscribed(true)
    }
    setLoading(false)
  }

  if (subscribed) {
    return (
      <div className="text-center py-8">
        <div className="font-semibold mb-1 text-white">Check your email</div>
        <p className="text-white/40 text-sm">
          We&apos;ve sent a confirmation link. Click it to start receiving updates.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h3 className="font-semibold mb-1">Stay in the loop</h3>
      <p className="text-white/40 text-sm mb-6">
        Get notified when new updates are published.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="disabled:opacity-50 bg-white text-black font-medium px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-colors text-sm whitespace-nowrap"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  )
}
