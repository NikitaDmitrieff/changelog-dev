'use client'

import { useState, useRef, useEffect } from 'react'

export function ExportDropdown({ changelogId }: { changelogId: string }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  useEffect(() => {
    if (open && menuRef.current) {
      const first = menuRef.current.querySelector('a')
      first?.focus()
    }
  }, [open])

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    const items = menuRef.current?.querySelectorAll('a')
    if (!items) return
    const current = document.activeElement as HTMLElement
    const idx = Array.from(items).indexOf(current as HTMLAnchorElement)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(idx + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(idx - 1 + items.length) % items.length]?.focus()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        className="text-white/40 hover:text-white transition-colors text-sm border border-white/20 px-4 py-2.5 rounded-lg flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
      </button>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 top-full mt-1 bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-10 min-w-[140px]"
        >
          <a
            href={`/api/changelogs/${changelogId}/export`}
            download
            role="menuitem"
            tabIndex={0}
            className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 focus:text-white focus:bg-white/5 focus:outline-none rounded-t-lg transition-colors"
          >
            Markdown (.md)
          </a>
          <a
            href={`/api/changelogs/${changelogId}/export?format=json`}
            download
            role="menuitem"
            tabIndex={0}
            className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 focus:text-white focus:bg-white/5 focus:outline-none rounded-b-lg transition-colors"
          >
            JSON (.json)
          </a>
        </div>
      )}
    </div>
  )
}
