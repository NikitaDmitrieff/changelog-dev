import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'GitHub Action for Automated Changelogs: Generate Changelogs from Conventional Commits in CI/CD | Changelog.dev',
  description:
    'Automate changelog generation in GitHub Actions with conventional commits. PR comments, release notes, and CHANGELOG.md — zero config. Free and open source.',
  openGraph: {
    title: 'GitHub Action for Automated Changelogs: Generate Changelogs from Conventional Commits in CI/CD',
    description:
      'Automate changelog generation in GitHub Actions with conventional commits. PR comments, release notes, and CHANGELOG.md — zero config.',
    type: 'article',
    url: 'https://www.changelogdev.com/blog/github-action-automated-changelog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Action for Automated Changelogs',
    description:
      'Automate changelog generation in GitHub Actions with conventional commits. PR comments, release notes, and CHANGELOG.md — zero config.',
  },
}

export default function GitHubActionChangelogPost() {
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
            <span className="text-zinc-600 text-xs">8 min read</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            GitHub Action for Automated Changelogs: Generate Release Notes from Conventional Commits in CI/CD
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Stop writing changelogs by hand. Our new GitHub Action parses conventional commits and
            generates formatted changelogs automatically — as PR comments, job summaries, release
            notes, or files. One line of YAML. Zero config.
          </p>
        </div>

        <div className="prose-custom space-y-6 text-zinc-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The problem with manual changelogs</h2>
          <p>
            Every developer knows the feeling. You are tagging a release, and someone asks:
            &quot;What changed since the last version?&quot; You open the git log, scroll through
            dozens of commits, try to remember which ones matter, and cobble together a summary.
            It takes 20 minutes. Nobody reads it.
          </p>
          <p>
            Or worse — you skip the changelog entirely. Your users see a version bump with no
            explanation. Support tickets roll in. Trust erodes one silent deploy at a time.
          </p>
          <p>
            If you already write{' '}
            <a
              href="https://www.conventionalcommits.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white"
            >
              conventional commits
            </a>
            , the information is already there. It just needs to be extracted and formatted.
            That is exactly what our new GitHub Action does.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Introducing changelog-action</h2>
          <p>
            The{' '}
            <a
              href="https://github.com/NikitaDmitrieff/changelog-action"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white"
            >
              Changelog Generator Action
            </a>{' '}
            is a free, open-source GitHub Action that generates changelogs from your conventional
            commits. It wraps{' '}
            <a
              href="https://www.npmjs.com/package/changelogdev-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white"
            >
              changelogdev-cli
            </a>{' '}
            and runs inside any GitHub Actions workflow.
          </p>
          <p>The simplest possible setup:</p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4">
            <div className="text-emerald-400">- uses: NikitaDmitrieff/changelog-action@v1</div>
          </div>
          <p>
            That single line generates a changelog from all your commits and adds it to the
            GitHub Actions job summary. No API keys. No configuration files. No dependencies to
            install.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Three workflows, three use cases</h2>
          <p>
            Most teams need changelogs in one of three places: on pull requests, in release notes,
            or committed to a file. The action handles all three.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">1. Add a changelog to every PR</h3>
          <p>
            This is the most common use case. When a contributor opens a pull request, the action
            reads the commits in that branch and posts a formatted changelog as a PR comment.
            Reviewers see exactly what changed without digging through individual commits.
          </p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4 overflow-x-auto">
            <div className="text-zinc-500">name: Changelog</div>
            <div className="text-zinc-500">on: pull_request</div>
            <div className="text-zinc-500">&nbsp;</div>
            <div className="text-zinc-500">jobs:</div>
            <div className="text-zinc-500">&nbsp; changelog:</div>
            <div className="text-zinc-500">&nbsp;&nbsp;&nbsp; runs-on: ubuntu-latest</div>
            <div className="text-zinc-500">&nbsp;&nbsp;&nbsp; steps:</div>
            <div className="text-zinc-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - uses: actions/checkout@v4</div>
            <div className="text-zinc-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; with:</div>
            <div className="text-zinc-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; fetch-depth: 0</div>
            <div className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - uses: NikitaDmitrieff/changelog-action@v1</div>
            <div className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; with:</div>
            <div className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; add-to-pr: &apos;true&apos;</div>
          </div>
          <p>
            The <span className="font-mono text-xs text-zinc-400">fetch-depth: 0</span> flag
            is important — it tells the checkout action to pull full git history so the changelog
            generator can see all commits, not just the latest one.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">2. Generate release notes automatically</h3>
          <p>
            When you push a version tag, this workflow generates a changelog filtered to features
            and bug fixes from the last month, then passes it to the GitHub Release action. Your
            releases get professional, categorized notes without any manual writing.
          </p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4 overflow-x-auto">
            <div className="text-zinc-500">name: Release</div>
            <div className="text-zinc-500">on:</div>
            <div className="text-zinc-500">&nbsp; push:</div>
            <div className="text-zinc-500">&nbsp;&nbsp;&nbsp; tags: [&apos;v*&apos;]</div>
            <div className="text-zinc-500">&nbsp;</div>
            <div className="text-zinc-500">jobs:</div>
            <div className="text-zinc-500">&nbsp; release:</div>
            <div className="text-zinc-500">&nbsp;&nbsp;&nbsp; runs-on: ubuntu-latest</div>
            <div className="text-zinc-500">&nbsp;&nbsp;&nbsp; steps:</div>
            <div className="text-zinc-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - uses: actions/checkout@v4</div>
            <div className="text-zinc-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; with:</div>
            <div className="text-zinc-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; fetch-depth: 0</div>
            <div className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - uses: NikitaDmitrieff/changelog-action@v1</div>
            <div className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; id: changelog</div>
            <div className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; with:</div>
            <div className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; from: &apos;last month&apos;</div>
            <div className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; type: &apos;feat,fix&apos;</div>
            <div className="text-zinc-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - uses: softprops/action-gh-release@v2</div>
            <div className="text-zinc-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; with:</div>
            <div className="text-zinc-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; body: {'${{ steps.changelog.outputs.changelog }}'}</div>
          </div>
          <p>
            The <span className="font-mono text-xs text-zinc-400">from</span> input accepts
            dates (like <span className="font-mono text-xs text-zinc-400">2026-01-01</span> or{' '}
            <span className="font-mono text-xs text-zinc-400">last month</span>) and git refs.
            The <span className="font-mono text-xs text-zinc-400">type</span> filter lets you
            include only the commit categories your users care about.
          </p>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">3. Write to CHANGELOG.md</h3>
          <p>
            Some projects keep a CHANGELOG.md in the repository root. The action can write directly
            to a file, which you can then commit in a subsequent step or review in a PR.
          </p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4 overflow-x-auto">
            <div className="text-emerald-400">- uses: NikitaDmitrieff/changelog-action@v1</div>
            <div className="text-emerald-400">&nbsp; with:</div>
            <div className="text-emerald-400">&nbsp;&nbsp;&nbsp; output-file: &apos;CHANGELOG.md&apos;</div>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">All inputs and outputs</h2>
          <p>The action exposes six inputs, all optional:</p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Input</th>
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Default</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-zinc-500">
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">from</td>
                  <td className="py-2 pr-4">(all commits)</td>
                  <td className="py-2">Start date or git ref</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">to</td>
                  <td className="py-2 pr-4">(latest)</td>
                  <td className="py-2">End date or git ref</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">type</td>
                  <td className="py-2 pr-4">(all types)</td>
                  <td className="py-2">Filter commit types (comma-separated)</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">output-file</td>
                  <td className="py-2 pr-4">(none)</td>
                  <td className="py-2">Write changelog to file</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">add-to-summary</td>
                  <td className="py-2 pr-4">true</td>
                  <td className="py-2">Add to job summary</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">add-to-pr</td>
                  <td className="py-2 pr-4">false</td>
                  <td className="py-2">Post as PR comment</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>And two outputs you can reference in downstream steps:</p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Output</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-zinc-500">
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">changelog</td>
                  <td className="py-2">Generated changelog in markdown</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 font-mono text-xs text-zinc-400">commit-count</td>
                  <td className="py-2">Number of commits included</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">How conventional commits become changelogs</h2>
          <p>
            The action parses each commit message according to the{' '}
            <a
              href="https://www.conventionalcommits.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white"
            >
              Conventional Commits
            </a>{' '}
            specification and groups them by type. A commit like{' '}
            <span className="font-mono text-xs text-zinc-400">feat: add dark mode toggle</span>{' '}
            lands under &quot;New Features.&quot; A commit like{' '}
            <span className="font-mono text-xs text-zinc-400">fix: resolve login timeout on slow connections</span>{' '}
            goes under &quot;Bug Fixes.&quot;
          </p>
          <p>
            The supported types include <span className="font-mono text-xs text-zinc-400">feat</span>,{' '}
            <span className="font-mono text-xs text-zinc-400">fix</span>,{' '}
            <span className="font-mono text-xs text-zinc-400">perf</span>,{' '}
            <span className="font-mono text-xs text-zinc-400">refactor</span>,{' '}
            <span className="font-mono text-xs text-zinc-400">docs</span>,{' '}
            <span className="font-mono text-xs text-zinc-400">test</span>,{' '}
            <span className="font-mono text-xs text-zinc-400">build</span>,{' '}
            <span className="font-mono text-xs text-zinc-400">ci</span>, and{' '}
            <span className="font-mono text-xs text-zinc-400">chore</span>.
            Non-conventional commits are grouped under &quot;Other Changes&quot; so nothing gets lost.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Why not just use GitHub&apos;s built-in release notes?</h2>
          <p>
            GitHub&apos;s auto-generated release notes list every PR title between two tags. That is
            useful, but it has limits:
          </p>
          <ul className="list-none space-y-2 text-zinc-400">
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">No commit-level detail</strong> — it works at the PR level, so squashed PRs with multiple features show as a single line.</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">No type filtering</strong> — you cannot exclude chores, CI changes, or docs commits from user-facing notes.</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">No PR comments</strong> — the built-in feature only works at release time, not during code review.</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">No file output</strong> — you cannot write the result to CHANGELOG.md automatically.</li>
            <li><span className="text-zinc-500 mr-2">+</span><strong className="text-zinc-200">No date filtering</strong> — you cannot generate a changelog for &quot;the last 30 days&quot; across multiple releases.</li>
          </ul>
          <p>
            The Changelog Generator Action fills these gaps. Use it alongside GitHub&apos;s release
            notes or as a replacement — your call.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Part of the Changelog.dev ecosystem</h2>
          <p>
            This action is one piece of a broader toolkit for teams that take changelogs seriously:
          </p>
          <ul className="list-none space-y-2 text-zinc-400">
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">
                <Link href="/" className="text-zinc-400 hover:text-white">Changelog.dev</Link>
              </strong>{' '}
              — Hosted changelog pages for SaaS products. Public pages, subscriber emails, custom domains.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">
                <a href="https://www.npmjs.com/package/changelogdev-cli" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white">changelogdev-cli</a>
              </strong>{' '}
              — The CLI that powers this action. Run it locally or in any CI system.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">
                <Link href="/blog/open-source-changelog-widget" className="text-zinc-400 hover:text-white">changelogdev-widget</Link>
              </strong>{' '}
              — An embeddable Web Component that adds a &quot;What&apos;s New&quot; bell to your app. Under 8KB.
            </li>
          </ul>
          <p>
            Each tool works independently. Use the GitHub Action alone, combine it with the widget,
            or go all-in with a hosted{' '}
            <Link href="/" className="text-zinc-400 hover:text-white">Changelog.dev</Link>{' '}
            page. They compose, they do not lock you in.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Get started in 60 seconds</h2>
          <p>
            Create a file at <span className="font-mono text-xs text-zinc-400">.github/workflows/changelog.yml</span>{' '}
            in your repository with the PR comment workflow above. Push it. Open a pull request.
            The changelog appears as a comment within seconds.
          </p>
          <p>
            If your team does not use conventional commits yet, now is a good time to start. The
            specification is simple — prefix your commit message with a type like{' '}
            <span className="font-mono text-xs text-zinc-400">feat:</span> or{' '}
            <span className="font-mono text-xs text-zinc-400">fix:</span>. That is the only
            requirement. The action handles everything else.
          </p>

          <div className="flex flex-wrap gap-3 my-8">
            <a
              href="https://github.com/NikitaDmitrieff/changelog-action"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/[0.12] hover:border-white/[0.25] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-all text-sm"
            >
              View on GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/changelogdev-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/[0.12] hover:border-white/[0.25] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-all text-sm"
            >
              CLI on npm
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Create a changelog
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
