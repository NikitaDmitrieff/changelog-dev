import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Why We Chose Web Components Over React for Our Embeddable Widget | Changelog.dev',
  description:
    'A deep dive into why we built our embeddable changelog widget with Web Components instead of React. Shadow DOM isolation, zero dependencies, under 8KB gzipped, and works with every framework.',
  openGraph: {
    title: 'Why We Chose Web Components Over React for Our Embeddable Widget',
    description:
      'Shadow DOM isolation, zero dependencies, under 8KB gzipped. Here is why Web Components beat React for embeddable widgets in 2026.',
    type: 'article',
    url: 'https://www.changelogdev.com/blog/why-web-components-over-react',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why We Chose Web Components Over React for Our Embeddable Widget',
    description:
      'Shadow DOM isolation, zero dependencies, under 8KB gzipped. Here is why Web Components beat React for embeddable widgets in 2026.',
  },
}

export default function WebComponentsVsReactPost() {
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
              Engineering
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <time className="text-zinc-600 text-xs">March 2026</time>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-zinc-600 text-xs">6 min read</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Why We Chose Web Components Over React for Our Embeddable Widget
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            We needed a changelog widget that works everywhere &mdash; React apps, Vue dashboards,
            static sites, WordPress, Shopify, vanilla HTML. Here is why Web Components were the
            only serious option, and what we learned building one from scratch.
          </p>
        </div>

        <div className="prose-custom space-y-6 text-zinc-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The problem: one widget, every environment</h2>
          <p>
            Changelog.dev lets teams publish product updates. But a changelog nobody sees is
            worthless. We needed an embeddable widget &mdash; a small bell icon that sits on your
            site, shows a popover of recent updates, and tracks unread entries. Two constraints
            made this harder than it sounds:
          </p>
          <ul className="list-none space-y-2 text-zinc-400">
            <li><span className="text-zinc-500 mr-2">1.</span>The widget must work on <strong className="text-zinc-200">any website</strong>, regardless of framework, build tool, or CSS methodology.</li>
            <li><span className="text-zinc-500 mr-2">2.</span>The widget must <strong className="text-zinc-200">never break the host page</strong> &mdash; and the host page must never break the widget.</li>
          </ul>
          <p>
            That second constraint is the killer. If you have ever embedded a third-party script
            that mangled your layout or inherited your font sizes, you know exactly what we mean.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Why React widgets are problematic</h2>
          <p>
            Our main app is built with Next.js. The obvious first instinct was to ship the widget
            as a React component. We prototyped it. Within a day we had a list of problems that
            would never go away:
          </p>
          <ul className="list-none space-y-2 text-zinc-400">
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Bundle size</strong> &mdash; Even with{' '}
              <span className="font-mono text-xs text-zinc-300">react</span> and{' '}
              <span className="font-mono text-xs text-zinc-300">react-dom</span> marked as
              peer dependencies, we were looking at 40KB+ minified just for the runtime. If the
              host page does not use React, they are downloading an entire framework for a bell icon.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Version conflicts</strong> &mdash; Host page runs
              React 17. Our widget needs React 18. Or worse, the host uses Preact with the compat
              layer. Multiple React instances on a single page cause subtle, maddening bugs with
              event delegation and state.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Style collisions</strong> &mdash; React has no
              built-in style encapsulation. CSS Modules help inside your own app. They do nothing
              when your component is injected into a stranger&apos;s page with a global{' '}
              <span className="font-mono text-xs text-zinc-300">* {'{'}margin: 0{'}'}</span> reset
              or aggressive Tailwind utilities.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Framework lock-in</strong> &mdash; A React widget
              is useless to Vue, Svelte, Angular, Astro, and plain HTML users without a wrapper.
              That is most of the web.
            </li>
          </ul>
          <p>
            The same problems apply to Vue, Svelte, or any framework-based widget. You are
            shipping framework opinions into someone else&apos;s codebase. The math does not work.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Why Web Components won</h2>
          <p>
            Web Components are a set of browser-native APIs: Custom Elements, Shadow DOM, and
            HTML Templates. They have been stable across all major browsers since 2020. In 2026,
            they are boring technology &mdash; which is exactly what you want for infrastructure
            that must work everywhere.
          </p>
          <p>Here is what made the decision obvious:</p>
          <ul className="list-none space-y-2 text-zinc-400">
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Shadow DOM isolation</strong> &mdash; The widget&apos;s
              DOM tree and styles are completely encapsulated. The host page&apos;s CSS cannot reach
              in. The widget&apos;s CSS cannot leak out. This is not a convention or a build tool
              trick &mdash; it is enforced by the browser engine.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Zero dependencies</strong> &mdash; No React, no
              Vue, no runtime. The browser <em>is</em> the framework. Our final bundle is 7.2KB
              gzipped.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Framework-agnostic by default</strong> &mdash;{' '}
              <span className="font-mono text-xs text-zinc-300">&lt;changelog-widget&gt;</span>{' '}
              is just an HTML element. It works in React JSX, Vue templates, Svelte markup,
              Angular templates, PHP includes, WordPress shortcodes, and raw HTML files. No
              wrappers, no adapters.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Native lifecycle</strong> &mdash;{' '}
              <span className="font-mono text-xs text-zinc-300">connectedCallback</span>,{' '}
              <span className="font-mono text-xs text-zinc-300">disconnectedCallback</span>, and{' '}
              <span className="font-mono text-xs text-zinc-300">attributeChangedCallback</span>{' '}
              give us everything we need to mount, unmount, and react to configuration changes
              without a virtual DOM diffing layer.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Long-term stability</strong> &mdash; Web Components
              are a W3C standard implemented in every browser. React 18 APIs are not the same as
              React 17 APIs. Web Component APIs from 2020 still work identically in 2026 and will
              in 2030.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Technical deep-dive: how the widget works</h2>
          <p>
            The entire widget is a single Custom Element registered with the browser. Here is the
            core structure, simplified:
          </p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4">
            <div className="text-zinc-500">// Register the custom element</div>
            <div className="text-zinc-400">class ChangelogWidget extends HTMLElement {'{'}</div>
            <div className="pl-4">
              <div className="text-zinc-500">// Declare which attributes trigger re-renders</div>
              <div className="text-emerald-400">static get observedAttributes() {'{'}</div>
              <div className="pl-4 text-zinc-300">return [&apos;project-id&apos;, &apos;theme&apos;, &apos;position&apos;, &apos;accent-color&apos;];</div>
              <div className="text-emerald-400">{'}'}</div>
            </div>
            <div className="mt-3 pl-4">
              <div className="text-emerald-400">constructor() {'{'}</div>
              <div className="pl-4 text-zinc-300">super();</div>
              <div className="pl-4 text-zinc-500">// Attach Shadow DOM -- this is the key to isolation</div>
              <div className="pl-4 text-zinc-300">this.shadow = this.attachShadow({'{'} mode: &apos;open&apos; {'}'});</div>
              <div className="text-emerald-400">{'}'}</div>
            </div>
            <div className="mt-3 pl-4">
              <div className="text-emerald-400">connectedCallback() {'{'}</div>
              <div className="pl-4 text-zinc-500">// Called when the element is added to the DOM</div>
              <div className="pl-4 text-zinc-300">this.render();</div>
              <div className="pl-4 text-zinc-300">this.fetchEntries();</div>
              <div className="text-emerald-400">{'}'}</div>
            </div>
            <div className="mt-3 pl-4">
              <div className="text-emerald-400">attributeChangedCallback(name, oldVal, newVal) {'{'}</div>
              <div className="pl-4 text-zinc-500">// Re-render when attributes change at runtime</div>
              <div className="pl-4 text-zinc-300">if (oldVal !== newVal) this.render();</div>
              <div className="text-emerald-400">{'}'}</div>
            </div>
            <div className="mt-3 pl-4">
              <div className="text-emerald-400">disconnectedCallback() {'{'}</div>
              <div className="pl-4 text-zinc-500">// Clean up event listeners, abort pending fetches</div>
              <div className="pl-4 text-zinc-300">this.controller?.abort();</div>
              <div className="text-emerald-400">{'}'}</div>
            </div>
            <div className="text-zinc-400">{'}'}</div>
            <div className="mt-3 text-zinc-500">// Register as &lt;changelog-widget&gt;</div>
            <div className="text-zinc-300">customElements.define(&apos;changelog-widget&apos;, ChangelogWidget);</div>
          </div>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Shadow DOM: the real differentiator</h2>
          <p>
            Shadow DOM deserves its own section because it is the single feature that makes
            embeddable widgets viable. Without it, you are playing whack-a-mole with CSS
            specificity forever.
          </p>
          <p>
            When we call <span className="font-mono text-xs text-zinc-300">this.attachShadow({'{'} mode: &apos;open&apos; {'}'})</span>,
            the browser creates an isolated DOM subtree. The widget&apos;s styles are defined
            inside a <span className="font-mono text-xs text-zinc-300">&lt;style&gt;</span> tag
            within the shadow root:
          </p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4">
            <div className="text-emerald-400">render() {'{'}</div>
            <div className="pl-4 text-zinc-300">this.shadow.innerHTML = `</div>
            <div className="pl-6 text-zinc-400">&lt;style&gt;</div>
            <div className="pl-8 text-zinc-500">/* These styles ONLY apply inside the shadow root */</div>
            <div className="pl-8 text-zinc-300">:host {'{'} position: relative; display: inline-block; {'}'}</div>
            <div className="pl-8 text-zinc-300">.trigger {'{'} all: initial; cursor: pointer; ... {'}'}</div>
            <div className="pl-8 text-zinc-300">.popover {'{'} position: absolute; z-index: 999999; ... {'}'}</div>
            <div className="pl-8 text-zinc-300">.entry {'{'} padding: 12px 16px; border-bottom: 1px solid ... {'}'}</div>
            <div className="pl-6 text-zinc-400">&lt;/style&gt;</div>
            <div className="pl-6 text-emerald-400">&lt;button class=&quot;trigger&quot; aria-label=&quot;View updates&quot;&gt;</div>
            <div className="pl-8 text-zinc-300">${'{'} this.bellIcon {'}'}</div>
            <div className="pl-8 text-zinc-300">${'{'} this.unreadCount &gt; 0 ? this.badgeHTML : &apos;&apos; {'}'}</div>
            <div className="pl-6 text-emerald-400">&lt;/button&gt;</div>
            <div className="pl-6 text-emerald-400">&lt;div class=&quot;popover&quot; role=&quot;dialog&quot; hidden&gt;</div>
            <div className="pl-8 text-zinc-300">${'{'} this.renderEntries() {'}'}</div>
            <div className="pl-6 text-emerald-400">&lt;/div&gt;</div>
            <div className="pl-4 text-zinc-300">`;</div>
            <div className="text-emerald-400">{'}'}</div>
          </div>
          <p>
            The <span className="font-mono text-xs text-zinc-300">:host</span> selector targets
            the custom element itself. The <span className="font-mono text-xs text-zinc-300">all: initial</span>{' '}
            on the trigger button resets every inherited property &mdash; this prevents the host
            page&apos;s global styles from affecting our button&apos;s appearance. The host
            page&apos;s <span className="font-mono text-xs text-zinc-300">.trigger</span> class
            is a completely different thing. No collision. No specificity wars.
          </p>
          <p>
            We tested this on pages with Tailwind&apos;s preflight reset, Bootstrap 5, older
            Foundation grids, and several WordPress themes with aggressive global selectors. The
            widget rendered identically on every single one.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Observed attributes: reactive without a framework</h2>
          <p>
            The <span className="font-mono text-xs text-zinc-300">observedAttributes</span> static
            getter and <span className="font-mono text-xs text-zinc-300">attributeChangedCallback</span>{' '}
            give us a reactive system that would feel familiar to anyone who has used React props
            or Vue props &mdash; except it is built into the browser:
          </p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4">
            <div className="text-zinc-500">// Change the theme at runtime -- works from any framework</div>
            <div className="text-zinc-300">document.querySelector(&apos;changelog-widget&apos;)</div>
            <div className="text-zinc-300">  .setAttribute(&apos;theme&apos;, &apos;light&apos;);</div>
            <div className="mt-3 text-zinc-500">// Or in React JSX:</div>
            <div className="text-emerald-400">&lt;changelog-widget</div>
            <div className="pl-4 text-zinc-300">project-id=&quot;my-app&quot;</div>
            <div className="pl-4 text-zinc-300">theme={'{'}darkMode ? &apos;dark&apos; : &apos;light&apos;{'}'}</div>
            <div className="text-emerald-400">/&gt;</div>
            <div className="mt-3 text-zinc-500">// Or in Vue:</div>
            <div className="text-emerald-400">&lt;changelog-widget</div>
            <div className="pl-4 text-zinc-300">project-id=&quot;my-app&quot;</div>
            <div className="pl-4 text-zinc-300">:theme=&quot;darkMode ? &apos;dark&apos; : &apos;light&apos;&quot;</div>
            <div className="text-emerald-400">/&gt;</div>
          </div>
          <p>
            When the attribute changes, the browser calls{' '}
            <span className="font-mono text-xs text-zinc-300">attributeChangedCallback</span>{' '}
            automatically. We re-render. No state management library, no subscription system, no
            virtual DOM diff. The browser handles the observation for us.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">The results</h2>
          <p>
            After shipping the Web Component version and deprecating the React prototype, here is
            where we landed:
          </p>
          <ul className="list-none space-y-2 text-zinc-400">
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">7.2KB gzipped</strong> &mdash; down from 43KB
              with the React version. That is a 6x reduction. On slow 3G, this is the difference
              between imperceptible and annoying.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Zero CSS conflicts</strong> &mdash; we have not
              received a single bug report about style collisions since switching to Shadow DOM.
              With the React version, we had a new one every week.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Works everywhere</strong> &mdash; confirmed working
              in React 17/18/19, Vue 3, Svelte 4/5, Angular 17, Astro, WordPress, Shopify Liquid
              templates, Hugo, Jekyll, and plain HTML.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">No version conflicts</strong> &mdash; there is no
              runtime to conflict with. If the browser supports Custom Elements (every browser
              since 2020), it works.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Simpler maintenance</strong> &mdash; one file,
              no transpilation required, no JSX, no build step for the widget itself. We use a
              single esbuild invocation to minify and that is it.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">When you should still use React</h2>
          <p>
            Web Components are not a replacement for React. They solve different problems. Here is
            when React is still the better choice:
          </p>
          <ul className="list-none space-y-2 text-zinc-400">
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Complex application UIs</strong> &mdash; if you
              are building a dashboard with dozens of interactive views, data tables, forms with
              validation, drag-and-drop, and real-time updates, React&apos;s component model,
              hooks, and ecosystem save enormous amounts of time.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Server-side rendering</strong> &mdash; Web Components
              do not render on the server. If SEO or initial page load performance of the component
              content matters, frameworks with SSR support (Next.js, Nuxt, SvelteKit) are better.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Rich state management</strong> &mdash; once your
              widget needs to manage complex interdependent state, you are essentially rebuilding
              a framework inside your Custom Element. At that point, ship a framework.
            </li>
            <li>
              <span className="text-zinc-500 mr-2">+</span>
              <strong className="text-zinc-200">Team velocity</strong> &mdash; if your entire team
              knows React and nobody has touched Web Components, the learning curve is a real cost.
              For internal tools, use whatever your team is fastest with.
            </li>
          </ul>
          <p>
            Our rule of thumb: if the component lives <em>inside</em> your app, use your
            app&apos;s framework. If it lives <em>on other people&apos;s</em> apps, use Web
            Components.
          </p>

          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Try it yourself</h2>
          <p>
            The changelog widget is open source, MIT licensed, and free to use. Add it to your
            site in two lines:
          </p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4">
            <div className="text-emerald-400">&lt;script src=&quot;https://unpkg.com/changelogdev-widget&quot;&gt;&lt;/script&gt;</div>
            <div className="text-zinc-400">&lt;changelog-widget project-id=&quot;your-project&quot; /&gt;</div>
          </div>
          <p>Or install from npm:</p>
          <div className="rounded-md border border-white/[0.06] bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed my-4">
            <div className="text-zinc-300">npm install changelogdev-widget</div>
          </div>
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
            <a
              href="https://www.changelogdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/[0.12] hover:border-white/[0.25] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-all text-sm"
            >
              Changelog.dev ↗
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
