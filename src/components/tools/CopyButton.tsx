'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
  label?: string
}

export function CopyButton({ text, className, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setCopyError('')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
      setCopyError('Clipboard access failed. Select and copy the text manually.')
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
        'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
        'text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed',
        className
      )}
      aria-label={copied ? 'Copied!' : label}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied!' : label}
    </button>
    {copyError && <span role="status" className="text-xs text-red-600 dark:text-red-400">{copyError}</span>}
    </span>
  )
}
