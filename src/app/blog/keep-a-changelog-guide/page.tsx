import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Keep a Changelog: 9 Rules for Writing Changelogs Developers and Users Actually Read | Changelog.dev',
  description:
    'A practical guide to the Keep a Changelog standard and 9 rules for writing changelogs that developers and product managers can follow consistently. Includes good vs. bad examples.',
  openGraph: {
    title: 'Keep a Changelog: 9 Rules for Writing Changelogs Developers and Users Actually Read',
    description:
      '9 actionable rules based on the Keep a Changelog standard. Good vs. bad examples, formatting guidance, and workflow tips for dev teams.',
    type: 'article',
    url: 'https://www.changelogdev.com/blog/keep-a-changelog-guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keep a Changelog: 9 Rules for Writing Changelogs Developers and Users Actually Read',
    description:
      '9 actionable rules based on the Keep a Changelog standard. Good vs. bad examples, formatting guidance, and workflow tips for dev teams.',
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
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        {/* Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">
              Guide
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <time className="text-zinc-600 text-xs">March 2026</time>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-zinc-600 text-xs">12 min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            Keep a Changelog: 9 Rules for Writing Changelogs Developers and Users Actually Read
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            The difference between a changelog that builds trust and one that gets ignored comes down to a handful of rules. Most of them were codified years ago in a project called Keep a Changelog. Here is how to apply them in practice, with examples of what good and bad entries look like.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-white prose-a:text-zinc-300 prose-li:text-zinc-400">

          <h2>The problem changelogs are supposed to solve</h2>
          <p>
            Every software project changes over time. Users need to know what changed. Developers need a record of what shipped and when. Product managers need to communicate progress to stakeholders and customers.
          </p>
          <p>
            Without a structured changelog, this information scatters across git logs, Slack threads, Jira tickets, and the memories of whoever happened to be in the standup that day. Six months later, nobody can tell you what shipped in Q1 without excavating a dozen tools.
          </p>
          <p>
            A changelog solves this by being the single, human-readable record of notable changes. But only if it is written well. A bad changelog — a dump of commit messages, a wall of jargon, a marketing press release disguised as release notes — is worse than no changelog at all. It teaches users to ignore it.
          </p>

          <h2>What is Keep a Changelog?</h2>
          <p>
            <strong>Keep a Changelog</strong> (keepachangelog.com) is an open-source project created by Olivier Lacan that defines a simple, consistent format for changelogs. It has become the de facto standard in the open-source world and increasingly in SaaS products.
          </p>
          <p>
            The core philosophy is captured in one sentence from the project: <em>&ldquo;Don&rsquo;t let your friends dump git logs into changelogs.&rdquo;</em>
          </p>
          <p>
            Keep a Changelog defines six entry types — Added, Changed, Deprecated, Removed, Fixed, and Security — and a set of guiding principles about how changelogs should be structured. It pairs naturally with Semantic Versioning but works equally well with date-based releases common in SaaS.
          </p>
          <p>
            The principles below build on this standard and extend it with practical guidance for teams shipping SaaS products, APIs, and developer tools.
          </p>

          <h2>Rule 1: Write for humans, not machines</h2>
          <p>
            This is the foundational rule from Keep a Changelog, and the one most teams violate. A changelog is for people — the customers, developers, and product managers who need to understand what changed without reading the source code.
          </p>
          <p>
            The test is simple: could a non-technical stakeholder read this entry and understand what changed? If not, rewrite it.
          </p>

          <div className="not-prose space-y-4 my-6">
            <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4 text-sm">
              <div className="text-red-400 text-xs uppercase tracking-wider font-mono mb-2">Bad: machine-readable, human-hostile</div>
              <p className="text-zinc-400">feat(api): implement rate limiting middleware with sliding window algorithm (120req/min per API key, configurable via env RATE_LIMIT_WINDOW_MS)</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-4 text-sm">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-mono mb-2">Good: human-first</div>
              <p className="text-zinc-400"><strong className="text-zinc-300">API rate limiting</strong> — API requests are now limited to 120 per minute per key. If you exceed the limit, you will receive a 429 response with a Retry-After header. This protects all customers from noisy-neighbor issues during traffic spikes.</p>
            </div>
          </div>

          <p>
            The first version is a commit message copy-pasted into a changelog. The second is a changelog entry. Same change. Different audience.
          </p>

          <h2>Rule 2: Use the six standard categories</h2>
          <p>
            Keep a Changelog defines six entry types, and they cover every kind of change you will ever ship. Using them consistently gives your changelog a scannable structure that users learn to navigate.
          </p>

          <div className="not-prose rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 my-6 text-sm leading-relaxed">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-mono font-bold w-28 shrink-0">Added</span>
                <span className="text-zinc-400">New features or capabilities that did not exist before.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-mono font-bold w-28 shrink-0">Changed</span>
                <span className="text-zinc-400">Modifications to existing functionality. The feature exists but now works differently.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 font-mono font-bold w-28 shrink-0">Deprecated</span>
                <span className="text-zinc-400">Features that still work but will be removed in a future release. Early warning.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-mono font-bold w-28 shrink-0">Removed</span>
                <span className="text-zinc-400">Features that are gone. Be direct so users know to migrate.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 font-mono font-bold w-28 shrink-0">Fixed</span>
                <span className="text-zinc-400">Bug fixes. Users who hit the bug need to know the loop is closed.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-mono font-bold w-28 shrink-0">Security</span>
                <span className="text-zinc-400">Security-related changes. Transparency here builds trust more than silence ever will.</span>
              </div>
            </div>
          </div>

          <p>
            Resist the urge to invent your own categories. &ldquo;Improvements,&rdquo; &ldquo;Tweaks,&rdquo; &ldquo;Misc&rdquo; — these mean nothing to a reader scanning for relevant changes. The six standard types are specific enough to be useful and broad enough to cover everything.
          </p>

          <h2>Rule 3: Put the newest changes first</h2>
          <p>
            Reverse chronological order. Always. The most recent release goes at the top. This is how every user expects a changelog to work: they open it to see what changed recently, not to read a history book from page one.
          </p>
          <p>
            Keep a Changelog mandates this, and it is the right call. If your changelog requires scrolling past two years of entries to find last week&rsquo;s update, the structure is broken.
          </p>
          <p>
            For SaaS products, date your entries clearly. Users do not track your internal version numbers. &ldquo;March 7, 2026&rdquo; is universally understood. &ldquo;v4.2.1-beta.3&rdquo; is not.
          </p>

          <h2>Rule 4: One entry per notable change</h2>
          <p>
            The single most common changelog anti-pattern is the catch-all entry:
          </p>

          <div className="not-prose space-y-4 my-6">
            <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4 text-sm">
              <div className="text-red-400 text-xs uppercase tracking-wider font-mono mb-2">Bad: the black hole entry</div>
              <p className="text-zinc-400">Various improvements and bug fixes.</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-4 text-sm">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-mono mb-2">Good: specific and scannable</div>
              <div className="text-zinc-400 space-y-2">
                <p><strong className="text-zinc-300">Fixed:</strong> CSV exports were missing the header row for accounts with custom fields.</p>
                <p><strong className="text-zinc-300">Fixed:</strong> The sidebar occasionally flickered on Firefox when switching between projects.</p>
                <p><strong className="text-zinc-300">Changed:</strong> Default date format in exports is now ISO 8601 instead of US format.</p>
              </div>
            </div>
          </div>

          <p>
            &ldquo;Various improvements&rdquo; tells the user nothing. It is the changelog equivalent of shrugging. A user who reported the CSV bug cannot tell whether it was fixed. A user affected by the Firefox issue has no way to know it was addressed.
          </p>
          <p>
            List changes individually. If you shipped 15 things and only 6 are user-facing, list those 6. Add a single line at the bottom for the rest: &ldquo;Plus several internal stability improvements.&rdquo; That is acceptable. Replacing everything with that line is not.
          </p>

          <h2>Rule 5: Never dump your git log</h2>
          <p>
            Keep a Changelog was born from this frustration. A git log is a record of every commit — merge commits, typo fixes, dependency bumps, work-in-progress checkpoints. Dumping this into a changelog is not transparency. It is noise.
          </p>

          <div className="not-prose space-y-4 my-6">
            <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4 text-sm">
              <div className="text-red-400 text-xs uppercase tracking-wider font-mono mb-2">Bad: git log dump</div>
              <div className="text-zinc-400 font-mono text-xs space-y-1">
                <p>a3f21bc fix lint errors</p>
                <p>9e8d4a1 wip: dashboard refactor</p>
                <p>2b7c9e3 Merge branch &lsquo;feature/rate-limits&rsquo;</p>
                <p>f1a2b3c bump axios from 1.6.2 to 1.6.5</p>
                <p>8d9e0f1 add rate limiting to api</p>
                <p>c4d5e6f fix typo in readme</p>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-4 text-sm">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-mono mb-2">Good: curated from the same commits</div>
              <div className="text-zinc-400 space-y-2">
                <p><strong className="text-zinc-300">Added:</strong> API rate limiting — requests are now capped at 120/min per key to prevent service disruption during traffic spikes.</p>
                <p><strong className="text-zinc-300">Security:</strong> Updated HTTP client library to patch a known vulnerability (CVE-2026-XXXX).</p>
              </div>
            </div>
          </div>

          <p>
            Six commits. Two changelog entries. That is the curation a changelog demands. The lint fixes, the merge commits, the typo corrections — those are development artifacts, not user-facing changes.
          </p>

          <h2>Rule 6: Show the user impact, not the implementation</h2>
          <p>
            This is where the gap between developer culture and user communication becomes most visible. Engineers naturally describe changes in terms of what they built. Users need to understand changes in terms of what shifted in their experience.
          </p>

          <div className="not-prose space-y-4 my-6">
            <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4 text-sm">
              <div className="text-red-400 text-xs uppercase tracking-wider font-mono mb-2">Implementation-focused</div>
              <p className="text-zinc-400">Migrated search index from PostgreSQL full-text to Elasticsearch. Rebuilt query parser to support field-scoped operators.</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-4 text-sm">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-mono mb-2">Impact-focused</div>
              <p className="text-zinc-400"><strong className="text-zinc-300">Search is faster and smarter.</strong> Results now appear instantly as you type, and you can search within specific fields (e.g., <code className="text-zinc-300">author:jane</code> or <code className="text-zinc-300">status:published</code>).</p>
            </div>
          </div>

          <p>
            Both describe the same work. The first tells developers what you did. The second tells users what they gained. For a product changelog, always write the second version. If you also serve a developer audience that cares about the internals, link to a technical blog post from the changelog entry.
          </p>

          <h2>Rule 7: Maintain an Unreleased section</h2>
          <p>
            This is one of Keep a Changelog&rsquo;s most underused recommendations. Keep an &ldquo;Unreleased&rdquo; section at the top of your changelog where you accumulate changes as they are merged but before they ship to users.
          </p>
          <p>
            The Unreleased section solves two problems:
          </p>
          <ul>
            <li><strong>It eliminates the end-of-cycle scramble.</strong> Instead of reconstructing what shipped from memory and git history, you already have a running list ready for review and publication.</li>
            <li><strong>It makes your changelog part of the workflow.</strong> When adding to Unreleased is part of the PR review checklist, the changelog stays current without dedicated &ldquo;changelog writing&rdquo; sessions that nobody wants to attend.</li>
          </ul>
          <p>
            For SaaS teams, this translates to keeping a draft entry always in progress. When your release is ready, you review the draft, polish it, and publish. Five minutes instead of an hour.
          </p>
          <p>
            Tools like <Link href="/">Changelog.dev</Link> automate this pattern. Connect your GitHub repo and it maintains a running draft from your commits and pull request descriptions. When you are ready to publish, the draft is already there — you review, edit for tone, and ship. The Unreleased-to-published workflow without the manual bookkeeping.
          </p>

          <h2>Rule 8: Be honest about removals and deprecations</h2>
          <p>
            This is the rule that separates changelogs that build trust from changelogs that erode it. When you remove a feature or deprecate an endpoint, users need to know before they discover it by hitting an error.
          </p>
          <p>
            Three principles for communicating removals:
          </p>
          <ol>
            <li><strong>Announce deprecation before removal.</strong> Give users at least one release cycle of warning. &ldquo;Deprecated: The /v1/export endpoint will be removed in April 2026. Use /v2/export instead.&rdquo;</li>
            <li><strong>Explain the migration path.</strong> Do not just announce the removal. Tell users what to do instead. Link to documentation if available.</li>
            <li><strong>Never hide breaking changes.</strong> Burying a breaking change in a &ldquo;miscellaneous&rdquo; section, or worse, not mentioning it at all, guarantees angry support tickets and social media complaints. The short-term discomfort of announcing a removal is nothing compared to the long-term damage of users discovering it by accident.</li>
          </ol>

          <div className="not-prose space-y-4 my-6">
            <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4 text-sm">
              <div className="text-red-400 text-xs uppercase tracking-wider font-mono mb-2">Bad: silent removal</div>
              <p className="text-zinc-400">Updated API endpoints.</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-4 text-sm">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-mono mb-2">Good: honest and actionable</div>
              <p className="text-zinc-400"><strong className="text-zinc-300">Removed:</strong> The legacy XML export format has been retired. All exports now use JSON. If your integration depends on XML, switch to the JSON format — the schema is documented at docs.example.com/exports.</p>
            </div>
          </div>

          <h2>Rule 9: Ship on a consistent cadence</h2>
          <p>
            A changelog that was last updated seven months ago sends one of two signals: the product is abandoned, or the team does not care about communicating with users. Neither is the signal you want.
          </p>
          <p>
            The right cadence depends on your shipping pace:
          </p>
          <ul>
            <li><strong>Shipping daily or weekly:</strong> Publish a weekly or bi-weekly changelog roundup. Batch small changes to avoid notification fatigue.</li>
            <li><strong>Shipping on sprints:</strong> Publish at the end of each sprint. Two-week cadence works well for most teams.</li>
            <li><strong>Shipping monthly:</strong> Monthly changelogs are the minimum viable cadence for any active product. Below this, users start to wonder if anyone is working on it.</li>
          </ul>
          <p>
            The golden rule: never go more than six weeks without a changelog update if the product is under active development. If you genuinely shipped nothing user-facing in six weeks, that is a product problem, not a changelog problem.
          </p>
          <p>
            Consistency matters more than volume. Three entries every two weeks builds more trust than a massive changelog dump every quarter. Users calibrate expectations based on your rhythm. Give them a rhythm they can rely on.
          </p>

          <h2>Putting it all together: a complete changelog entry</h2>
          <p>
            Here is what a monthly changelog entry looks like when all nine rules are applied:
          </p>

          <div className="not-prose rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 my-6 text-sm leading-relaxed">
            <div className="text-zinc-300 font-semibold text-base mb-4 font-mono">March 7, 2026</div>
            <div className="space-y-5 text-zinc-400">
              <div>
                <div className="text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">Added</div>
                <ul className="space-y-2 list-none pl-0">
                  <li><strong className="text-zinc-300">Slack integration</strong> — Get a Slack notification every time a changelog entry is published. Connect in Settings &rarr; Integrations.</li>
                  <li><strong className="text-zinc-300">Keyboard shortcuts</strong> — Press <code className="text-zinc-300">Cmd+K</code> to open the command palette. Navigate, search, and publish without touching the mouse.</li>
                </ul>
              </div>
              <div>
                <div className="text-blue-400 text-xs font-mono uppercase tracking-wider mb-2">Changed</div>
                <ul className="space-y-2 list-none pl-0">
                  <li><strong className="text-zinc-300">Entry editor redesign</strong> — The editor now uses a side-by-side layout with a live preview. Markdown formatting is visible in real time as you type.</li>
                </ul>
              </div>
              <div>
                <div className="text-yellow-400 text-xs font-mono uppercase tracking-wider mb-2">Deprecated</div>
                <ul className="space-y-2 list-none pl-0">
                  <li><strong className="text-zinc-300">Legacy embed script</strong> — The v1 embed script (<code className="text-zinc-300">changelog-widget.js</code>) will be removed on May 1, 2026. Migrate to the v2 Web Component. Migration guide: docs.changelog.dev/migrate-v2.</li>
                </ul>
              </div>
              <div>
                <div className="text-orange-400 text-xs font-mono uppercase tracking-wider mb-2">Fixed</div>
                <ul className="space-y-2 list-none pl-0">
                  <li>Email notifications were not sent for entries published via the API. Now fixed for all publishing methods.</li>
                  <li>Images wider than 800px were overflowing the entry container on mobile. They now scale correctly.</li>
                </ul>
              </div>
            </div>
          </div>

          <p>
            Scannable. Categorized. Dated. Written for the person using the product. Every entry answers the question: what does this mean for me?
          </p>

          <h2>How to start if you have no changelog</h2>
          <p>
            If your product does not have a changelog yet, do not try to retroactively document everything. Start from today:
          </p>
          <ol>
            <li><strong>Create the page.</strong> A <code>/changelog</code> route on your site, a CHANGELOG.md in your repo, or a dedicated tool — whatever gets it live fastest.</li>
            <li><strong>Write one entry.</strong> Describe the most recent notable change you shipped. Use the Keep a Changelog format. Date it.</li>
            <li><strong>Set a cadence.</strong> Put a recurring calendar event for changelog review. Monthly is fine to start.</li>
            <li><strong>Make it part of your workflow.</strong> Add &ldquo;update changelog&rdquo; to your PR template or definition of done. The best time to write a changelog entry is immediately after shipping, when context is fresh.</li>
          </ol>
          <p>
            That is the entire cold start. One page, one entry, one recurring reminder. Everything else is refinement over time.
          </p>
          <p>
            If you want to skip the manual setup, <Link href="/">Changelog.dev</Link> gives you a hosted changelog page, an embeddable widget for your app, and AI-drafted entries from your GitHub commits. Free tier, no credit card. You can go from zero to a published changelog in under five minutes.
          </p>

          <h2>The compound effect of a good changelog</h2>
          <p>
            A changelog is a trust ledger. Every entry is a deposit. Over months and years, the balance compounds in ways that are difficult to replicate with any other marketing or communication channel:
          </p>
          <ul>
            <li><strong>Prospects evaluate your changelog before buying.</strong> In B2B SaaS, a two-year changelog history is proof that the product is actively maintained. It cannot be faked.</li>
            <li><strong>Support tickets decrease.</strong> Users who check the changelog before filing a ticket often find their answer. &ldquo;Was this bug fixed?&rdquo; &ldquo;Did this feature ship?&rdquo; The changelog answers both.</li>
            <li><strong>Churn decreases.</strong> Users who see regular improvements are less likely to leave. The changelog reminds them that the product is getting better, even if the specific changes do not affect them directly.</li>
            <li><strong>Feature requests improve.</strong> Users who read changelogs understand where the product is heading. Their requests become more aligned with your roadmap.</li>
            <li><strong>SEO compounds.</strong> Every changelog entry is indexed content that targets long-tail keywords related to your product and the problems it solves.</li>
          </ul>
          <p>
            None of this requires a large team, a dedicated technical writer, or expensive tooling. It requires a decision: treat the changelog as a first-class product artifact, not an afterthought. Follow the Keep a Changelog standard. Write for humans. Ship consistently.
          </p>
          <p>
            The best changelog you will ever write is the next one. Start today.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Start your changelog in 5 minutes</h3>
          <p className="text-zinc-500 text-sm mb-6">
            Connect GitHub. AI drafts entries from your commits. You edit and publish. Hosted page + embeddable widget included. Free tier — no credit card.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-zinc-200 transition-colors"
          >
            Get started free →
          </Link>
        </div>

        {/* Related posts */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono mb-4">Related</p>
          <div className="space-y-3">
            <Link href="/blog/changelog-best-practices" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                Changelog Best Practices: How to Write a Changelog Users Actually Read →
              </span>
            </Link>
            <Link href="/blog/how-to-write-release-notes" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                How to Write Release Notes: Templates + Examples (2026) →
              </span>
            </Link>
            <Link href="/blog/complete-guide-saas-changelogs" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                The Complete Guide to SaaS Changelogs (2026) →
              </span>
            </Link>
            <Link href="/blog/why-your-saas-needs-a-changelog" className="block group">
              <span className="text-zinc-400 group-hover:text-white text-sm transition-colors">
                Why Your SaaS Needs a Changelog (And How to Write One) →
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
