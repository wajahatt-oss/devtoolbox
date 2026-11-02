'use client'

import { useState } from 'react'
import { Download, Trash2 } from 'lucide-react'
import { formatJSON, minifyJSON, type IndentSize } from '@/lib/tools/json-formatter'
import { getToolBySlug, tools } from '@/lib/tools'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { CopyButton } from '@/components/tools/CopyButton'
import { downloadTextFile, cn } from '@/lib/utils'

const EXAMPLE = `{"name":"DevToolBox","version":"1.0.0","tools":["JSON Formatter","JWT Decoder","UUID Generator"],"active":true}`

export function JsonFormatterClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState<IndentSize>(2)
  const [mode, setMode] = useState<'format' | 'minify'>('format')

  const tool = getToolBySlug('json-formatter')!
  const related = tools.filter((t) => t.slug !== 'json-formatter').slice(0, 3)

  function handleFormat() {
    const result = mode === 'format' ? formatJSON(input, indent) : minifyJSON(input)
    if (result.success) {
      setOutput(result.output)
      setError('')
    } else {
      setError(result.error || 'Unknown error')
      setOutput('')
    }
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setError('')
  }

  function loadExample() {
    setInput(EXAMPLE)
    setError('')
    setOutput('')
  }

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
          {(['format', 'minify'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                mode === m
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {m === 'format' ? 'Format' : 'Minify'}
            </button>
          ))}
        </div>

        {mode === 'format' && (
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value) as IndentSize)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        )}

        <button
          onClick={loadExample}
          className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Load Example
        </button>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="json-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">Input JSON</label>
            <button onClick={handleClear} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...'
            className="h-80 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span id="json-output-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</span>
            <div className="flex items-center gap-2">
              <CopyButton text={output} />
              {output && (
                <button
                  onClick={() => downloadTextFile(output, 'formatted.json')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              )}
            </div>
          </div>
          <pre aria-labelledby="json-output-label" aria-live="polite" className={cn(
            'h-80 w-full p-3 rounded-lg border overflow-auto whitespace-pre-wrap break-words text-sm',
            error
              ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
          )}>
            {error || output || <span className="text-gray-400">Output will appear here...</span>}
          </pre>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleFormat}
          disabled={!input.trim()}
          className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          {mode === 'format' ? 'Format JSON' : 'Minify JSON'}
        </button>
      </div>

      {/* Instructions */}
      <section className="mt-10 prose prose-gray dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to use the JSON Formatter</h2>
        <ol className="text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside text-sm">
          <li>Paste your JSON into the input box on the left.</li>
          <li>Choose <strong>Format</strong> to beautify or <strong>Minify</strong> to compact the JSON.</li>
          <li>Select your preferred indentation (2 or 4 spaces).</li>
          <li>Click the button and see the result on the right.</li>
          <li>Use Copy or Download to save your result.</li>
        </ol>
      </section>
    </ToolLayout>
  )
}
