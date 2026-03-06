import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog Best Practices: How to Write a Changelog That Users Actually Read | Changelog.dev',
  description:
    'The definitive guide to changelog best practices — format, structure, writing style, and real examples. Learn how to write a changelog that builds trust and reduces churn.',
  openGraph: {
    title: 'Changelog Best Practices: How to Write a Changelog That Users Actually Read',
    description:
      'Format, structure, writing style, and real examples. Write a changelog that builds trust and reduces churn.',
    type: 'article',
    url: 'https://changelog-dev-production.up.railway.app/blog/changelog-best-practices',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog Best Practices: How to Write a Changelog That Users Actually Read',
    description:
      'Format, structure, writing style, and real examples. Write a changelog that builds trust and reduces churn.',
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
            <span className="text-zinc-600 text-xs">11 min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            Changelog Best Practices: How to Write a Changelog That Users Actually Read
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Most changelogs are written for developers, not users. They list what changed technically rather than what improved experientially. Here is how to write a changelog that actually does its job.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-white prose-a:text-indigo-400 prose-li:text-zinc-400">

          <h2>What a changelog is (and what it is not)</h2>
          <p>
            A changelog is a curated record of notable changes made to a product over time, written for the people who use it. That last part matters: written <em>for users</em>, not for engineers, not for compliance, not for posterity.
          </p>
          <p>
            A changelog is not:
          </p>
          <ul>
            <li>A git commit log (those are for engineers and contain too much noise)</li>
            <li>A list of every PR merged (same problem)</li>
            <li>A marketing document (it should be honest about bugs fixed, not just features added)</li>
            <li>A release notes PDF attached to an email (format from 2005, please stop)</li>
          </ul>
          <p>
            The mental model that unlocks good changelogs: <strong>you are writing a letter to a customer who has been using your product for six months and wants to know if anything changed that affects them</strong>. Every entry should pass that test.
          </p>

          <h2>The standard changelog format</h2>
          <p>
            The most widely adopted format is defined by <strong>Keep a Changelog</strong> (keepachangelog.com), which itself builds on semantic versioning. Even if you do not use semantic versioning publicly, the underlying structure is worth adopting.
          </p>

          <h3>Entry types</h3>
          <p>
            Each changelog entry should be categorized. The standard categories are:
          </p>

          <div className="not-prose rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 my-6 text-sm leading-relaxed">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-mono font-bold w-24 shrink-0">Added</span>
                <span className="text-zinc-400">New features and capabilities. Things the user could not do before.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-mono font-bold w-24 shrink-0">Changed</span>
                <span className="text-zinc-400">Changes to existing functionality. Things that work differently now.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-mono font-bold w-24 shrink-0">Deprecated</span>
                <span className="text-zinc-400">Features that will be removed in an upcoming release. Give users time to adapt.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-mono font-bold w-24 shrink-0">Removed</span>
                <span className="text-zinc-400">Features that have been removed. Be direct — do not bury this.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 font-mono font-bold w-24 shrink-0">Fixed</span>
                <span className="text-zinc-400">Bug fixes. Users who hit the bug need to know it is resolved.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-mono font-bold w-24 shrink-0">Security</span>
                <span className="text-zinc-400">Security patches. Always disclose these — hiding them damages trust more than the vulnerability.</span>
              </div>
            </div>
          </div>

          <h3>Date first, version second</h3>
          <p>
            For SaaS products, date-based changelogs work better than version-based ones. Your users do not know what version they are on — they just know the product changed. Dating entries by month or week gives them a mental anchor they can actually use.
          </p>
          <p>
            If you use both (common for products with an API), put the date first and the version in parentheses: <code>March 2026 (v4.2.0)</code>.
          </p>

          <h2>How to write individual entries</h2>
          <p>
            This is where most changelogs fail. The difference between a good entry and a bad one is almost always the perspective: engineering perspective vs. user perspective.
          </p>

          <h3>The before and after test</h3>
          <p>
            Look at these two ways of describing the same change:
          </p>

          <div className="not-prose space-y-4 my-6">
            <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4 text-sm">
              <div className="text-red-400 text-xs uppercase tracking-wider font-mono mb-2">Engineering perspective (bad)</div>
              <p className="text-zinc-400">Refactored query builder to use indexed joins, reducing p95 latency by 340ms on dashboard load path.</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-4 text-sm">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-mono mb-2">User perspective (good)</div>
              <p className="text-zinc-400">Dashboard loads 3x faster. The main overview page now loads in under a second for all account sizes.</p>
            </div>
          </div>

          <p>
            Same change. The first tells users what you did technically. The second tells users what improved in their experience. Write the second kind, always.
          </p>

          <h3>The one-sentence rule</h3>
          <p>
            Every entry should have at minimum one sentence that answers: <strong>what changed and why does it matter to the user?</strong> That sentence should stand alone without context.
          </p>
          <p>
            Good: <em>&ldquo;You can now export any report to CSV from the toolbar — useful for sharing data with stakeholders who do not have a Changelog.dev account.&rdquo;</em>
          </p>
          <p>
            Bad: <em>&ldquo;CSV export added.&rdquo;</em>
          </p>
          <p>
            The bad version is technically accurate. But it does not tell the user when to use it, who it is for, or why it was built. Two more sentences fixes all of that.
          </p>

          <h3>Write bug fixes as user wins</h3>
          <p>
            Bug fixes are undervalued in changelogs. A user who hit a bug, reported it, and then sees it fixed in the changelog feels heard. That feeling is worth more than the bug fix itself.
          </p>
          <p>
            Do not write: <em>&ldquo;Fixed null pointer exception in billing module.&rdquo;</em>
          </p>
          <p>
            Write: <em>&ldquo;Fixed a bug that caused the billing page to crash for accounts with more than 10 team members. If you saw an error there last week, it is resolved.&rdquo;</em>
          </p>
          <p>
            The second version acknowledges that some users experienced this. It closes the loop for them. It is the difference between a fix and a fix that users know about.
          </p>

          <h2>Changelog format examples</h2>
          <p>
            Here are three different changelog entry formats, from minimal to detailed. All three can work — the right one depends on your cadence and how much context each change requires.
          </p>

          <h3>Format 1: Minimal (weekly or daily updates)</h3>
          <div className="not-prose rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 my-6 text-sm leading-relaxed font-mono">
            <div className="text-zinc-500 text-xs uppercase tracking-wider mb-3 not-italic">Week of March 3, 2026</div>
            <div className="space-y-2 text-zinc-400">
              <div><span className="text-emerald-400">+</span> Added bulk select to the entries table</div>
              <div><span className="text-blue-400">~</span> Editor toolbar now stays visible when scrolling long entries</div>
              <div><span className="text-orange-400">✓</span> Fixed: markdown preview was ignoring code blocks</div>
            </div>
          </div>

          <h3>Format 2: Standard (monthly updates)</h3>
          <div className="not-prose rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 my-6 text-sm leading-relaxed">
            <div className="text-zinc-500 text-xs uppercase tracking-wider mb-3 font-mono">March 2026</div>
            <div className="space-y-4 text-zinc-400">
              <div>
                <div className="text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">Added</div>
                <ul className="space-y-2 list-none pl-0">
                  <li><strong className="text-zinc-300">Bulk publish</strong> — Select multiple draft entries and publish them all at once. Useful after a sprint where several features shipped in parallel.</li>
                  <li><strong className="text-zinc-300">RSS feed</strong> — Every changelog now has an RSS feed at <code className="text-zinc-300">/feed.xml</code>. Your users can subscribe in any RSS reader.</li>
                </ul>
              </div>
              <div>
                <div className="text-orange-400 text-xs font-mono uppercase tracking-wider mb-1">Fixed</div>
                <ul className="space-y-2 list-none pl-0">
                  <li>Images uploaded on mobile were sometimes rotated incorrectly. Fixed by reading EXIF orientation data before display.</li>
                </ul>
              </div>
            </div>
          </div>

          <h3>Format 3: Feature spotlight (major releases)</h3>
          <div className="not-prose rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 my-6 text-sm leading-relaxed">
            <div className="text-zinc-500 text-xs uppercase tracking-wider mb-3 font-mono">February 2026 — Major Release</div>
            <div className="text-zinc-300 font-semibold text-base mb-2">AI-generated changelog entries</div>
            <div className="text-zinc-400 space-y-3">
              <p>Connect your GitHub repo and Changelog.dev now reads your commits, pull request descriptions, and labels — then drafts a changelog entry written in plain English for your users. Not the commit message. Not the PR title. An actual human-readable entry about what changed and why.</p>
              <p>You review it, edit it, and publish. Average time from commit to published entry: 4 minutes.</p>
              <p className="text-zinc-500 text-xs">Available on all plans. Connect your repo in Settings → Integrations.</p>
            </div>
          </div>

          <h2>The five most common changelog mistakes</h2>

          <h3>1. Writing for the engineering team, not users</h3>
          <p>
            Already covered above, but worth repeating: if your entries contain words like &ldquo;refactor,&rdquo; &ldquo;endpoint,&rdquo; &ldquo;schema,&rdquo; or &ldquo;migration,&rdquo; rewrite them. Your users do not know what those mean in context, and more importantly, they do not care. They care about what works differently now.
          </p>

          <h3>2. Grouping too many changes into one entry</h3>
          <p>
            &ldquo;Various improvements and bug fixes&rdquo; is not a changelog entry. It is the absence of a changelog. Users who hit a specific bug cannot tell from this whether it was fixed. Users who wanted a specific feature cannot tell whether it was added.
          </p>
          <p>
            If you shipped 20 things this month, list the 5-7 most user-facing ones individually. The rest can go into a generic &ldquo;and several small improvements&rdquo; line at the end — but the important ones should be named.
          </p>

          <h3>3. Omitting removals and breaking changes</h3>
          <p>
            When something is removed or changes in a way that breaks existing workflows, users need to know. Hiding this in a generic &ldquo;changes&rdquo; category, or worse not mentioning it at all, guarantees angry support tickets and damaged trust.
          </p>
          <p>
            Be direct: <em>&ldquo;Removed: The legacy export format (.xls) is no longer supported. Use .xlsx instead — all exports now default to the newer format.&rdquo;</em>
          </p>
          <p>
            Customers respect honesty. What they do not forgive is discovering a breaking change by accident.
          </p>

          <h3>4. Irregular cadence</h3>
          <p>
            A changelog that was last updated eight months ago sends a clear signal: the product may be abandoned, or the team does not think communication with users is important. Neither is the signal you want to send.
          </p>
          <p>
            Monthly is the minimum sustainable cadence for an active SaaS. If you ship more frequently, weekly or even as-needed entries work well. The rule is: never go more than six weeks without an update if the product is actively being built.
          </p>

          <h3>5. Changelog as marketing copy</h3>
          <p>
            Changelogs that read like press releases — &ldquo;We are thrilled to announce our revolutionary new AI-powered dashboard experience&rdquo; — erode trust. Users read changelogs to get information, not to be sold to.
          </p>
          <p>
            Write like a person. Skip the superlatives. Describe what changed. Let the feature speak for itself.
          </p>

          <h2>How to build a consistent changelog habit</h2>
          <p>
            The enemy of a good changelog is not bad writing — it is the friction of the process. Most changelogs go dark because updating them feels like administrative overhead on top of building.
          </p>
          <p>
            Three things that help:
          </p>

          <h3>1. Update the changelog at the time of shipping, not after</h3>
          <p>
            The moment you merge a PR or deploy a feature is when the context is freshest. A two-sentence changelog entry takes 90 seconds when you just shipped something. It takes 20 minutes two weeks later when you are trying to reconstruct what changed and why.
          </p>
          <p>
            Make it part of the definition of done: a feature is not shipped until the changelog is updated.
          </p>

          <h3>2. Keep a draft running throughout the release cycle</h3>
          <p>
            Instead of writing the monthly changelog at the end of the month, keep a running draft open. Add entries as you ship. At the end of the month, review and publish. The work is already done — you are just editing, not writing from scratch.
          </p>

          <h3>3. Use automation to draft, humans to edit</h3>
          <p>
            AI tools can read your commits and pull requests and draft changelog entries in plain English. This does not replace your judgment — you still need to review and edit — but it eliminates the blank page problem that causes most changelogs to stall.
          </p>
          <p>
            <Link href="/">Changelog.dev</Link> connects to your GitHub repo and drafts entries automatically from commits and PRs. You review, edit, and publish. The result is a consistent, user-facing changelog without the process overhead that causes most teams to give up.
          </p>

          <h2>What makes a great changelog</h2>
          <p>
            The changelogs that users actually read and reference — Stripe, Linear, Vercel, Notion — share a few common traits:
          </p>
          <ul>
            <li><strong>Consistent voice:</strong> They sound like the same person wrote every entry. Not a committee, not an algorithm. One clear voice.</li>
            <li><strong>User-first framing:</strong> Every entry answers &ldquo;what does this mean for me?&rdquo; before &ldquo;what did the team build?&rdquo;</li>
            <li><strong>Visual hierarchy:</strong> Categories, dates, and entry types are visually distinct. Scanning is easy.</li>
            <li><strong>Honest about fixes:</strong> They list bugs fixed without shame. Users trust products that admit things were broken.</li>
            <li><strong>Searchable and linkable:</strong> Individual entries have permanent URLs so you can link to a specific change from a support reply or email.</li>
          </ul>
          <p>
            None of these require a large team or expensive tooling. They require a decision to treat the changelog as a first-class product artifact rather than an afterthought.
          </p>

          <h2>The payoff</h2>
          <p>
            A well-maintained changelog does several things that most SaaS founders underestimate:
          </p>
          <ul>
            <li>It reduces churn by showing users the product is actively improving</li>
            <li>It closes the loop with users who reported bugs or requested features</li>
            <li>It gives prospects a signal that the product is alive and maintained — a key purchase decision factor for B2B SaaS</li>
            <li>It compounds over time: a two-year changelog history is a powerful trust signal that cannot be faked</li>
          </ul>
          <p>
            Start simple. One entry per month. Date it. Categorize it. Write it for the person who uses your product, not the person who built it. That is the entire practice. Everything else is refinement.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-indigo-500/20 bg-indigo-950/10 p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ship faster. Keep users informed automatically.</h3>
          <p className="text-zinc-500 text-sm mb-6">
            Connect GitHub. AI drafts changelog entries from your commits. You edit and publish. Free tier — no credit card required.
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
            <Link href="/blog/how-to-write-release-notes" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                How to Write Release Notes: Templates + Examples (2026) →
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
            <Link href="/blog/saas-product-updates" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                How to Notify Customers About Product Updates →
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
