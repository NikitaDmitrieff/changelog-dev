"use client";
import Link from 'next/link'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { Timeline } from '@/components/ui/timeline'

const timelineData = [
  {
    title: "Connect",
    content: (
      <div>
        <h4 className="text-lg font-semibold text-zinc-100 mb-2">
          Link your GitHub repository
        </h4>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
          Paste your repo URL. We pull in recent commits automatically — public or private repos, any branch.
        </p>
        <div className="mt-6 rounded-md border border-white/[0.06] bg-zinc-950 p-5 font-mono text-[13px] leading-relaxed">
          <div className="text-zinc-600 mb-2"># Connect your repo</div>
          <div className="text-zinc-300">Repository: <span className="text-indigo-400">github.com/acme/webapp</span></div>
          <div className="mt-2 text-emerald-400">&#10003; 47 commits fetched</div>
          <div className="text-emerald-400">&#10003; Last release: 3 days ago</div>
        </div>
      </div>
    ),
  },
  {
    title: "Generate",
    content: (
      <div>
        <h4 className="text-lg font-semibold text-zinc-100 mb-2">
          AI drafts customer-facing entries
        </h4>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
          Claude reads your commit messages and writes release notes in plain language. Technical details become readable updates.
        </p>
        <div className="mt-6 rounded-md border border-white/[0.06] bg-zinc-950 p-5 font-mono text-[13px] leading-relaxed">
          <div className="text-zinc-600 mb-2"># AI-generated draft</div>
          <div className="text-zinc-300 font-semibold">Dashboard redesign + performance boost</div>
          <div className="mt-1 text-zinc-500 text-xs font-sans">
            The dashboard now loads 3x faster. We&apos;ve redesigned the navigation and added keyboard shortcuts for power users.
          </div>
          <div className="mt-2 flex gap-2">
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">Performance</span>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">UI</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Publish",
    content: (
      <div>
        <h4 className="text-lg font-semibold text-zinc-100 mb-2">
          Your customers stay in the loop
        </h4>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
          Publish to your hosted changelog page. Subscribers get an email automatically. Your users know what&apos;s new.
        </p>
        <div className="mt-6 rounded-md border border-white/[0.06] bg-zinc-950 p-5 font-mono text-[13px] leading-relaxed">
          <div className="text-zinc-600 mb-2"># Published to</div>
          <div className="text-indigo-400">changelog.dev/acme</div>
          <div className="mt-2 text-emerald-400">&#10003; 243 subscribers notified</div>
          <div className="text-zinc-500 text-xs mt-1 font-sans">Email sent · 2 min ago</div>
        </div>
      </div>
    ),
  },
]

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "GitHub-native",
    desc: "Connects to any public or private repo. Reads commits, PRs, and tags automatically.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI-drafted entries",
    desc: "Claude translates commit messages into clear, customer-readable release notes in seconds.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email subscribers",
    desc: "Visitors subscribe directly on your changelog page. Emails go out when you publish.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
    title: "Hosted instantly",
    desc: "Your page is live at changelog.dev/yourproduct the moment you create it. No setup.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "Edit before publish",
    desc: "AI drafts are a starting point. Edit, add context, or publish as-is — your choice.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: "Tag by type",
    desc: "Features, improvements, bug fixes. Tags help customers scan what matters to them.",
  },
]

const comparisons = [
  {
    without: "Commits buried in GitHub Releases that customers never read",
    with: "A dedicated page written in plain language your users understand",
  },
  {
    without: "Manual blog post writing after every release (nobody has time)",
    with: "AI drafts the entry in seconds from your commits",
  },
  {
    without: "Customers don't know what's new, churn without reason",
    with: "Subscribers get an email automatically when you ship",
  },
  {
    without: "$35/mo Beamer or Canny before you have a single customer",
    with: "Free forever for 1 changelog, 100 subscribers",
  },
]

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Corner frame overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden="true">
        <div className="absolute top-6 left-6 h-1.5 w-1.5 rounded-full bg-indigo-500 opacity-30 animate-pulse" />
        <div className="absolute top-6 left-6 w-4 h-px bg-indigo-500/20" />
        <div className="absolute top-6 left-6 w-px h-4 bg-indigo-500/20" />
        <div className="absolute top-6 right-6 h-1.5 w-1.5 rounded-full bg-indigo-500 opacity-30 animate-pulse" style={{ animationDelay: "0.4s" }} />
        <div className="absolute top-6 right-6 w-4 h-px bg-indigo-500/20" />
        <div className="absolute top-6 right-6 w-px h-4 bg-indigo-500/20" />
        <div className="absolute bottom-6 left-6 h-1.5 w-1.5 rounded-full bg-indigo-500 opacity-30 animate-pulse" style={{ animationDelay: "0.8s" }} />
        <div className="absolute bottom-6 left-6 w-4 h-px bg-indigo-500/20" />
        <div className="absolute bottom-6 left-6 w-px h-4 bg-indigo-500/20" />
        <div className="absolute bottom-6 right-6 h-1.5 w-1.5 rounded-full bg-indigo-500 opacity-30 animate-pulse" style={{ animationDelay: "1.2s" }} />
        <div className="absolute bottom-6 right-6 w-4 h-px bg-indigo-500/20" />
        <div className="absolute bottom-6 right-6 w-px h-4 bg-indigo-500/20" />
      </div>

      {/* Nav */}
      <nav className="relative z-40 border-b border-white/[0.06] px-6 py-4 backdrop-blur-sm bg-black/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight text-white">changelog.dev</span>
          <div className="flex items-center gap-6">
            <Link href="/changelog-dev" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Demo
            </Link>
            <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="/login"
              className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-5xl h-[14rem] sm:h-[18rem] md:h-[22rem] relative z-10"
        >
          <TextHoverEffect text="CHANGELOG.DEV" duration={0.3} textSize="text-7xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative z-10 text-center mt-8 max-w-xl"
        >
          <p className="text-xl text-zinc-400 leading-relaxed">
            Beautiful hosted changelog pages.<br />
            <span className="text-white">AI drafts the entries. Customers stay informed.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <Link
            href="/login"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
          >
            Start free — no credit card
          </Link>
          <Link
            href="/changelog-dev"
            className="text-zinc-500 hover:text-white text-sm transition-colors"
          >
            See a live example →
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="relative z-10 text-zinc-600 text-xs mt-4"
        >
          Free tier: 1 changelog · 100 subscribers · forever
        </motion.p>
      </section>

      {/* Product Preview */}
      <section className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">The product</span>
            <h2 className="mt-3 text-3xl font-bold text-white">See what your customers will see</h2>
            <p className="mt-2 text-zinc-500 text-sm max-w-md mx-auto">A clean, focused page that keeps users informed — not a raw GitHub Releases dump.</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            {/* Product mockup */}
            <div className="glass-card rounded-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/[0.05] rounded px-3 py-1 text-xs text-zinc-600 font-mono max-w-xs mx-auto text-center">
                    changelog.dev/your-product
                  </div>
                </div>
              </div>

              {/* Mock changelog content */}
              <div className="p-8 grid md:grid-cols-[200px_1fr] gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Your Product</h3>
                  <p className="text-xs text-zinc-600 mb-4">3 updates this month</p>
                  <div className="space-y-1 text-xs text-zinc-600">
                    <div className="text-indigo-400 cursor-pointer">v2.4 — Mar 2026</div>
                    <div className="cursor-pointer hover:text-zinc-400">v2.3 — Feb 2026</div>
                    <div className="cursor-pointer hover:text-zinc-400">v2.2 — Jan 2026</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="border-l border-indigo-500/30 pl-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">v2.4.0</span>
                      <span className="text-xs text-zinc-600">March 5, 2026</span>
                    </div>
                    <h4 className="font-semibold text-white mb-1">Dashboard redesign + 3x performance boost</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      The dashboard now loads significantly faster thanks to query optimization. We&apos;ve also redesigned the navigation with a cleaner layout and added keyboard shortcuts for power users.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Performance</span>
                      <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">UI</span>
                    </div>
                  </div>
                  <div className="border-l border-white/[0.06] pl-6 opacity-60">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-white/5 text-zinc-500 border border-white/[0.06] px-2 py-0.5 rounded font-mono">v2.3.2</span>
                      <span className="text-xs text-zinc-700">Feb 18, 2026</span>
                    </div>
                    <h4 className="font-semibold text-zinc-300 mb-1">Bug fixes + dark mode improvements</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">Fixed an issue with dark mode on Safari. Improved contrast on several UI elements.</p>
                  </div>
                </div>
              </div>

              {/* Subscribe bar */}
              <div className="border-t border-white/[0.06] px-8 py-4 flex items-center justify-between bg-white/[0.01]">
                <p className="text-xs text-zinc-600">Get notified when we ship</p>
                <div className="flex gap-2">
                  <div className="bg-white/[0.05] border border-white/[0.06] rounded px-3 py-1.5 text-xs text-zinc-600 font-mono w-48">you@example.com</div>
                  <div className="bg-indigo-500 text-white text-xs px-3 py-1.5 rounded cursor-pointer">Subscribe</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works — Timeline */}
      <section id="how-it-works" className="border-t border-white/[0.06]">
        <FadeIn className="text-center pt-20 px-6">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">How it works</span>
          <h2 className="mt-3 text-3xl font-bold text-white">Ship, generate, publish</h2>
          <p className="mt-2 text-zinc-500 text-sm">Three steps. Takes less than 5 minutes to set up.</p>
        </FadeIn>
        <Timeline data={timelineData} />
      </section>

      {/* Features grid */}
      <section className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">Features</span>
            <h2 className="mt-3 text-3xl font-bold text-white">Everything you need, nothing you don&apos;t</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07}>
                <div className="glass-card rounded-xl p-6 h-full">
                  <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 border border-indigo-500/20">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">Why changelog.dev</span>
            <h2 className="mt-3 text-3xl font-bold text-white">GitHub Releases alone aren&apos;t enough</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4">
            <FadeIn delay={0.1}>
              <div className="rounded-xl border border-red-500/10 bg-gradient-to-br from-red-950/10 to-black p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-red-400 text-lg">&#10005;</span>
                  <span className="font-semibold text-zinc-300 text-sm">Without changelog.dev</span>
                </div>
                <div className="space-y-4">
                  {comparisons.map((c) => (
                    <div key={c.without} className="text-sm text-zinc-600 flex gap-2">
                      <span className="text-red-500/40 shrink-0 mt-0.5">&#9679;</span>
                      {c.without}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="rounded-xl border border-indigo-500/15 bg-gradient-to-br from-indigo-950/10 to-black p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-indigo-400 text-lg">&#10003;</span>
                  <span className="font-semibold text-zinc-300 text-sm">With changelog.dev</span>
                </div>
                <div className="space-y-4">
                  {comparisons.map((c) => (
                    <div key={c.with} className="text-sm text-zinc-400 flex gap-2">
                      <span className="text-indigo-400/60 shrink-0 mt-0.5">&#9679;</span>
                      {c.with}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-14">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">Pricing</span>
            <h2 className="mt-3 text-3xl font-bold text-white">Simple, transparent pricing</h2>
            <p className="mt-2 text-zinc-500 text-sm">Start free. Upgrade when you grow.</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <div className="glass-card rounded-2xl p-8 h-full">
                <div className="text-lg font-semibold mb-1">Free</div>
                <div className="text-4xl font-bold mb-1">$0</div>
                <div className="text-zinc-500 text-sm mb-8">forever</div>
                <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                  {["1 changelog", "100 subscribers", "changelog.dev subdomain", "AI-generated entries", "GitHub integration"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-indigo-400">+</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block text-center bg-white/5 hover:bg-white/10 border border-white/[0.08] text-white font-medium py-3 rounded-lg transition-colors text-sm"
                >
                  Get started free
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="rounded-2xl p-8 relative border border-indigo-500/25 bg-gradient-to-br from-indigo-950/20 to-black h-full">
                <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Popular
                </div>
                <div className="text-lg font-semibold mb-1">Pro</div>
                <div className="text-4xl font-bold mb-1">$29</div>
                <div className="text-zinc-500 text-sm mb-8">per month</div>
                <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                  {["Unlimited changelogs", "Unlimited subscribers", "Custom domain", "No \"Powered by\" branding", "Priority support"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-indigo-400">+</span> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block text-center bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3 rounded-lg transition-colors text-sm"
                >
                  Start with Pro
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 border-t border-white/[0.06]">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Your users want to know<br />
            <span className="text-gradient">what you&apos;ve been building</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-10">
            A changelog is the simplest way to show momentum, build trust, and reduce churn. Takes 5 minutes to set up.
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            Start free today
          </Link>
          <p className="text-zinc-700 text-xs mt-4">No credit card · Free forever for small teams</p>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-zinc-600">
          <span>changelog.dev</span>
          <div className="flex items-center gap-6">
            <Link href="/changelog-dev" className="hover:text-zinc-400 transition-colors">Demo</Link>
            <Link href="/login" className="hover:text-zinc-400 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
