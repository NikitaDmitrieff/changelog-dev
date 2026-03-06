import Link from 'next/link'
import { WaitlistForm } from '@/components/WaitlistForm'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight">changelog.dev</span>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="#waitlist"
              className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get early access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            Now in early access
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
            A changelog your customers
            <br />
            <span className="text-indigo-400">actually read</span>
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
            Beautiful hosted changelog pages. Connect GitHub, AI drafts entries,
            your customers stay informed.
          </p>
          <div id="waitlist" className="max-w-md mx-auto">
            <WaitlistForm className="w-full" />
            <p className="text-white/30 text-xs mt-3">No credit card. Free tier forever.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest text-center mb-4">
            How it works
          </h2>
          <p className="text-2xl font-bold text-center mb-16">
            Ship updates. Keep customers in the loop.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Connect GitHub</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Link your repository and we pull in your recent commits automatically. Works with any public or private repo.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">AI drafts entries</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Claude reads your commits and writes customer-facing release notes in plain language. Edit or publish as-is.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Subscribers stay informed</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Visitors subscribe to your changelog page. Email notifications go out automatically when you publish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest text-center mb-4">
            Pricing
          </h2>
          <p className="text-2xl font-bold text-center mb-16">Simple, transparent pricing</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-lg font-semibold mb-1">Free</div>
              <div className="text-4xl font-bold mb-1">$0</div>
              <div className="text-white/40 text-sm mb-8">forever</div>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">+</span> 1 changelog
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">+</span> 100 subscribers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">+</span> changelog.dev subdomain
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">+</span> AI-generated entries
                </li>
              </ul>
              <Link
                href="#waitlist"
                className="mt-8 block text-center bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                Join waitlist
              </Link>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-8 relative">
              <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Popular
              </div>
              <div className="text-lg font-semibold mb-1">Pro</div>
              <div className="text-4xl font-bold mb-1">$29</div>
              <div className="text-white/40 text-sm mb-8">per month</div>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">+</span> Unlimited changelogs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">+</span> Unlimited subscribers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">+</span> Custom domain
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">+</span> No &ldquo;Powered by&rdquo; branding
                </li>
              </ul>
              <Link
                href="#waitlist"
                className="mt-8 block text-center bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                Join waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-white/40">
          <span>changelog.dev</span>
          <span>Built for founders who ship</span>
        </div>
      </footer>
    </div>
  )
}
