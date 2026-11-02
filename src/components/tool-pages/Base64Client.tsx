'use client'

import { useState } from 'react'
import { ArrowLeftRight, Trash2 } from 'lucide-react'
import { encodeBase64, decodeBase64 } from '@/lib/tools/base64'
import { getToolBySlug, tools } from '@/lib/tools'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { CopyButton } from '@/components/tools/CopyButton'
import { cn } from '@/lib/utils'

export function Base64Client() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const tool = getToolBySlug('base64-encoder-decoder')!
  const related = tools.filter((t) => t.slug !== 'base64-encoder-decoder').slice(0, 3)

  function handleProcess() {
    const result = mode === 'encode' ? encodeBase64(input) : decodeBase64(input)
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

  function swapMode() {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
    setInput(output)
    setOutput('')
    setError('')
  }

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      {/* Mode toggle */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setOutput(''); setError('') }}
              aria-pressed={mode === m}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors capitalize',
                mode === m
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {m}
            </button>
          ))}
        </div>
        {output && (
          <button onClick={swapMode} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            <ArrowLeftRight className="h-4 w-4" /> Swap
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="base64-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
            </label>
            <button onClick={handleClear} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
          <textarea
            id="base64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            className="h-64 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span id="base64-output-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </span>
            <CopyButton text={output} />
          </div>
          <pre aria-labelledby="base64-output-label" aria-live="polite" className={cn(
            'h-64 w-full p-3 rounded-lg border overflow-auto whitespace-pre-wrap break-words text-sm',
            error
              ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
          )}>
            {error || output || <span className="text-gray-400">Output will appear here...</span>}
          </pre>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleProcess}
          disabled={!input.trim()}
          className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors capitalize"
        >
          {mode} to {mode === 'encode' ? 'Base64' : 'Text'}
        </button>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About Base64</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Base64 is an encoding scheme that converts binary data into ASCII text. It is commonly used to embed images in HTML, transmit data in JSON APIs, and encode email attachments. This tool fully supports UTF-8 text.
        </p>
      </section>
    </ToolLayout>
  )
}
