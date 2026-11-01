'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'

const tools = [
  { href: '/json-formatter', label: 'JSON Formatter' },
  { href: '/jwt-decoder', label: 'JWT Decoder' },
  { href: '/uuid-generator', label: 'UUID Generator' },
  { href: '/base64-encoder-decoder', label: 'Base64 Encoder/Decoder' },
  { href: '/sql-formatter', label: 'SQL Formatter' },
]

export function Footer() {
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
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {tool.label}
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
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 DevToolBox. All tools run in your browser. No data is sent to any server.</p>
        </div>
      </div>
    </footer>
  )
}
