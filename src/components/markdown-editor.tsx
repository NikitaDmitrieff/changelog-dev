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
        <label id="md-editor-label" className="text-sm text-white/60 mr-auto">
          Content <span className="text-red-400">*</span>
        </label>
        <div role="tablist" aria-label="Editor mode">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'write'}
            aria-controls="md-panel-write"
            id="md-tab-write"
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
            role="tab"
            aria-selected={tab === 'preview'}
            aria-controls="md-panel-preview"
            id="md-tab-preview"
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
      </div>
      {tab === 'write' ? (
        <textarea
          id="md-panel-write"
          role="tabpanel"
          aria-labelledby="md-tab-write"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'Describe the changes. Markdown supported.'}
          required
          rows={rows}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none font-mono"
        />
      ) : (
        <div id="md-panel-preview" role="tabpanel" aria-labelledby="md-tab-preview" className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 min-h-[calc(theme(spacing.3)*2+theme(lineHeight.5)*12)] overflow-auto">
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
