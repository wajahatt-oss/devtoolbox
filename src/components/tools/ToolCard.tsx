import Link from 'next/link'
import { getToolHref, type Tool } from '@/lib/tools'
import { ArrowRight } from 'lucide-react'

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={getToolHref(tool)}
      className="group flex flex-col gap-3 p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl" aria-hidden="true">{tool.icon}</span>
        <div className="flex gap-1.5">
          {tool.recent && <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">New</span>}
          {tool.popular && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">Popular</span>}
        </div>
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
