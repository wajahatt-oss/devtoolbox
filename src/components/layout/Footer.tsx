'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { Zap } from 'lucide-react'
import { tools } from '@/lib/tools'

const subscribeToYear = () => () => {}
const getCurrentYear = () => new Date().getFullYear()
const getServerYear = () => null

export function Footer() {
  const year = useSyncExternalStore(subscribeToYear, getCurrentYear, getServerYear)
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <Zap className="h-5 w-5 text-indigo-500" />
              <span className="text-gray-900 dark:text-white">DevToolBox</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Free, fast, and privacy-friendly developer tools. All processing happens in your browser.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tools</h3>
            <ul className="space-y-2">
              {tools.slice(0, 7).map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-400">
          <p>© {year ?? ''} DevToolBox. Your tool inputs are processed in your browser.</p>
        </div>
      </div>
    </footer>
  )
}
