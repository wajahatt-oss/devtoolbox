'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

const navigationItems = [
  { href: '/tools', label: 'All Tools' },
  { href: '/json-formatter', label: 'JSON' },
  { href: '/jwt-decoder', label: 'JWT' },
  { href: '/uuid-generator', label: 'UUID' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
      >
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Zap aria-hidden="true" className="h-6 w-6 text-indigo-500" />
            <span className="text-gray-900 dark:text-white">DevToolBox</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!open} className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
