import Link from 'next/link'
import type { Tool } from '@/lib/tools'
import { ArrowRight } from 'lucide-react'

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group flex flex-col gap-3 p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl" aria-hidden="true">{tool.icon}</span>
        {tool.popular && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            Popular
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {tool.description}
        </p>
      </div>
      <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-auto">
        Open tool <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  )
}
