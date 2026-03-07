'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'

const CHORD_TIMEOUT = 1500

interface Shortcut {
  keys: string
  description: string
}

const SHORTCUTS: Shortcut[] = [
  { keys: 'n', description: 'New entry' },
  { keys: '/', description: 'Focus search / filter' },
  { keys: '?', description: 'Show keyboard shortcuts' },
  { keys: 'g then h', description: 'Go to dashboard home' },
  { keys: 'g then s', description: 'Go to settings' },
]

function isEditableTarget(e: KeyboardEvent): boolean {
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if ((e.target as HTMLElement)?.isContentEditable) return true
  return false
}

export function KeyboardShortcuts() {
  const router = useRouter()
  const params = useParams()
  const [showHelp, setShowHelp] = useState(false)
  const pendingChord = useRef<string | null>(null)
  const chordTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const changelogId = params?.id as string | undefined

  const clearChord = useCallback(() => {
    pendingChord.current = null
    if (chordTimer.current) {
      clearTimeout(chordTimer.current)
      chordTimer.current = null
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const key = e.key.toLowerCase()

      // Handle pending chord
      if (pendingChord.current === 'g') {
        clearChord()
        if (key === 'h') {
          e.preventDefault()
          router.push('/dashboard')
          return
        }
        if (key === 's' && changelogId) {
          e.preventDefault()
          router.push(`/dashboard/${changelogId}/settings`)
          return
        }
        // Unknown chord follow-up — ignore
        return
      }

      // Start chord
      if (key === 'g') {
        e.preventDefault()
        pendingChord.current = 'g'
        chordTimer.current = setTimeout(clearChord, CHORD_TIMEOUT)
        return
      }

      // Single-key shortcuts
      if (key === '?') {
        e.preventDefault()
        setShowHelp((v) => !v)
        return
      }

      if (key === 'n') {
        e.preventDefault()
        if (changelogId) {
          router.push(`/dashboard/${changelogId}/new-entry`)
        } else {
          router.push('/dashboard/new')
        }
        return
      }

      if (key === '/') {
        e.preventDefault()
        // Try to focus the first visible search input or filter button
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[type="text"][placeholder*="earch"]'
        )
        if (searchInput) {
          searchInput.focus()
          return
        }
        // Fallback: focus the first filter button group
        const filterGroup = document.querySelector<HTMLButtonElement>(
          '[role="group"] button'
        )
        if (filterGroup) {
          filterGroup.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router, changelogId, clearChord])

  // Close modal on Escape
  useEffect(() => {
    if (!showHelp) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowHelp(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [showHelp])

  if (!showHelp) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="bg-zinc-900 border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Keyboard shortcuts"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Keyboard Shortcuts</h2>
          <button
            onClick={() => setShowHelp(false)}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between text-sm">
              <span className="text-white/60">{s.description}</span>
              <div className="flex items-center gap-1.5">
                {s.keys.split(' then ').map((k, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-white/20 text-xs">then</span>}
                    <kbd className="bg-white/10 border border-white/20 text-white/80 px-2 py-0.5 rounded text-xs font-mono min-w-[24px] text-center">
                      {k}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-white/[0.08] text-xs text-white/30 text-center">
          Press <kbd className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded font-mono">Esc</kbd> to close
        </div>
      </div>
    </div>
  )
}
