'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Zap, Shield, Globe, ArrowRight } from 'lucide-react'
import { tools, searchTools } from '@/lib/tools'
import { ToolCard } from '@/components/tools/ToolCard'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const filtered = query.trim() ? searchTools(query) : tools

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            100% free · runs in your browser · no signup required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Everything Developers Need,<br className="hidden sm:block" /> In One Place.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Fast, free, and easy-to-use online tools for developers. Format JSON, decode JWTs, generate UUIDs, and more — all processed locally in your browser.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {query.trim() ? `Results for "${query}"` : 'All Tools'}
          </h2>
          {!query && (
            <Link href="/tools" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">No tools found for &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">Why DevToolBox?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6 text-indigo-500" />,
                title: 'Instant Results',
                desc: 'All tools run entirely in your browser. No server round-trips, no waiting.',
              },
              {
                icon: <Shield className="h-6 w-6 text-indigo-500" />,
                title: 'Private & Secure',
                desc: 'Your data never leaves your device. We never log, store, or transmit your input.',
              },
              {
                icon: <Globe className="h-6 w-6 text-indigo-500" />,
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
    </>
  )
}
