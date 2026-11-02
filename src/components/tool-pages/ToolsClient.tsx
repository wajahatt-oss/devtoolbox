'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { tools, categories, searchTools, getToolsByCategory } from '@/lib/tools'
import { ToolCard } from '@/components/tools/ToolCard'
import { cn } from '@/lib/utils'
import { AdSenseUnit } from '@/components/ads/AdSenseUnit'

export function ToolsClient() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = query.trim()
    ? searchTools(query)
    : activeCategory
    ? getToolsByCategory(activeCategory)
    : tools

  return (
    <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Developer Tools</h1>
        <p className="text-gray-600 dark:text-gray-400">Browse all free developer utilities. Everything runs in your browser.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          id="tools-search"
          type="search"
          placeholder="Search tools..."
          aria-label="Search developer tools"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category filters */}
      {!query.trim() && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            aria-pressed={!activeCategory}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              !activeCategory
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p role="status" className="py-12 text-center text-gray-500 dark:text-gray-400">No tools found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tool, index) => (
            <div key={tool.slug} className={index === 5 ? 'contents' : undefined}>
              <ToolCard tool={tool} />
              {index === 5 && (
                <div className="col-span-full">
                  <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_TOOLS_SLOT} placement="tools-directory-between-cards" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
