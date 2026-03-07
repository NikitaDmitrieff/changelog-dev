import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Write Release Notes: Templates + Examples (2026) | Changelog.dev',
  description:
    'Learn how to write release notes that your users actually read. Includes templates, real examples, and a simple framework for turning commits into clear customer updates.',
  openGraph: {
    title: 'How to Write Release Notes: Templates + Examples (2026)',
    description:
      'Templates, examples, and a simple framework for turning commits into clear customer-facing release notes.',
    type: 'article',
    url: 'https://www.changelogdev.com/blog/how-to-write-release-notes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Write Release Notes: Templates + Examples (2026)',
    description:
      'Templates, examples, and a simple framework for turning commits into clear customer-facing release notes.',
  },
}

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-white hover:text-zinc-300 transition-colors">
            changelog.dev
          </Link>
          <Link
            href="/login"
            className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        {/* Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">
              Guide
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <time className="text-zinc-600 text-xs">March 2026</time>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-zinc-600 text-xs">10 min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            How to Write Release Notes: Templates + Examples (2026)
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Most release notes are unreadable. Here is a practical framework for writing ones your customers will actually open — with copy-paste templates and real-world examples.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-white prose-a:text-indigo-400 prose-li:text-zinc-400">

          <h2>Why most release notes fail</h2>
          <p>
            Open any GitHub Releases page and you will see the same thing: a wall of commit hashes, technical jargon, and version numbers that mean nothing to your customers.
          </p>
          <p>
            That is because release notes are usually written by engineers, for engineers, right after a sprint ends — when everyone is already thinking about the next one. The result is documentation, not communication.
          </p>
          <p>
            Good release notes do one thing: they tell your customer what changed about their experience and why it matters to them. Everything else is noise.
          </p>

          <h2>The anatomy of a good release note</h2>
          <p>Every effective release note has four parts:</p>
          <ol>
            <li>
              <strong>A plain-language headline.</strong> Written for the person using your product, not the person who built it.
            </li>
            <li>
              <strong>A one-to-two sentence description.</strong> What changed, what it means for them, and optionally what prompted it.
            </li>
            <li>
              <strong>A type tag.</strong> New feature, improvement, or bug fix. This lets users scan for what they care about.
            </li>
            <li>
              <strong>A date.</strong> Timestamps build trust. They show you ship consistently.
            </li>
          </ol>
          <p>
            That is it. Screenshots and GIFs are nice if you have them. They are not required.
          </p>

          <h2>Release notes template: three formats</h2>
          <p>Copy and adapt these based on what you shipped.</p>

          <h3>Template 1: New feature</h3>
          <div className="not-prose rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 my-6 font-mono text-sm leading-relaxed">
            <div className="text-zinc-300 font-semibold mb-2">[Feature name in plain English]</div>
            <div className="text-zinc-500 mt-1">
              You can now [do X]. [One sentence on why this matters — what problem it solves or what it enables]. [Optional: how to find/use it.]
            </div>
            <div className="mt-3 flex gap-2">
              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">New feature</span>
            </div>
          </div>

          <h3>Template 2: Improvement</h3>
          <div className="not-prose rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 my-6 font-mono text-sm leading-relaxed">
            <div className="text-zinc-300 font-semibold mb-2">[What got better] — [how much better]</div>
            <div className="text-zinc-500 mt-1">
              [Specific part of the product] is now [faster/easier/more reliable]. [One sentence on what changed under the hood, in plain language.] [Optional: who asked for this.]
            </div>
            <div className="mt-3 flex gap-2">
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">Improvement</span>
            </div>
          </div>

          <h3>Template 3: Bug fix</h3>
          <div className="not-prose rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 my-6 font-mono text-sm leading-relaxed">
            <div className="text-zinc-300 font-semibold mb-2">Fixed: [what was broken, in user terms]</div>
            <div className="text-zinc-500 mt-1">
              [Describe the bug without jargon — what the user would have seen.] This is now fixed. [Optional: thank the user who reported it.]
            </div>
            <div className="mt-3 flex gap-2">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Bug fix</span>
            </div>
          </div>

          <h2>Real-world examples: bad vs. good</h2>
          <p>
            Here is the same change written two ways.
          </p>

          <h3>Example 1: Performance improvement</h3>
          <p>
            <strong>Bad (engineer-written):</strong><br />
            <em>&ldquo;Refactored database query layer to use connection pooling and added Redis caching for frequently accessed endpoints. Reduced N+1 queries in dashboard view.&rdquo;</em>
          </p>
          <p>
            <strong>Good (customer-facing):</strong><br />
            <em>&ldquo;Dashboard loads 3x faster — The main dashboard now loads significantly faster, especially when you have a large number of entries. We optimized how we fetch your data in the background.&rdquo;</em>
          </p>

          <h3>Example 2: New feature</h3>
          <p>
            <strong>Bad:</strong><br />
            <em>&ldquo;Added webhook support for changelog.published and entry.created events with configurable retry logic.&rdquo;</em>
          </p>
          <p>
            <strong>Good:</strong><br />
            <em>&ldquo;Webhooks — You can now get notified in real time whenever you publish a changelog entry. Connect to Slack, Zapier, or your own backend. Find it under Settings &rarr; Integrations.&rdquo;</em>
          </p>

          <h3>Example 3: Bug fix</h3>
          <p>
            <strong>Bad:</strong><br />
            <em>&ldquo;Fixed null pointer exception in OAuth callback handler for Google SSO flow.&rdquo;</em>
          </p>
          <p>
            <strong>Good:</strong><br />
            <em>&ldquo;Fixed: Sign in with Google sometimes failed on first attempt — Some users were seeing an error when signing in with Google. This is now resolved. If you had trouble logging in, please try again.&rdquo;</em>
          </p>

          <h2>What to include — and what to skip</h2>
          <p>
            <strong>Include:</strong>
          </p>
          <ul>
            <li>Anything that changes how a user interacts with the product</li>
            <li>Bug fixes for issues users have reported or experienced</li>
            <li>Performance improvements that are noticeable</li>
            <li>New integrations or API changes that affect developers using your product</li>
          </ul>
          <p>
            <strong>Skip:</strong>
          </p>
          <ul>
            <li>Internal refactors with no user-facing effect</li>
            <li>Dependency upgrades (unless they fix a security issue)</li>
            <li>Infrastructure changes that do not affect the product experience</li>
            <li>Changes that are not yet visible to users (unreleased features)</li>
          </ul>

          <h2>How long should release notes be?</h2>
          <p>
            For a minor release (a few bug fixes and tweaks): one to three entries, each two to four sentences.
          </p>
          <p>
            For a major release (new features, significant changes): group entries by type. Lead with the most exciting thing. Keep each entry under five sentences.
          </p>
          <p>
            The best release notes you can read in two minutes and still feel informed. If yours take longer, edit ruthlessly.
          </p>

          <h2>When to publish</h2>
          <p>
            The right cadence depends on your shipping pace:
          </p>
          <ul>
            <li>
              <strong>Weekly shipping:</strong> Publish weekly or bi-weekly. Batch small changes.
            </li>
            <li>
              <strong>Monthly shipping:</strong> Monthly release notes are the sweet spot for most early-stage SaaS products. Enough to show momentum, not so frequent that you run out of things to say.
            </li>
            <li>
              <strong>Feature-driven releases:</strong> Publish when a significant feature ships, regardless of calendar. Do not wait for the end of the month if you just shipped something big.
            </li>
          </ul>
          <p>
            Whatever cadence you choose: be consistent. A changelog that stops updating is worse than no changelog. It signals the product is abandoned.
          </p>

          <h2>The AI shortcut: commit messages to release notes</h2>
          <p>
            If you commit your code with descriptive messages (and you should), the raw material for your release notes already exists. The translation from &ldquo;fix(auth): handle null user on OAuth callback&rdquo; to &ldquo;Fixed: Sign in with Google sometimes failed&rdquo; is a mechanical step that AI handles well.
          </p>
          <p>
            The workflow: pipe your commits to an LLM with a prompt like &ldquo;rewrite these commit messages as customer-facing release notes in plain language, grouped by type.&rdquo; Review the draft. Edit for tone and accuracy. Publish.
          </p>
          <p>
            This removes the blank-page problem. You go from dreading release notes to spending five minutes on editing rather than thirty minutes on writing.{' '}
            <Link href="/">Changelog.dev</Link> does this automatically — it connects to your GitHub repo, reads recent commits, and generates a draft that you can edit and publish in one click.
          </p>

          <h2>The one rule</h2>
          <p>
            Write for the person who uses your product, not the person who built it. Read each entry and ask: would my least technical customer understand this? If not, rewrite it until they would.
          </p>
          <p>
            That is the whole framework.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-indigo-500/20 bg-indigo-950/10 p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Skip the blank page</h3>
          <p className="text-zinc-500 text-sm mb-6">
            Connect GitHub, let AI draft from your commits, publish in minutes. Free tier — no credit card.
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Get started free →
          </Link>
        </div>

        {/* Related posts */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-4">Related</p>
          <div className="space-y-3">
            <Link href="/blog/saas-product-updates" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                How to Notify Customers About Product Updates (Email Templates + Examples) →
              </span>
            </Link>
            <Link href="/blog/why-your-saas-needs-a-changelog" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                Why Your SaaS Needs a Changelog (And How to Write One) →
              </span>
            </Link>
            <Link href="/blog/best-changelog-tools-compared" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                Best Changelog Tools for SaaS in 2026 →
              </span>
            </Link>
            <Link href="/blog/changelog-best-practices" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                Changelog Best Practices: How to Write a Changelog Users Actually Read →
              </span>
            </Link>
          </div>
        </div>

        {/* Back */}
        <div className="mt-8">
          <Link href="/blog" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
            ← All articles
          </Link>
        </div>
      </article>
    </div>
  )
}
