'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export default function MarkdownEditor({ value, onChange, placeholder, rows = 12 }: Props) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  return (
    <div>
      <div className="flex items-center gap-0 mb-1.5">
        <label className="text-sm text-white/60 mr-auto">
          Content <span className="text-red-400">*</span>
        </label>
        <button
          type="button"
          onClick={() => setTab('write')}
          className={`text-xs px-3 py-1 rounded-t-md transition-colors ${
            tab === 'write'
              ? 'bg-white/10 text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setTab('preview')}
          className={`text-xs px-3 py-1 rounded-t-md transition-colors ${
            tab === 'preview'
              ? 'bg-white/10 text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Preview
        </button>
      </div>
      {tab === 'write' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'Describe the changes. Markdown supported.'}
          required
          rows={rows}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none font-mono"
        />
      ) : (
        <div className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 min-h-[calc(theme(spacing.3)*2+theme(lineHeight.5)*12)] overflow-auto">
          {value.trim() ? (
            <div className="prose prose-invert prose-sm max-w-none text-white/70 prose-headings:text-white prose-strong:text-white prose-a:text-indigo-400 prose-code:text-indigo-300 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-white/30 text-sm">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  )
}
