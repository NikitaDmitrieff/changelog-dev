import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Introducing the Open-Source Changelog Widget — Embed "What\'s New" Anywhere | Changelog.dev',
  description:
    'A free, zero-dependency Web Component that adds a changelog bell to any website. Under 8KB gzipped. Works with React, Vue, vanilla HTML. MIT licensed.',
  openGraph: {
    title: 'Introducing the Open-Source Changelog Widget',
    description:
      'A free, zero-dependency Web Component that adds a changelog bell to any website. Under 8KB gzipped.',
    type: 'article',
    url: 'https://www.changelogdev.com/blog/open-source-changelog-widget',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Introducing the Open-Source Changelog Widget',
    description:
      'A free, zero-dependency Web Component that adds a changelog bell to any website. Under 8KB gzipped.',
  },
}

export default function OpenSourceWidgetPost() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-white hover:text-zinc-300 transition-colors">
            changelog.dev
          </Link>
          <Link
            href="/login"
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">
              Open Source
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <time className="text-zinc-600 text-xs">March 2026</time>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-zinc-600 text-xs">4 min read</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Introducing the Open-Source Changelog Widget
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            A free, embeddable Web Component that adds a &quot;What&apos;s New&quot; bell to any website.
            Two lines of HTML. Zero dependencies. MIT licensed.
          </p>
        </div>

        <div className="prose-custom space-y-6 text-zinc-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The problem</h2>
          <p>
            You ship features every week, but your customers don&apos;t know. GitHub Releases
            are invisible to end users. Blog posts take too long to write. In-app notification
            tools cost $35–$100/month before you have paying customers.
          </p>
          <p>
            We built the changelog widget to solve this. It&apos;s a tiny Web Component that shows
            a bell icon on your site. When users click it, they see your latest updates. If there
            are unread entries, a badge appears. That&apos;s it.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">How it works</h2>
          <p>Two lines. No build step required:</p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4">
            <div className="text-emerald-400">&lt;script src=&quot;https://unpkg.com/changelogdev-widget&quot;&gt;&lt;/script&gt;</div>
            <div className="text-zinc-400">&lt;changelog-widget project-id=&quot;my-app&quot; /&gt;</div>
          </div>
          <p>
            The widget fetches entries from your Changelog.dev project via our public API. It renders
            inside Shadow DOM, so your page styles never interfere — and the widget styles never leak out.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Or install from npm</h2>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4">
            <div className="text-zinc-300">npm install changelogdev-widget</div>
          </div>
          <p>Then import it in your React, Vue, Svelte, or vanilla app:</p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4">
            <div className="text-zinc-400">import &apos;changelogdev-widget&apos;</div>
            <div className="mt-1 text-zinc-600">// Use anywhere in your JSX/HTML</div>
            <div className="text-emerald-400">&lt;changelog-widget project-id=&quot;my-app&quot; theme=&quot;dark&quot; /&gt;</div>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Features</h2>
          <ul className="list-none space-y-2 text-zinc-400">
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">Zero dependencies</strong> — no React, no Vue, no framework required. Pure Web Components.</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">Shadow DOM isolation</strong> — styles never leak in or out. Works on any page.</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">Unread badge</strong> — tracks which entries the user has seen via localStorage.</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">Theme support</strong> — light, dark, or auto (follows system preference).</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">Under 8KB gzipped</strong> — tiny footprint, no impact on page load.</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">Keyboard accessible</strong> — Escape to close, focusable trigger button.</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">Mock data fallback</strong> — works offline or without an API for demos.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Why open source?</h2>
          <p>
            We want every SaaS product to have a changelog. The widget is the top of the funnel —
            it&apos;s genuinely useful on its own, and if you want hosted changelog pages, AI-generated
            entries, email subscribers, and a dashboard, that&apos;s what{' '}
            <Link href="/" className="text-zinc-400 hover:text-white">Changelog.dev</Link>{' '}
            is for.
          </p>
          <p>
            The widget is MIT licensed. Fork it, extend it, self-host it. We don&apos;t mind.
            If it helps you ship a better product, that&apos;s the goal.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Configuration</h2>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Attribute</th>
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Default</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-zinc-500">
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">project-id</td>
                  <td className="py-2 pr-4">(required)</td>
                  <td className="py-2">Your Changelog.dev project slug</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">theme</td>
                  <td className="py-2 pr-4">auto</td>
                  <td className="py-2">light, dark, or auto</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">position</td>
                  <td className="py-2 pr-4">bottom-right</td>
                  <td className="py-2">Where the bell appears</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">accent-color</td>
                  <td className="py-2 pr-4">#6366f1</td>
                  <td className="py-2">Button color</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Get started</h2>
          <div className="flex flex-wrap gap-3 my-4">
            <a
              href="https://www.npmjs.com/package/changelogdev-widget"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/[0.12] hover:border-white/[0.25] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-all text-sm"
            >
              npm ↗
            </a>
            <a
              href="https://github.com/NikitaDmitrieff/changelog-widget"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/[0.12] hover:border-white/[0.25] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-all text-sm"
            >
              GitHub ↗
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Create a changelog →
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link href="/blog" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
            ← All articles
          </Link>
        </div>
      </article>
    </div>
  )
}
