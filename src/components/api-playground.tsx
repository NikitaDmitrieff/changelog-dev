'use client'

import { useState } from 'react'

type Tab = 'post' | 'get'
type RequestState = 'idle' | 'loading' | 'done'

const POST_DEFAULT_BODY = `{
  "title": "v2.1 Release",
  "content": "New dashboard with analytics",
  "tags": ["feature"],
  "is_published": true
}`

const POST_CURL = `curl -X POST https://www.changelogdev.com/api/v1/entries \\
  -H "Authorization: Bearer cldev_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "v2.1 Release",
    "content": "New dashboard with analytics",
    "tags": ["feature"],
    "is_published": true
  }'`

const GET_CURL = `curl https://www.changelogdev.com/api/v1/entries?status=published&limit=10 \\
  -H "Authorization: Bearer cldev_abc123"`

const POST_RESPONSE = JSON.stringify(
  {
    id: 'entry_9f3a7c2e',
    project_id: 'proj_demo1234',
    title: 'v2.1 Release',
    content: 'New dashboard with analytics',
    version: null,
    tags: ['feature'],
    is_published: true,
    published_at: '2026-03-07T14:32:00.000Z',
    created_at: '2026-03-07T14:32:00.000Z',
    updated_at: '2026-03-07T14:32:00.000Z',
  },
  null,
  2
)

const GET_RESPONSE = JSON.stringify(
  {
    entries: [
      {
        id: 'entry_9f3a7c2e',
        title: 'v2.1 Release',
        content: 'New dashboard with analytics',
        tags: ['feature'],
        is_published: true,
        published_at: '2026-03-07T14:32:00.000Z',
        created_at: '2026-03-07T14:32:00.000Z',
      },
      {
        id: 'entry_4b1d8e5f',
        title: 'Bug fixes for auth flow',
        content: 'Fixed token refresh and session timeout issues',
        tags: ['bugfix'],
        is_published: true,
        published_at: '2026-03-06T09:15:00.000Z',
        created_at: '2026-03-06T09:15:00.000Z',
      },
      {
        id: 'entry_7e2c0a9d',
        title: 'Dark mode support',
        content: 'Added dark mode across all pages',
        tags: ['feature', 'ui'],
        is_published: true,
        published_at: '2026-03-05T16:45:00.000Z',
        created_at: '2026-03-05T16:45:00.000Z',
      },
    ],
    total: 42,
    limit: 10,
    offset: 0,
  },
  null,
  2
)

export default function ApiPlayground() {
  const [activeTab, setActiveTab] = useState<Tab>('post')
  const [postBody, setPostBody] = useState(POST_DEFAULT_BODY)
  const [requestState, setRequestState] = useState<RequestState>('idle')
  const [response, setResponse] = useState<string | null>(null)

  function handleSend() {
    setRequestState('loading')
    setResponse(null)
    setTimeout(() => {
      setResponse(activeTab === 'post' ? POST_RESPONSE : GET_RESPONSE)
      setRequestState('done')
    }, 500)
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    setRequestState('idle')
    setResponse(null)
  }

  const statusCode = activeTab === 'post' ? '201 Created' : '200 OK'
  const statusColor = activeTab === 'post' ? 'text-emerald-400' : 'text-sky-400'

  return (
    <section id="try-it" className="mb-16">
      <h2 className="text-2xl font-bold mb-2">
        <span className="text-indigo-400 mr-2">#</span>Try it
      </h2>
      <div className="h-px bg-white/[0.06] mb-6" />
      <p className="text-zinc-400 leading-relaxed mb-6">
        Test the API right here -- no account needed. Responses are simulated with sample data.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => handleTabChange('post')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'post'
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
              : 'text-zinc-400 hover:text-zinc-300 border border-white/[0.06]'
          }`}
        >
          <span className="font-mono text-emerald-400 mr-1.5">POST</span>
          /api/v1/entries
        </button>
        <button
          onClick={() => handleTabChange('get')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'get'
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
              : 'text-zinc-400 hover:text-zinc-300 border border-white/[0.06]'
          }`}
        >
          <span className="font-mono text-sky-400 mr-1.5">GET</span>
          /api/v1/entries
        </button>
      </div>

      <div className="border border-white/[0.06] rounded-lg bg-zinc-950 overflow-hidden">
        {/* Curl command */}
        <div className="border-b border-white/[0.06] p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            curl
          </p>
          <pre className="text-sm leading-relaxed overflow-x-auto">
            <code className="text-zinc-300">
              {activeTab === 'post' ? POST_CURL : GET_CURL}
            </code>
          </pre>
        </div>

        {/* Body editor (POST only) */}
        {activeTab === 'post' && (
          <div className="border-b border-white/[0.06] p-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Request body
            </p>
            <textarea
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              spellCheck={false}
              className="w-full bg-black border border-white/[0.06] rounded-lg p-3 text-sm font-mono text-zinc-300 leading-relaxed resize-y min-h-[160px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>
        )}

        {/* Send button */}
        <div className="border-b border-white/[0.06] p-4">
          <button
            onClick={handleSend}
            disabled={requestState === 'loading'}
            className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {requestState === 'loading' ? 'Sending...' : 'Send request'}
          </button>
        </div>

        {/* Response */}
        {requestState !== 'idle' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Response
              </p>
              {requestState === 'done' && (
                <span className={`text-xs font-mono ${statusColor}`}>
                  {statusCode}
                </span>
              )}
            </div>
            {requestState === 'loading' ? (
              <div className="flex items-center gap-2 py-4">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <div
                  className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            ) : (
              <pre className="bg-black border border-white/[0.06] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-zinc-300">{response}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
