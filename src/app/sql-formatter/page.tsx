'use client'

import { useState } from 'react'
import { Trash2, Download } from 'lucide-react'
import { getToolBySlug, tools } from '@/lib/tools'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { CopyButton } from '@/components/tools/CopyButton'
import { downloadTextFile, cn } from '@/lib/utils'

const EXAMPLE = `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' AND u.active = true GROUP BY u.id, u.name, u.email ORDER BY order_count DESC LIMIT 10;`

export default function SqlFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [keywordCase, setKeywordCase] = useState<'upper' | 'lower'>('upper')
  const [indentSize, setIndentSize] = useState(2)
  const [loading, setLoading] = useState(false)

  const tool = getToolBySlug('sql-formatter')!
  const related = tools.filter((t) => t.slug !== 'sql-formatter').slice(0, 3)

  async function handleFormat() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      // Dynamically import sql-formatter to avoid loading on other pages
      const { format } = await import('sql-formatter')
      const formatted = format(input, {
        language: 'sql',
        tabWidth: indentSize,
        keywordCase,
      })
      setOutput(formatted)
    } catch (e) {
      setError(`Formatting failed: ${(e as Error).message}`)
      setOutput('')
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Keywords:</label>
          <select
            value={keywordCase}
            onChange={(e) => setKeywordCase(e.target.value as 'upper' | 'lower')}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
          >
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Indent:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
        <button
          onClick={() => { setInput(EXAMPLE); setOutput(''); setError('') }}
          className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Load Example
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SQL Input</label>
            <button onClick={handleClear} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query here..."
            className="h-80 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Formatted SQL</label>
            <div className="flex items-center gap-2">
              <CopyButton text={output} />
              {output && (
                <button
                  onClick={() => downloadTextFile(output, 'formatted.sql')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              )}
            </div>
          </div>
          <pre className={cn(
            'h-80 w-full p-3 rounded-lg border overflow-auto whitespace-pre-wrap break-words text-sm',
            error
              ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
          )}>
            {error || output || <span className="text-gray-400">Formatted SQL will appear here...</span>}
          </pre>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleFormat}
          disabled={!input.trim() || loading}
          className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          {loading ? 'Formatting...' : 'Format SQL'}
        </button>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to use the SQL Formatter</h2>
        <ol className="text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside text-sm">
          <li>Paste your SQL query into the input box.</li>
          <li>Choose keyword casing (UPPERCASE or lowercase).</li>
          <li>Select indentation size.</li>
          <li>Click Format SQL to see the result.</li>
        </ol>
      </section>
    </ToolLayout>
  )
}
