'use client'

import { useMemo, useRef, useState } from 'react'
import type { ElementType, ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { CopyButton } from '@/components/tools/CopyButton'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { compareText, convertTimestamp, decodeUrl, encodeUrl, formatHtml, formatXml, generateHash, jsonToCsv, minifyCss, parseMarkdown, testRegex, type DigestAlgorithm, type MarkdownInline } from '@/lib/tools/new-tools'
import { getToolBySlug, tools } from '@/lib/tools'
import { cn } from '@/lib/utils'

const areaClass = 'min-h-64 w-full resize-y rounded-xl border border-gray-300 bg-white p-3 font-mono text-sm leading-6 text-gray-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
const labelClass = 'mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200'
const buttonClass = 'rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50'
function InlineMarkdown({ parts }: { parts: MarkdownInline[] }) {
  return parts.map((part, index) => {
    if (part.kind === 'code') return <code key={index} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">{part.text}</code>
    if (part.kind === 'strong') return <strong key={index}>{part.text}</strong>
    if (part.kind === 'emphasis') return <em key={index}>{part.text}</em>
    return <span key={index}>{part.text}</span>
  })
}

function MarkdownPreview({ source }: { source: string }) {
  const { blocks, error } = useMemo(() => {
    try {
      return { blocks: parseMarkdown(source), error: '' }
    } catch (caught) {
      return { blocks: [], error: (caught as Error).message }
    }
  }, [source])

  if (!source) return <p className="text-sm text-gray-400">Your rendered Markdown will appear here.</p>
  if (error) return <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
  return (
    <div className="space-y-3 break-words text-gray-800 dark:text-gray-100">
      {blocks.map((block, index): ReactNode => {
        if (block.kind === 'heading') {
          const Heading = `h${block.level}` as ElementType
          return <Heading key={index} className="text-xl font-bold"><InlineMarkdown parts={block.content} /></Heading>
        }
        if (block.kind === 'code') return <pre key={index} className="overflow-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800"><code>{block.text}</code></pre>
        if (block.kind === 'quote') return <blockquote key={index} className="border-l-4 border-indigo-400 pl-3 text-gray-600 dark:text-gray-300"><InlineMarkdown parts={block.content} /></blockquote>
        if (block.kind === 'unordered-list') return <ul key={index} className="list-inside list-disc"><li><InlineMarkdown parts={block.content} /></li></ul>
        if (block.kind === 'ordered-list') return <ol key={index} className="list-inside list-decimal"><li><InlineMarkdown parts={block.content} /></li></ol>
        return <p key={index}><InlineMarkdown parts={block.content} /></p>
      })}
    </div>
  )
}

export function NewToolClient({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug)
  const activeRun = useRef(0)
  const [input, setInput] = useState('')
  const [secondInput, setSecondInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [algorithm, setAlgorithm] = useState<DigestAlgorithm>('SHA-256')

  if (!tool) return null
  const related = tools.filter((item) => item.slug !== slug).slice(0, 3)

  function run(action: () => string | Promise<string>) {
    const runId = ++activeRun.current
    setError('')
    setOutput('')
    Promise.resolve()
      .then(action)
      .then((result) => {
        if (runId === activeRun.current) setOutput(result)
      })
      .catch((caught: unknown) => {
        if (runId === activeRun.current) setError(caught instanceof Error ? caught.message : 'The operation failed.')
      })
  }

  function textArea(label: string, value: string, onChange: (value: string) => void, placeholder: string) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <textarea
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={areaClass}
          spellCheck={false}
        />
      </div>
    )
  }

  function processButton(label: string, disabled = !input.trim()) {
    return <button type="button" onClick={() => run(operation)} disabled={disabled} className={buttonClass}>{label}</button>
  }

  function operation(): string | Promise<string> {
    switch (slug) {
      case 'url-encoder-decoder':
        return mode === 'encode' ? encodeUrl(input) : decodeUrl(input)
      case 'xml-formatter':
        return formatXml(input)
      case 'html-formatter':
        return formatHtml(input)
      case 'css-minifier':
        return minifyCss(input)
      case 'regex-tester': {
        const matches = testRegex(pattern, flags, input)
        return matches.length
          ? matches.map((match, index) => `Match ${index + 1} at ${match.index}: ${JSON.stringify(match.value)}${match.groups.length ? `\n  Groups: ${JSON.stringify(match.groups)}` : ''}`).join('\n\n')
          : 'No matches found.'
      }
      case 'json-to-csv':
        return jsonToCsv(input)
      case 'timestamp-converter':
        return JSON.stringify(convertTimestamp(input), null, 2)
      case 'hash-generator':
        return generateHash(input, algorithm)
      case 'diff-checker':
        return compareText(input, secondInput).map((line) => `${line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' '} ${line.text}`).join('\n')
      default:
        throw new Error('Unsupported tool.')
    }
  }

  function reset() {
    activeRun.current += 1
    setInput('')
    setSecondInput('')
    setOutput('')
    setError('')
    setMode('encode')
    setPattern('')
    setFlags('g')
    setAlgorithm('SHA-256')
  }

  const modeSwitcher = (
    <div className="flex w-fit overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700" aria-label="URL conversion mode">
      {(['encode', 'decode'] as const).map((item) => (
        <button key={item} type="button" onClick={() => { setMode(item); setError(''); setOutput('') }}
          aria-pressed={mode === item}
          className={cn('px-4 py-2 text-sm font-medium capitalize focus-visible:outline-2 focus-visible:outline-indigo-600', mode === item ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200')}>
          {item}
        </button>
      ))}
    </div>
  )

  let editor: ReactNode
  if (slug === 'regex-tester') {
    editor = (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
          <div><label className={labelClass} htmlFor="regex-pattern">Pattern</label><input id="regex-pattern" value={pattern} onChange={(event) => setPattern(event.target.value)} placeholder="e.g. \\b\\w+@\\w+\\.com\\b" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900" /></div>
          <div><label className={labelClass} htmlFor="regex-flags">Flags</label><input id="regex-flags" value={flags} onChange={(event) => setFlags(event.target.value)} aria-describedby="regex-flags-help" placeholder="gim" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-900" /><span id="regex-flags-help" className="text-xs text-gray-500">JavaScript flags</span></div>
        </div>
        {textArea('Test text', input, setInput, 'Enter text to test against the pattern...')}
        <div>{processButton('Test expression', !pattern || !input)}</div>
      </div>
    )
  } else if (slug === 'markdown-previewer') {
    editor = (
      <div className="grid gap-4 lg:grid-cols-2">
        {textArea('Markdown source', input, (value) => { setInput(value); setError('') }, '# A heading\n\nWrite **bold** text, a list, or `inline code`.')}
        <div><h2 className={labelClass}>Live preview</h2><div className="min-h-64 overflow-auto rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"><MarkdownPreview source={input} /></div></div>
      </div>
    )
  } else if (slug === 'diff-checker') {
    editor = (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          {textArea('Original text', input, setInput, 'Paste the original text...')}
          {textArea('Updated text', secondInput, setSecondInput, 'Paste the updated text...')}
        </div>
        {processButton('Compare text', !input.trim() && !secondInput.trim())}
      </div>
    )
  } else if (slug === 'url-encoder-decoder') {
    editor = <div className="space-y-4">{modeSwitcher}{textArea(mode === 'encode' ? 'Text to encode' : 'Encoded component', input, setInput, mode === 'encode' ? 'Enter text or a URL component...' : 'Paste percent-encoded text...')}{processButton(mode === 'encode' ? 'Encode component' : 'Decode component')}</div>
  } else if (slug === 'hash-generator') {
    editor = <div className="space-y-4"><div><label htmlFor="hash-algorithm" className={labelClass}>Algorithm</label><select id="hash-algorithm" value={algorithm} onChange={(event) => setAlgorithm(event.target.value as DigestAlgorithm)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"><option>SHA-1</option><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select></div>{textArea('Text to hash', input, setInput, 'Enter text to hash...')}{processButton('Generate hash')}</div>
  } else {
    const config: Record<string, { label: string; placeholder: string; action: string }> = {
      'xml-formatter': { label: 'XML input', placeholder: 'Paste XML to format...', action: 'Format XML' },
      'html-formatter': { label: 'HTML input', placeholder: 'Paste HTML to format...', action: 'Format HTML' },
      'css-minifier': { label: 'CSS input', placeholder: 'Paste CSS to minify...', action: 'Minify CSS' },
      'json-to-csv': { label: 'JSON array', placeholder: '[{"name":"Ada","role":"developer"}]', action: 'Convert to CSV' },
      'timestamp-converter': { label: 'Timestamp or date', placeholder: 'e.g. 1735689600 or 2025-01-01T00:00:00Z', action: 'Convert timestamp' },
    }
    const item = config[slug] ?? { label: 'Input', placeholder: 'Enter input...', action: 'Run' }
    editor = <div className="space-y-4">{textArea(item.label, input, setInput, item.placeholder)}{processButton(item.action)}</div>
  }

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      <section aria-label={`${tool.name} interface`} className="space-y-5">
        <div className="flex justify-end">
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Reset
          </button>
        </div>
        {editor}
        {(output || error) && slug !== 'markdown-previewer' && (
          <section aria-live="polite" aria-label="Tool result" className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{error ? 'Input error' : 'Result'}</h2>
              {!error && <CopyButton text={output} />}
            </div>
            <pre className={cn('max-h-[32rem] min-h-24 overflow-auto whitespace-pre-wrap break-words rounded-xl border p-4 font-mono text-sm leading-6', error ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300' : 'border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100')} role={error ? 'alert' : 'status'}>
              {error || output}
            </pre>
          </section>
        )}
      </section>
    </ToolLayout>
  )
}
