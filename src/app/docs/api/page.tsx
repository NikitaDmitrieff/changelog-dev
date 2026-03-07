import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'API Documentation — Changelog.dev',
  description:
    'Changelog.dev REST API reference. Create and list changelog entries programmatically. Integrate with CI/CD, GitHub Actions, and the CLI.',
  openGraph: {
    title: 'API Documentation — Changelog.dev',
    description:
      'Changelog.dev REST API reference. Create and list changelog entries programmatically.',
    type: 'website',
    url: 'https://www.changelogdev.com/docs/api',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Documentation — Changelog.dev',
    description:
      'Changelog.dev REST API reference. Create and list changelog entries programmatically.',
  },
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            &larr; Back to changelog.dev
          </Link>
          <Link
            href="/login"
            className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">
            Reference
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mt-3 mb-4">
            API Documentation
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Automate your changelog with the Changelog.dev REST API. Push entries from CI/CD, scripts, or anything that speaks HTTP.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-16 border border-white/[0.06] rounded-lg p-6 bg-zinc-950">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
            On this page
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#authentication" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Authentication
              </a>
            </li>
            <li>
              <a href="#post-entries" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                POST /api/v1/entries
              </a>
            </li>
            <li>
              <a href="#get-entries" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                GET /api/v1/entries
              </a>
            </li>
            <li>
              <a href="#cli" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                CLI
              </a>
            </li>
            <li>
              <a href="#github-action" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                GitHub Action
              </a>
            </li>
            <li>
              <a href="#error-codes" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Error Codes
              </a>
            </li>
          </ul>
        </div>

        {/* Authentication */}
        <section id="authentication" className="mb-16">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-indigo-400 mr-2">#</span>Authentication
          </h2>
          <div className="h-px bg-white/[0.06] mb-6" />
          <p className="text-zinc-400 leading-relaxed mb-4">
            Generate an API key in <strong className="text-white">Dashboard &gt; Settings</strong>. All requests must include the key in the <code className="text-sm bg-zinc-950 border border-white/[0.06] rounded px-1.5 py-0.5 text-indigo-300">Authorization</code> header.
          </p>
          <pre className="bg-zinc-950 border border-white/[0.06] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="text-zinc-300">Authorization: Bearer cldev_abc123...</code>
          </pre>
          <p className="text-zinc-500 text-sm mt-4">
            Rate limit: <strong className="text-zinc-300">60 requests/minute</strong> per API key. Exceeding this returns a <code className="text-sm bg-zinc-950 border border-white/[0.06] rounded px-1.5 py-0.5 text-zinc-400">429</code> status.
          </p>
        </section>

        {/* POST /api/v1/entries */}
        <section id="post-entries" className="mb-16">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-indigo-400 mr-2">#</span>
            <span className="font-mono text-emerald-400 text-lg mr-2">POST</span>
            /api/v1/entries
          </h2>
          <div className="h-px bg-white/[0.06] mb-6" />
          <p className="text-zinc-400 leading-relaxed mb-6">
            Create a changelog entry.
          </p>

          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
            Request body (JSON)
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Field</th>
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Type</th>
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Required</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-indigo-300">title</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4 text-emerald-400">yes</td>
                  <td className="py-2 text-zinc-400">Entry title (max 200 chars)</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-indigo-300">content</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4 text-emerald-400">yes</td>
                  <td className="py-2 text-zinc-400">Entry content (Markdown)</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-indigo-300">version</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4 text-zinc-500">no</td>
                  <td className="py-2 text-zinc-400">Version tag (e.g. &quot;v2.1.0&quot;)</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-indigo-300">tags</td>
                  <td className="py-2 pr-4">string[]</td>
                  <td className="py-2 pr-4 text-zinc-500">no</td>
                  <td className="py-2 text-zinc-400">Entry tags (e.g. [&quot;feature&quot;, &quot;bugfix&quot;])</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-indigo-300">is_published</td>
                  <td className="py-2 pr-4">boolean</td>
                  <td className="py-2 pr-4 text-zinc-500">no</td>
                  <td className="py-2 text-zinc-400">Publish immediately (default: false)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
            Example
          </h3>
          <pre className="bg-zinc-950 border border-white/[0.06] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed mb-4">
            <code className="text-zinc-300">{`curl -X POST https://www.changelogdev.com/api/v1/entries \\
  -H "Authorization: Bearer cldev_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "v2.1 Release",
    "content": "New dashboard",
    "tags": ["feature"],
    "is_published": true
  }'`}</code>
          </pre>

          <p className="text-zinc-500 text-sm">
            Response: <code className="text-sm bg-zinc-950 border border-white/[0.06] rounded px-1.5 py-0.5 text-emerald-400">201</code> with the created entry object.
          </p>
        </section>

        {/* GET /api/v1/entries */}
        <section id="get-entries" className="mb-16">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-indigo-400 mr-2">#</span>
            <span className="font-mono text-sky-400 text-lg mr-2">GET</span>
            /api/v1/entries
          </h2>
          <div className="h-px bg-white/[0.06] mb-6" />
          <p className="text-zinc-400 leading-relaxed mb-6">
            List changelog entries.
          </p>

          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
            Query parameters
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Param</th>
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Type</th>
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Default</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-indigo-300">limit</td>
                  <td className="py-2 pr-4">number</td>
                  <td className="py-2 pr-4 text-zinc-500">50</td>
                  <td className="py-2 text-zinc-400">Max entries to return (max 100)</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-indigo-300">offset</td>
                  <td className="py-2 pr-4">number</td>
                  <td className="py-2 pr-4 text-zinc-500">0</td>
                  <td className="py-2 text-zinc-400">Pagination offset</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-indigo-300">status</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4 text-zinc-500">all</td>
                  <td className="py-2 text-zinc-400">Filter: &quot;published&quot;, &quot;draft&quot;, or omit for all</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
            Example
          </h3>
          <pre className="bg-zinc-950 border border-white/[0.06] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed mb-4">
            <code className="text-zinc-300">{`curl https://www.changelogdev.com/api/v1/entries?status=published&limit=10 \\
  -H "Authorization: Bearer cldev_abc123"`}</code>
          </pre>

          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
            Response
          </h3>
          <pre className="bg-zinc-950 border border-white/[0.06] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="text-zinc-300">{`{
  "entries": [...],
  "total": 42,
  "limit": 10,
  "offset": 0
}`}</code>
          </pre>
        </section>

        {/* CLI */}
        <section id="cli" className="mb-16">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-indigo-400 mr-2">#</span>CLI
          </h2>
          <div className="h-px bg-white/[0.06] mb-6" />
          <p className="text-zinc-400 leading-relaxed mb-6">
            Push changelog entries straight from your terminal.
          </p>
          <pre className="bg-zinc-950 border border-white/[0.06] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="text-zinc-300">{`npm install -g changelogdev-cli

# Push a new entry
changelogdev-cli push "v2.1" "New dashboard" --api-key cldev_abc123

# List entries
changelogdev-cli list --status published --api-key cldev_abc123`}</code>
          </pre>
        </section>

        {/* GitHub Action */}
        <section id="github-action" className="mb-16">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-indigo-400 mr-2">#</span>GitHub Action
          </h2>
          <div className="h-px bg-white/[0.06] mb-6" />
          <p className="text-zinc-400 leading-relaxed mb-6">
            Automatically push a changelog entry on every release.
          </p>
          <pre className="bg-zinc-950 border border-white/[0.06] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
            <code className="text-zinc-300">{`- uses: NikitaDmitrieff/changelog-action@v1
  with:
    api-key: \${{ secrets.CHANGELOG_DEV_API_KEY }}
    push-title: "v\${{ github.ref_name }}"
    push-published: true
  env:
    GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`}</code>
          </pre>
        </section>

        {/* Error Codes */}
        <section id="error-codes" className="mb-16">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-indigo-400 mr-2">#</span>Error Codes
          </h2>
          <div className="h-px bg-white/[0.06] mb-6" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Status</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Meaning</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-emerald-400">201</td>
                  <td className="py-2 text-zinc-400">Created successfully</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-amber-400">400</td>
                  <td className="py-2 text-zinc-400">Bad request (validation error)</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-red-400">401</td>
                  <td className="py-2 text-zinc-400">Invalid or missing API key</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-amber-400">429</td>
                  <td className="py-2 text-zinc-400">Rate limit exceeded</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 pr-4 font-mono text-red-400">500</td>
                  <td className="py-2 text-zinc-400">Internal server error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="border border-white/[0.06] rounded-lg p-8 text-center bg-zinc-950">
          <h3 className="text-lg font-semibold mb-2">Ready to automate your changelog?</h3>
          <p className="text-zinc-400 text-sm mb-6">
            Create your free account, grab an API key, and start pushing entries in under a minute.
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Get started free
          </Link>
        </div>
      </main>
    </div>
  )
}
