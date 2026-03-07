'use client'

import { useState } from 'react'

export function WaitlistForm({ source = 'landing', className = '' }: { source?: string; className?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    })
    const data = await res.json()

    if (res.ok) {
      setStatus('success')
      setMessage(data.message || "You're on the list!")
      setEmail('')
    } else {
      setStatus('error')
      setMessage(data.error || 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-2 text-white font-medium ${className}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/40 text-sm rounded-full px-4 py-3 flex-1 min-w-0 focus:outline-none focus:border-white/20"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-white hover:bg-zinc-200 disabled:opacity-60 text-black font-semibold px-6 py-3 rounded-full transition-colors text-sm whitespace-nowrap"
      >
        {status === 'loading' ? 'Joining...' : 'Get early access'}
      </button>
      {status === 'error' && (
        <span className="text-red-400 text-xs ml-1">{message}</span>
      )}
    </form>
  )
}
