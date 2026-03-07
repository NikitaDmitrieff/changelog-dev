"use client";
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { useRef, useEffect, useState } from 'react'

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const steps = [
  {
    number: "01",
    title: "Connect your repo",
    description: "Paste your GitHub URL. We pull in commits automatically — public or private repos, any branch.",
    visual: (
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950 p-5 font-mono text-[13px] leading-relaxed">
        <div className="text-zinc-600 mb-2"># Connect your repo</div>
        <div className="text-zinc-300">Repository: <span className="text-white">github.com/acme/webapp</span></div>
        <div className="mt-2 text-emerald-400">&#10003; 47 commits fetched</div>
        <div className="text-emerald-400">&#10003; Last release: 3 days ago</div>
      </div>
    ),
  },
  {
    number: "02",
    title: "AI drafts entries",
    description: "Claude reads your commits and writes release notes in plain language. Technical details become readable updates.",
    visual: (
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950 p-5">
        <div className="font-semibold text-white text-sm mb-1">Dashboard redesign + performance boost</div>
        <div className="text-zinc-500 text-xs leading-relaxed">
          The dashboard now loads 3x faster. We&apos;ve redesigned the navigation and added keyboard shortcuts for power users.
        </div>
        <div className="mt-3 flex gap-2">
          <span className="text-xs bg-white/5 text-zinc-400 border border-white/[0.08] px-2 py-0.5 rounded-full">Performance</span>
          <span className="text-xs bg-white/5 text-zinc-400 border border-white/[0.08] px-2 py-0.5 rounded-full">UI</span>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Publish & notify",
    description: "Publish to your hosted page. Subscribers get an email automatically. Your users know what's new.",
    visual: (
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950 p-5 font-mono text-[13px] leading-relaxed">
        <div className="text-zinc-600 mb-2"># Published to</div>
        <div className="text-white">changelog.dev/acme</div>
        <div className="mt-2 text-emerald-400">&#10003; 243 subscribers notified</div>
        <div className="text-zinc-500 text-xs mt-1 font-sans">Email sent &middot; 2 min ago</div>
      </div>
    ),
  },
]

const features = [
  {
    title: "GitHub-native",
    desc: "Connects to any public or private repo. Reads commits, PRs, and tags automatically.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "AI-drafted entries",
    desc: "Claude translates commit messages into clear, customer-readable release notes.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Email subscribers",
    desc: "Visitors subscribe on your page. Emails go out automatically when you publish.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Hosted instantly",
    desc: "Your page is live at changelog.dev/yourproduct the moment you create it.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
  },
  {
    title: "Edit before publish",
    desc: "AI drafts are a starting point. Edit, add context, or publish as-is.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    title: "Embeddable widget",
    desc: "Drop a script tag into your app. Users see a bell icon with unread badge.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    title: "REST API & CLI",
    desc: "Push entries from anywhere. CLI, GitHub Action, or direct API calls.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Custom branding",
    desc: "Accent colors, logo, custom domain. Make it look like your own product.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
]

const comparisons = [
  { without: "Commits buried in GitHub Releases nobody reads", with: "A dedicated page written for humans" },
  { without: "Manual blog post writing after every release", with: "AI drafts entries in seconds from commits" },
  { without: "Customers don't know what's new, churn silently", with: "Subscribers get emailed automatically" },
  { without: "$35/mo tools before you have a customer", with: "Free forever for 1 changelog" },
]

const devTools = [
  {
    name: "CLI",
    desc: "Push entries from your terminal",
    code: `$ npx changelogdev-cli push \\
    "v2.1" "New dashboard"`,
    link: "https://www.npmjs.com/package/changelogdev-cli",
    linkText: "npm",
  },
  {
    name: "GitHub Action",
    desc: "Auto-publish on release",
    code: `- uses: NikitaDmitrieff/changelog-action@v1
  with:
    project-id: my-app
    api-key: \${{ secrets.KEY }}`,
    link: "https://github.com/NikitaDmitrieff/changelog-action",
    linkText: "GitHub",
  },
  {
    name: "REST API",
    desc: "Full CRUD over HTTP",
    code: `$ curl -X POST /api/v1/entries \\
  -H "Authorization: Bearer $KEY" \\
  -d '{"title":"v2.1"}'`,
    link: "/docs/api",
    linkText: "Docs",
  },
  {
    name: "Widget",
    desc: "Drop-in web component",
    code: `<script src="unpkg.com/changelogdev-widget"></script>
<changelog-widget project-id="my-app" />`,
    link: "https://www.npmjs.com/package/changelogdev-widget",
    linkText: "npm",
  },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Nav */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'bg-black/80 border-b border-white/[0.06]' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold text-lg tracking-tight text-white">
            changelog.dev
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/demo" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Demo
            </Link>
            <Link href="/docs/api" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="#pricing" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/login" className="btn-primary text-sm !py-2 !px-5">
              Get started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className={`block w-5 h-px bg-zinc-400 transition-all duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block w-5 h-px bg-zinc-400 transition-all duration-200 ${mobileMenuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-b border-white/[0.06] bg-black/90 backdrop-blur-xl"
            >
              <div className="max-w-6xl mx-auto flex flex-col gap-4 px-6 pt-2 pb-6">
                <Link href="/demo" className="text-sm text-zinc-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Demo</Link>
                <Link href="/docs/api" className="text-sm text-zinc-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Docs</Link>
                <Link href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                <Link href="/login" className="btn-primary text-sm text-center" onClick={() => setMobileMenuOpen(false)}>Get started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-32 sm:pt-32 sm:pb-40">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10 text-center max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
            Beautiful changelogs
            <br />
            <span className="text-zinc-500">your customers</span>
            <br />
            <span className="text-zinc-500">actually read</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10 text-lg sm:text-xl text-zinc-500 text-center max-w-lg mt-8 leading-relaxed"
        >
          Connect GitHub, AI drafts the entries, subscribers get notified. Set up in under 5 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <Link href="/login" className="btn-primary text-base">
            Start free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link href="/changelog-dev" className="btn-secondary text-base">
            See live demo
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative z-10 flex flex-wrap items-center justify-center gap-6 mt-14 text-zinc-600 text-xs"
        >
          <span>No credit card required</span>
          <span className="hidden sm:inline text-zinc-800">&middot;</span>
          <span>Free tier forever</span>
          <span className="hidden sm:inline text-zinc-800">&middot;</span>
          <span>206 tests passing</span>
        </motion.div>
      </section>

      {/* Social proof / Trust */}
      <section className="px-6 pb-20">
        <FadeIn>
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-zinc-700">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>Open source</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono">
              Next.js
            </div>
            <div className="flex items-center gap-2 text-sm font-mono">
              Claude AI
            </div>
            <div className="flex items-center gap-2 text-sm font-mono">
              Supabase
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <span>3 npm packages</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Live Demo */}
      <section className="px-6 py-24 section-gradient">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-4">Live product</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">See it in action</h2>
            <p className="mt-3 text-zinc-500 text-base max-w-md mx-auto">
              This is the real dashboard. Scroll, click, explore.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="card !rounded-2xl overflow-hidden !bg-transparent">
              <div className="flex items-center gap-2 bg-zinc-950 border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-zinc-800" />
                  <div className="h-3 w-3 rounded-full bg-zinc-800" />
                  <div className="h-3 w-3 rounded-full bg-zinc-800" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="mx-auto max-w-sm flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-zinc-600 font-mono">
                    www.changelogdev.com/demo
                  </div>
                </div>
                <a href="/demo" target="_blank" className="text-xs text-zinc-500 hover:text-white font-medium whitespace-nowrap transition-colors">
                  Open full screen &#8599;
                </a>
              </div>
              <iframe src="/demo" className="w-full border-0 bg-black" style={{ height: '650px' }} title="Changelog.dev Demo" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-4">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Three steps to a live changelog</h2>
            <p className="mt-3 text-zinc-500 text-base">Takes less than 5 minutes to set up.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <FadeIn key={step.number} delay={i * 0.1}>
                <div className="card p-8 h-full">
                  <div className="text-xs font-mono text-zinc-600 mb-4">{step.number}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-6">{step.description}</p>
                  {step.visual}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 py-24 section-gradient">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need, nothing you don&apos;t</h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.06}>
                <div className="card p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-5 text-zinc-400">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-[15px]">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-4">Why changelog.dev</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">GitHub Releases alone aren&apos;t enough</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <div className="card !bg-transparent p-8 h-full border-red-500/10">
                <div className="flex items-center gap-2.5 mb-8">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <span className="text-red-400 text-sm">&#10005;</span>
                  </div>
                  <span className="font-semibold text-zinc-400 text-sm">Without changelog.dev</span>
                </div>
                <div className="space-y-5">
                  {comparisons.map((c) => (
                    <div key={c.without} className="text-sm text-zinc-600 flex gap-3">
                      <span className="text-red-500/30 shrink-0 mt-0.5">&#9679;</span>
                      {c.without}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="card p-8 h-full border-emerald-500/10 !bg-emerald-500/[0.02]">
                <div className="flex items-center gap-2.5 mb-8">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm">&#10003;</span>
                  </div>
                  <span className="font-semibold text-zinc-300 text-sm">With changelog.dev</span>
                </div>
                <div className="space-y-5">
                  {comparisons.map((c) => (
                    <div key={c.with} className="text-sm text-zinc-400 flex gap-3">
                      <span className="text-emerald-400/50 shrink-0 mt-0.5">&#9679;</span>
                      {c.with}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Developer Tools */}
      <section className="px-6 py-24 section-gradient">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-4">Developer tools</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Integrate however you want</h2>
            <p className="mt-3 text-zinc-500 text-base max-w-lg mx-auto">
              CLI, GitHub Actions, REST API, or embeddable widget.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-5">
            {devTools.map((tool, i) => (
              <FadeIn key={tool.name} delay={i * 0.08}>
                <div className="card p-6 h-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white">{tool.name}</h3>
                    <a
                      href={tool.link}
                      target={tool.link.startsWith('/') ? undefined : '_blank'}
                      rel={tool.link.startsWith('/') ? undefined : 'noopener noreferrer'}
                      className="text-xs text-zinc-600 hover:text-white transition-colors"
                    >
                      {tool.linkText} &#8599;
                    </a>
                  </div>
                  <p className="text-zinc-500 text-sm mb-4">{tool.desc}</p>
                  <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed text-zinc-400">
                    <pre className="whitespace-pre-wrap">{tool.code}</pre>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="text-center mt-10">
            <Link href="/docs/api" className="btn-secondary text-sm !py-2.5 !px-6">
              Read the API docs
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
            <p className="mt-3 text-zinc-500 text-base">Start free. Upgrade when you grow.</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <div className="card p-8 h-full">
                <div className="text-sm font-medium text-zinc-400 mb-2">Free</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">$0</span>
                </div>
                <div className="text-zinc-600 text-sm mb-8">forever</div>
                <ul className="space-y-3.5 text-sm text-zinc-400 mb-10">
                  {["1 changelog", "100 subscribers", "changelog.dev subdomain", "AI-generated entries", "GitHub integration", "RSS feed"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn-secondary w-full text-center text-sm">
                  Get started free
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="card p-8 h-full relative !border-white/[0.15]">
                <div className="absolute -top-3 left-8">
                  <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-400 mb-2">Pro</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-zinc-600 text-sm">/mo</span>
                </div>
                <div className="text-zinc-600 text-sm mb-8">billed monthly</div>
                <ul className="space-y-3.5 text-sm text-zinc-400 mb-10">
                  {["Unlimited changelogs", "Unlimited subscribers", "Custom domain", "Custom branding", "Remove branding", "Priority support"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn-primary w-full text-center text-sm">
                  Start with Pro
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Price comparison */}
          <FadeIn delay={0.3} className="mt-12">
            <div className="card p-8">
              <h3 className="font-semibold text-white mb-6 text-center">Compare with alternatives</h3>
              <div className="space-y-4">
                {[
                  { name: "Beamer", price: "$49/mo", width: "90%" },
                  { name: "Canny", price: "$79/mo", width: "100%" },
                  { name: "LaunchNotes", price: "$59/mo", width: "95%" },
                  { name: "changelog.dev", price: "Free / $29", width: "35%", highlight: true },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className={`text-sm w-28 shrink-0 ${item.highlight ? 'text-white font-semibold' : 'text-zinc-500'}`}>
                      {item.name}
                    </span>
                    <div className="flex-1 h-7 bg-zinc-900 rounded-lg overflow-hidden">
                      <div
                        className={`h-full rounded-lg flex items-center px-3 text-xs font-medium ${item.highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}
                        style={{ width: item.width }}
                      >
                        {item.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-700 text-center mt-4">Based on public pricing for starter tiers</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-32">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Your users want to know
            <br />
            <span className="text-zinc-500">what you&apos;ve been building</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            A changelog is the simplest way to show momentum, build trust, and reduce churn.
          </p>
          <Link href="/login" className="btn-primary text-lg !py-4 !px-10">
            Start free today
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-zinc-700 text-xs mt-4">No credit card &middot; Free forever for small teams</p>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
            <div>
              <span className="font-semibold text-white text-sm">Product</span>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/demo" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">Demo</Link>
                <Link href="#pricing" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">Pricing</Link>
                <Link href="/docs/api" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">API Docs</Link>
                <Link href="/changelog-dev" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">Changelog</Link>
              </div>
            </div>
            <div>
              <span className="font-semibold text-white text-sm">Developer</span>
              <div className="mt-4 flex flex-col gap-3">
                <a href="https://www.npmjs.com/package/changelogdev-cli" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">CLI &#8599;</a>
                <a href="https://www.npmjs.com/package/changelogdev-widget" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">Widget &#8599;</a>
                <a href="https://github.com/NikitaDmitrieff/changelog-action" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">GitHub Action &#8599;</a>
                <Link href="/docs/api" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">REST API</Link>
              </div>
            </div>
            <div>
              <span className="font-semibold text-white text-sm">Open Source</span>
              <div className="mt-4 flex flex-col gap-3">
                <a href="https://github.com/NikitaDmitrieff/changelog-dev" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">GitHub &#8599;</a>
                <a href="https://www.npmjs.com/package/changelogdev-widget" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">npm &#8599;</a>
              </div>
            </div>
            <div>
              <span className="font-semibold text-white text-sm">Company</span>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">Sign in</Link>
                <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">Sign up</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-zinc-700">changelog.dev</span>
            <span className="text-xs text-zinc-800">&copy; {new Date().getFullYear()} changelog.dev. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
