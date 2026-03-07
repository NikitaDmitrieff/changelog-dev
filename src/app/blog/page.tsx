import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | Changelog.dev',
  description:
    'Product updates, changelog best practices, and SaaS growth insights from the Changelog.dev team.',
  openGraph: {
    title: 'Blog | Changelog.dev',
    description: 'Product updates, changelog best practices, and SaaS growth insights.',
    type: 'website',
    url: 'https://www.changelogdev.com/blog',
  },
}

const posts = [
  {
    slug: 'github-action-automated-changelog',
    title: 'GitHub Action for Automated Changelogs: Generate Release Notes from Conventional Commits in CI/CD',
    description:
      'Automate changelog generation in GitHub Actions. PR comments, release notes, and CHANGELOG.md from conventional commits — one line of YAML, zero config.',
    category: 'Open Source',
    date: 'March 2026',
    readTime: '8 min read',
  },
  {
    slug: 'keep-a-changelog-guide',
    title: 'Keep a Changelog: 9 Rules for Writing Changelogs Developers and Users Actually Read',
    description:
      'A practical guide to the Keep a Changelog standard and 9 rules for writing changelogs that developers and product managers can follow consistently. Good vs. bad examples included.',
    category: 'Guide',
    date: 'March 2026',
    readTime: '12 min read',
  },
  {
    slug: 'why-web-components-over-react',
    title: 'Why We Chose Web Components Over React for Our Embeddable Widget',
    description:
      'Shadow DOM isolation, zero dependencies, and framework-agnostic distribution. The technical trade-offs behind building an embeddable changelog widget with Web Components instead of React.',
    category: 'Engineering',
    date: 'March 2026',
    readTime: '6 min read',
  },
  {
    slug: 'open-source-changelog-widget',
    title: 'Introducing the Open-Source Changelog Widget',
    description:
      'A free, zero-dependency Web Component that adds a "What\'s New" bell to any website. Two lines of HTML, under 8KB gzipped, MIT licensed. Works with React, Vue, or vanilla HTML.',
    category: 'Open Source',
    date: 'March 2026',
    readTime: '4 min read',
  },
  {
    slug: 'complete-guide-saas-changelogs',
    title: 'The Complete Guide to SaaS Changelogs (2026)',
    description:
      'Everything you need to know about SaaS changelogs: format, writing style, distribution channels, SEO, measuring impact, common mistakes, and tools. The definitive resource.',
    category: 'Guide',
    date: 'March 2026',
    readTime: '15 min read',
  },
  {
    slug: 'changelog-best-practices',
    title: 'Changelog Best Practices: How to Write a Changelog That Users Actually Read',
    description:
      'The definitive guide to changelog format, writing style, and real examples. Learn how to write changelog entries that build trust, reduce churn, and keep users informed.',
    category: 'Guide',
    date: 'March 2026',
    readTime: '11 min read',
  },
  {
    slug: 'saas-product-updates',
    title: 'How to Notify Customers About Product Updates (Email Templates + Examples)',
    description:
      'Which channels work, what to write, and how to automate product update emails that customers actually open. Templates for monthly roundups, feature launches, and re-engagement.',
    category: 'Growth',
    date: 'March 2026',
    readTime: '9 min read',
  },
  {
    slug: 'how-to-write-release-notes',
    title: 'How to Write Release Notes: Templates + Examples (2026)',
    description:
      'A practical framework for writing release notes your customers actually read — with copy-paste templates and real-world before/after examples.',
    category: 'Guide',
    date: 'March 2026',
    readTime: '10 min read',
  },
  {
    slug: 'best-changelog-tools-compared',
    title: 'Best Changelog Tools for SaaS in 2026',
    description:
      'Comparing Beamer, Headway, Changefeed, and Changelog.dev — what each tool actually does, who it is for, and what it costs.',
    category: 'Tools',
    date: 'March 2026',
    readTime: '6 min read',
  },
  {
    slug: 'why-your-saas-needs-a-changelog',
    title: 'Why Your SaaS Needs a Changelog (And How to Write One)',
    description:
      'A changelog is the simplest way to reduce churn, build trust, and show your users you are actively shipping.',
    category: 'Product',
    date: 'March 2026',
    readTime: '8 min read',
  },
]

export default function BlogIndex() {
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

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">
            Blog
          </span>
          <h1 className="text-3xl font-bold mt-3 mb-3">Articles</h1>
          <p className="text-zinc-500">
            Changelog best practices, tool comparisons, and SaaS growth insights.
          </p>
        </div>

        <div className="space-y-px">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl p-6 -mx-6 hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">
                  {post.category}
                </span>
                <span className="text-zinc-700 text-xs">·</span>
                <time className="text-zinc-600 text-xs">{post.date}</time>
                <span className="text-zinc-700 text-xs">·</span>
                <span className="text-zinc-600 text-xs">{post.readTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors mb-1">
                {post.title}
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">{post.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
            ← Back to Changelog.dev
          </Link>
        </div>
      </main>
    </div>
  )
}
