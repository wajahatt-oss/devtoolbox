'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Zap, Shield, Globe, ArrowRight, Sparkles } from 'lucide-react'
import { tools, searchTools } from '@/lib/tools'
import { ToolCard } from '@/components/tools/ToolCard'
import { AdSenseUnit } from '@/components/ads/AdSenseUnit'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const filtered = query.trim() ? searchTools(query) : tools

  return (
    <>
      {/* Hero */}
      <main id="main-content">
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:border-gray-800 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-gray-900/80 dark:text-indigo-300">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Free developer tools · Private by design
          </div>
          <h1 className="mb-5 text-4xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
            The everyday tools developers need, <span className="text-indigo-600 dark:text-indigo-400">all in one place.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            Format data, compare text, and convert common developer formats with quick, focused utilities. Your input stays in your browser.
          </p>

          <div className="relative mx-auto max-w-xl">
            <label htmlFor="home-tool-search" className="sr-only">Search developer tools</label>
            <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="home-tool-search"
              type="search"
              placeholder="Search tools..."
              aria-describedby="home-search-hint"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-lg shadow-indigo-950/5 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <span id="home-search-hint" className="sr-only">Results update as you type.</span>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No account. No installation. No upload of your tool input.</p>
          </div>
        </div>
      </section>

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT} placement="homepage-below-hero" />

      {/* Tools grid */}
      <section aria-labelledby="all-tools-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 id="all-tools-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
            {query.trim() ? `Results for "${query}"` : 'All Tools'}
          </h2>
          {!query && (
            <Link href="/tools" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View all               <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          )}
        </div>

        {filtered.length === 0 ? (
          <p role="status" className="py-12 text-center text-gray-500 dark:text-gray-400">No tools found for &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="border-y border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 dark:text-white">Why DevToolBox?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap aria-hidden="true" className="h-6 w-6 text-indigo-500" />,
                title: 'Instant Results',
                desc: 'All tools run entirely in your browser. No server round-trips, no waiting.',
              },
              {
                icon: <Shield aria-hidden="true" className="h-6 w-6 text-indigo-500" />,
                title: 'Private & Secure',
                desc: 'Your data never leaves your device. We never log, store, or transmit your input.',
              },
              {
                icon: <Globe aria-hidden="true" className="h-6 w-6 text-indigo-500" />,
                title: 'Always Free',
                desc: 'Core tools are free forever. No account required to get started.',
              },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center gap-3 p-6 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </main>
    </>
  )
}
