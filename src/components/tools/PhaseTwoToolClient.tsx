'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { CopyButton } from '@/components/tools/CopyButton'
import { ToolLayout } from '@/components/tools/ToolLayout'
import {
  buildSqlQuery,
  describeCron,
  diffJson,
  explainRegex,
  generateTestJwt,
  nextCronRuns,
  validateApiRequestUrl,
  validateCron,
  type JsonChange,
  type JwtTestAlgorithm,
  type RegexToken,
  type SqlDialect,
  type SqlOperation,
} from '@/lib/tools/phase-two'
import { findRegexMatches, type RegexWorkerMatch } from '@/lib/tools/regex-worker-client'
import { getToolBySlug, tools } from '@/lib/tools'

const fieldClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
const textAreaClass = 'min-h-40 w-full resize-y rounded-xl border border-gray-300 bg-white p-3 font-mono text-sm leading-6 text-gray-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
const primaryButtonClass = 'rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButtonClass = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'

function usePageTools(slug: string) {
  const tool = getToolBySlug(slug)
  const sameCategory = tool
    ? tools.filter((item) => item.slug !== slug && item.category === tool.category)
    : []
  const related = sameCategory.length
    ? sameCategory.slice(0, 3)
    : tools.filter((item) => item.slug !== slug).slice(0, 3)
  return { tool, related }
}

function ToolError({ message }: { message: string }) {
  if (!message) return null
  return <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">{message}</p>
}

function JsonDiffTool() {
  const { tool, related } = usePageTools('json-diff')
  const [left, setLeft] = useState('{\n  "name": "Ada",\n  "active": true,\n  "items": [1, 2]\n}')
  const [right, setRight] = useState('{\n  "name": "Ada Lovelace",\n  "active": true,\n  "items": [1, 3],\n  "role": "developer"\n}')
  const [changes, setChanges] = useState<JsonChange[] | null>(null)
  const [error, setError] = useState('')
  if (!tool) return null

  function compare() {
    try {
      setChanges(diffJson(left, right))
      setError('')
    } catch (caught) {
      setChanges(null)
      setError(caught instanceof Error ? caught.message : 'The JSON documents could not be compared.')
    }
  }
  const formatValue = (value: unknown) => value === undefined ? '—' : JSON.stringify(value, null, 2)

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      <section aria-label="JSON diff checker" className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm font-semibold">Original JSON
            <textarea aria-label="Original JSON" className={`${textAreaClass} mt-2`} value={left} onChange={(event) => setLeft(event.target.value)} spellCheck={false} />
          </label>
          <label className="block text-sm font-semibold">Updated JSON
            <textarea aria-label="Updated JSON" className={`${textAreaClass} mt-2`} value={right} onChange={(event) => setRight(event.target.value)} spellCheck={false} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={primaryButtonClass} onClick={compare}>Compare JSON</button>
          <button type="button" className={secondaryButtonClass} onClick={() => { setLeft(''); setRight(''); setChanges(null); setError('') }}>Reset</button>
        </div>
        <ToolError message={error} />
        {changes && (
          <section aria-label="JSON comparison results" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">{changes.length ? `${changes.length} change${changes.length === 1 ? '' : 's'} found` : 'The JSON documents are identical.'}</h2>
              <CopyButton text={JSON.stringify(changes, null, 2)} label="Copy diff" />
            </div>
            {changes.slice(0, 500).map((change, index) => {
              const style = change.kind === 'added'
                ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50'
                : change.kind === 'removed'
                  ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50'
                  : 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50'
              return (
                <article key={`${change.path}-${index}`} className={`overflow-hidden rounded-xl border ${style}`}>
                  <h3 className="px-3 py-2 text-sm font-semibold">{change.kind.toUpperCase(                  )}
                  {changes.length > 500 && <p className="text-sm text-gray-500">Showing the first 500 changes. Copy diff includes all changes.</p>} <code className="ml-2 break-all font-mono">{change.path}</code></h3>
                  <div className="grid border-t border-inherit sm:grid-cols-2">
                    <pre className="overflow-auto border-b border-inherit p-3 text-xs sm:border-b-0 sm:border-r"><span className="mb-1 block font-sans font-semibold">Original</span>{formatValue(change.left)}</pre>
                    <pre className="overflow-auto p-3 text-xs"><span className="mb-1 block font-sans font-semibold">Updated</span>{formatValue(change.right)}</pre>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </section>
    </ToolLayout>
  )
}

const cronExamples = [
  { label: 'Every minute', expression: '* * * * *' },
  { label: 'Hourly', expression: '0 * * * *' },
  { label: 'Daily at 9:00', expression: '0 9 * * *' },
  { label: 'Weekdays at 9:00', expression: '0 9 * * 1-5' },
  { label: 'Every 15 minutes', expression: '*/15 * * * *' },
]
const cronFieldNames = ['Minute', 'Hour', 'Day of month', 'Month', 'Day of week']

function CronTool() {
  const { tool, related } = usePageTools('cron-generator')
  const [expression, setExpression] = useState('*/15 * * * *')
  const [result, setResult] = useState<{ description: string; runs: Date[] } | null>(null)
  const [error, setError] = useState('')
  if (!tool) return null

  function preview(value = expression) {
    try {
      const normalized = validateCron(value)
      setExpression(normalized)
      setResult({ description: describeCron(normalized), runs: nextCronRuns(normalized) })
      setError('')
    } catch (caught) {
      setResult(null)
      setError(caught instanceof Error ? caught.message : 'Invalid cron expression.')
    }
  }

  const fields = expression.trim().split(/\s+/)
  return (
    <ToolLayout tool={tool} relatedTools={related}>
      <section aria-label="Cron expression generator" className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {cronFieldNames.map((name, index) => (
            <label key={name} className="block text-sm font-semibold">{name}
              <input aria-label={name} className={`${fieldClass} mt-2 font-mono`} value={fields[index] ?? ''} onChange={(event) => {
                const next = [...fields]
                next[index] = event.target.value
                setExpression(next.join(' '))
                setResult(null)
              }} />
            </label>
          ))}
        </div>
        <label className="block text-sm font-semibold">Cron expression
          <input aria-label="Cron expression" className={`${fieldClass} mt-2 font-mono`} value={expression} onChange={(event) => { setExpression(event.target.value); setResult(null) }} />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Common cron schedules">
          {cronExamples.map((example) => (
            <button type="button" key={example.label} className={secondaryButtonClass} onClick={() => preview(example.expression)}>{example.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={primaryButtonClass} onClick={() => preview()}>Validate schedule</button>
          <CopyButton text={expression} label="Copy expression" />
          <button type="button" className={secondaryButtonClass} onClick={() => { setExpression('* * * * *'); setResult(null); setError('') }}>Reset</button>
        </div>
        <ToolError message={error} />
        {result && (
          <section aria-live="polite" className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h2 className="font-semibold">Schedule explanation</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">{result.description}</p>
            <h3 className="pt-2 text-sm font-semibold">Next run times (local time)</h3>
            <ol className="list-inside list-decimal space-y-1 font-mono text-sm">
              {result.runs.map((run) => <li key={run.toISOString()}>{run.toLocaleString()}</li>)}
            </ol>
          </section>
        )}
        <p className="text-xs text-gray-500">Uses standard five-field cron syntax. Month and weekday names are not supported. Day-of-month and weekday follow traditional cron OR behavior when both are restricted; run times use this device&apos;s local time zone.</p>
      </section>
    </ToolLayout>
  )
}

function JwtGeneratorTool() {
  const { tool, related } = usePageTools('jwt-generator')
  const [algorithm, setAlgorithm] = useState<JwtTestAlgorithm>('HS256')
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
  const [payload, setPayload] = useState('{\n  "sub": "demo-user",\n  "name": "Example User",\n  "iat": 1893456000,\n  "exp": 1893459600\n}')
  const [secret, setSecret] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  if (!tool) return null

  async function generate() {
    try {
      setToken(await generateTestJwt(header, payload, algorithm, secret))
      setError('')
    } catch (caught) {
      setToken('')
      setError(caught instanceof Error ? caught.message : 'The test token could not be generated.')
    }
  }

  function chooseAlgorithm(value: JwtTestAlgorithm) {
    setAlgorithm(value)
    try {
      const parsed = JSON.parse(header) as Record<string, unknown>
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        setHeader(JSON.stringify({ ...parsed, alg: value }, null, 2))
      }
    } catch {
      setError('Fix the header JSON before changing its algorithm.')
    }
    setToken('')
  }

  function reset() {
    setAlgorithm('HS256')
    setHeader('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
    setPayload('{\n  "sub": "demo-user",\n  "name": "Example User",\n  "iat": 1893456000,\n  "exp": 1893459600\n}')
    setSecret('')
    setToken('')
    setError('')
  }

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      <section aria-label="JWT test token generator" className="space-y-4">
        <aside role="note" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
          <strong>Test tokens only.</strong> Signing happens in this browser. Never enter production secrets or use generated tokens for authentication. Generation does not verify a token&apos;s security. Only HMAC algorithms HS256, HS384, and HS512 are supported.
        </aside>
        <label className="block text-sm font-semibold">Signing algorithm
          <select aria-label="Signing algorithm" className={`${fieldClass} mt-2`} value={algorithm} onChange={(event) => chooseAlgorithm(event.target.value as JwtTestAlgorithm)}>
            <option value="HS256">HS256</option><option value="HS384">HS384</option><option value="HS512">HS512</option>
          </select>
        </label>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm font-semibold">JWT header JSON
            <textarea aria-label="JWT header JSON" className={`${textAreaClass} mt-2`} value={header} onChange={(event) => { setHeader(event.target.value); setToken('') }} spellCheck={false} />
          </label>
          <label className="block text-sm font-semibold">Payload JSON
            <textarea aria-label="Payload JSON" className={`${textAreaClass} mt-2`} value={payload} onChange={(event) => { setPayload(event.target.value); setToken('') }} spellCheck={false} />
          </label>
        </div>
        <p className="text-xs text-gray-500">Common claims such as iss, sub, aud, exp, nbf, and iat can be configured in the payload.</p>
        <label className="block text-sm font-semibold">Temporary test secret
          <input type="password" autoComplete="new-password" aria-label="Temporary test secret" className={`${fieldClass} mt-2`} value={secret} onChange={(event) => { setSecret(event.target.value); setToken('') }} />
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={primaryButtonClass} onClick={generate}>Generate test token</button>
          <button type="button" className={secondaryButtonClass} onClick={reset}>Reset</button>
        </div>
        <ToolError message={error} />
        {token && <div className="space-y-2"><div className="flex items-center justify-between gap-2"><h2 className="font-semibold">Generated test JWT</h2><CopyButton text={token} /></div><pre role="status" className="overflow-auto whitespace-pre-wrap break-all rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm dark:border-gray-800 dark:bg-gray-900">{token}</pre></div>}
      </section>
    </ToolLayout>
  )
}

function SqlBuilderTool() {
  const { tool, related } = usePageTools('sql-query-builder')
  const [operation, setOperation] = useState<SqlOperation>('select')
  const [dialect, setDialect] = useState<SqlDialect>('postgres')
  const [table, setTable] = useState('users')
  const [columns, setColumns] = useState('id, name')
  const [values, setValues] = useState('{\n  "name": "Ada",\n  "active": true\n}')
  const [where, setWhere] = useState('id = 1')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  if (!tool) return null

  function generate() {
    try {
      setQuery(buildSqlQuery({ operation, dialect, table, columns, values, where }))
      setError('')
    } catch (caught) {
      setQuery('')
      setError(caught instanceof Error ? caught.message : 'The query could not be generated.')
    }
  }

  function reset() {
    setOperation('select')
    setDialect('postgres')
    setTable('users')
    setColumns('id, name')
    setValues('{\n  "name": "Ada",\n  "active": true\n}')
    setWhere('id = 1')
    setQuery('')
    setError('')
  }

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      <section aria-label="SQL query builder" className="space-y-4">
        <aside role="note" className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">This tool only generates a query preview; it never connects to or executes against a database. WHERE conditions are raw SQL text—review them before using the output.</aside>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Query type
            <select aria-label="Query type" className={`${fieldClass} mt-2`} value={operation} onChange={(event) => { setOperation(event.target.value as SqlOperation); setQuery('') }}>
              <option value="select">SELECT</option><option value="insert">INSERT</option><option value="update">UPDATE</option><option value="delete">DELETE</option>
            </select>
          </label>
          <label className="text-sm font-semibold">SQL dialect
            <select aria-label="SQL dialect" className={`${fieldClass} mt-2`} value={dialect} onChange={(event) => { setDialect(event.target.value as SqlDialect); setQuery('') }}>
              <option value="postgres">PostgreSQL / ANSI</option><option value="mysql">MySQL</option><option value="sqlserver">SQL Server</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-semibold">Table
          <input aria-label="Table" className={`${fieldClass} mt-2`} value={table} onChange={(event) => { setTable(event.target.value); setQuery('') }} />
        </label>
        {operation === 'select' && <label className="block text-sm font-semibold">Columns (comma-separated; use * for all)
          <input aria-label="Columns" className={`${fieldClass} mt-2`} value={columns} onChange={(event) => { setColumns(event.target.value); setQuery('') }} />
        </label>}
        {(operation === 'insert' || operation === 'update') && <label className="block text-sm font-semibold">Values (JSON object)
          <textarea aria-label="Values" className={`${textAreaClass} mt-2 min-h-32`} value={values} onChange={(event) => { setValues(event.target.value); setQuery('') }} spellCheck={false} />
        </label>}
        {(operation === 'select' || operation === 'update' || operation === 'delete') && <label className="block text-sm font-semibold">WHERE condition {operation !== 'select' && '(required)'}
          <input aria-label="WHERE condition" className={`${fieldClass} mt-2`} value={where} onChange={(event) => { setWhere(event.target.value); setQuery('') }} placeholder="e.g. id = 1" />
        </label>}
        <div className="flex flex-wrap gap-3"><button type="button" className={primaryButtonClass} onClick={generate}>Generate SQL</button>{query && <CopyButton text={query} label="Copy query" />}<button type="button" className={secondaryButtonClass} onClick={reset}>Reset</button></div>
        <ToolError message={error} />
        {query && <pre role="status" className="overflow-auto whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm dark:border-gray-800 dark:bg-gray-900">{query}</pre>}
      </section>
    </ToolLayout>
  )
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
interface ApiResponse {
  status: number
  statusText: string
  durationMs: number
  headers: Record<string, string>
  body: string
}

async function readResponseBody(response: Response): Promise<string> {
  const maxBytes = 1_000_000
  const declaredLength = Number(response.headers.get('content-length'))
  if (declaredLength > maxBytes) throw new Error('Response exceeds the 1 MB display limit.')
  if (!response.body) return response.text()

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let body = ''
  let total = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel()
      throw new Error('Response exceeds the 1 MB display limit.')
    }
    body += decoder.decode(value, { stream: true })
  }
  return body + decoder.decode()
}

function ApiTesterTool() {
  const { tool, related } = usePageTools('api-tester')
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [url, setUrl] = useState('')
  const [queryParams, setQueryParams] = useState('')
  const [headersText, setHeadersText] = useState('{\n  "Accept": "application/json"\n}')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const activeRequest = useRef<AbortController | null>(null)

  useEffect(() => () => {
    activeRequest.current?.abort()
    activeRequest.current = null
  }, [])
  if (!tool) return null

  async function sendRequest() {
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller
    const timeout = setTimeout(() => controller.abort(), 15_000)
    setLoading(true)
    setError('')
    setResponse(null)

    try {
      const requestUrl = validateApiRequestUrl(url)
      for (const line of queryParams.split(/\r?\n/)) {
        const parameter = line.trim()
        if (!parameter) continue
        const separator = parameter.indexOf('=')
        if (separator <= 0) throw new Error(`Use key=value format for query parameters: "${parameter}".`)
        requestUrl.searchParams.append(parameter.slice(0, separator).trim(), parameter.slice(separator + 1).trim())
      }
      let parsedHeaders: unknown
      try {
        parsedHeaders = JSON.parse(headersText || '{}')
      } catch (caught) {
        throw new Error(`Headers must be a JSON object: ${(caught as Error).message}`)
      }
      if (!parsedHeaders || typeof parsedHeaders !== 'object' || Array.isArray(parsedHeaders)) {
        throw new Error('Headers must be a JSON object of string names and values.')
      }
      const headers = new Headers()
      for (const [name, value] of Object.entries(parsedHeaders)) {
        if (typeof value !== 'string') throw new Error(`Header "${name}" must have a string value.`)
        headers.append(name, value)
      }
      const started = performance.now()
      const result = await fetch(requestUrl, {
        method,
        headers,
        body: method === 'GET' || method === 'DELETE' || !body ? undefined : body,
        signal: controller.signal,
      })
      const responseBody = await readResponseBody(result)
      let formattedBody = responseBody
      if (result.headers.get('content-type')?.includes('json')) {
        try {
          formattedBody = JSON.stringify(JSON.parse(responseBody), null, 2)
        } catch {
          formattedBody = responseBody
        }
      }
      setResponse({
        status: result.status,
        statusText: result.statusText,
        durationMs: Math.round(performance.now() - started),
        headers: Object.fromEntries(result.headers.entries()),
        body: formattedBody,
      })
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'The browser request failed.'
      if (activeRequest.current === controller) {
        setError(controller.signal.aborted
          ? 'Request timed out after 15 seconds or was cancelled.'
          : message === 'Failed to fetch'
            ? 'The browser could not complete this request. The server may be unreachable or may block cross-origin requests (CORS). No server-side proxy is used.'
            : message)
      }
    } finally {
      clearTimeout(timeout)
      if (activeRequest.current === controller) {
        activeRequest.current = null
        setLoading(false)
      }
    }
  }

  function reset() {
    activeRequest.current?.abort()
    activeRequest.current = null
    setMethod('GET')
    setUrl('')
    setQueryParams('')
    setHeadersText('{\n  "Accept": "application/json"\n}')
    setBody('')
    setResponse(null)
    setError('')
    setLoading(false)
  }

  const requestCopy = JSON.stringify({
    method,
    url,
    queryParams,
    headers: headersText,
    body: method === 'GET' || method === 'DELETE' ? undefined : body,
  }, null, 2)

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      <section aria-label="API request tester" className="space-y-4">
        <aside role="note" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-200">Requests are sent directly from your browser—there is no server-side proxy. Browser CORS rules apply. Requests to recognizable local/private addresses are blocked, but avoid sensitive credentials and do not treat this as a network security boundary.</aside>
        <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <label className="text-sm font-semibold">Method
            <select aria-label="HTTP method" className={`${fieldClass} mt-2`} value={method} onChange={(event) => setMethod(event.target.value as HttpMethod)}>
              {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const).map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Request URL
            <input aria-label="Request URL" className={`${fieldClass} mt-2`} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://api.example.com/v1/items" />
          </label>
        </div>
        <label className="block text-sm font-semibold">Query parameters (one key=value per line)
          <textarea aria-label="Query parameters" className={`${textAreaClass} mt-2 min-h-24`} value={queryParams} onChange={(event) => setQueryParams(event.target.value)} placeholder={'page=1\nlimit=10'} />
        </label>
        <label className="block text-sm font-semibold">Headers (JSON object)
          <textarea aria-label="Request headers" className={`${textAreaClass} mt-2 min-h-28`} value={headersText} onChange={(event) => setHeadersText(event.target.value)} spellCheck={false} />
        </label>
        {method !== 'GET' && method !== 'DELETE' && <label className="block text-sm font-semibold">Request body
          <textarea aria-label="Request body" className={`${textAreaClass} mt-2`} value={body} onChange={(event) => setBody(event.target.value)} placeholder={'{"example": true}'} spellCheck={false} />
        </label>}
        <div className="flex flex-wrap gap-3">
          <button type="button" className={primaryButtonClass} disabled={loading} onClick={sendRequest}>{loading ? 'Sending…' : 'Send request'}</button>
          <CopyButton text={requestCopy} label="Copy request" />
          <button type="button" className={secondaryButtonClass} onClick={reset}>Reset</button>
          {loading && <button type="button" className={secondaryButtonClass} onClick={() => activeRequest.current?.abort()}>Cancel</button>}
        </div>
        <ToolError message={error} />
        {response && (
          <section aria-live="polite" aria-label="API response" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <h2 className="font-semibold">Status {response.status} {response.statusText} · {response.durationMs} ms</h2>
              <CopyButton text={response.body} label="Copy response" />
            </div>
            <details className="rounded-xl border border-gray-200 p-3 dark:border-gray-800"><summary className="cursor-pointer font-semibold">Response headers</summary><pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(response.headers, null, 2)}</pre></details>
            <pre className="max-h-[32rem] min-h-24 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm dark:border-gray-800 dark:bg-gray-900">{response.body || '(empty response body)'}</pre>
          </section>
        )}
      </section>
    </ToolLayout>
  )
}

function RegexExplainerTool() {
  const { tool, related } = usePageTools('regex-explainer')
  const [pattern, setPattern] = useState(String.raw`\b\w+@\w+\.\w+\b`)
  const [flags, setFlags] = useState('gi')
  const [text, setText] = useState('Contact ada@example.com or grace@example.org for details.')
  const [matches, setMatches] = useState<RegexWorkerMatch[] | null>(null)
  const [error, setError] = useState('')
  if (!tool) return null

  async function testPattern() {
    try {
      const result = await findRegexMatches(pattern, flags, text)
      setMatches(result)
      setError('')
    } catch (caught) {
      setMatches(null)
      setError(caught instanceof Error ? caught.message : 'The expression could not be tested.')
    }
  }

  let explanation: RegexToken[]
  let explanationError = ''
  try {
    explanation = explainRegex(pattern)
  } catch (caught) {
    explanation = []
    explanationError = pattern ? (caught instanceof Error ? caught.message : 'Invalid regular expression.') : ''
  }

  const highlightedText = matches?.length
    ? (() => {
      const parts = []
      let cursor = 0
      for (const [index, match] of matches.entries()) {
        if (match.index > cursor) parts.push(<span key={`text-${index}`}>{text.slice(cursor, match.index)}</span>)
        parts.push(<mark key={`match-${index}`} className="rounded bg-yellow-200 px-0.5 text-gray-950 dark:bg-yellow-700 dark:text-white">{match.value}</mark>)
        cursor = match.index + match.value.length
      }
      if (cursor < text.length) parts.push(<span key="text-end">{text.slice(cursor)}</span>)
      return parts
    })()
    : text

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      <section aria-label="Regular expression explainer" className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">JavaScript regular expressions run in a separate worker that is terminated if matching takes too long. Pattern length is limited to 500 characters and test text to 5,000 characters.</p>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <label className="text-sm font-semibold">Regular expression
            <input aria-label="Regular expression" className={`${fieldClass} mt-2 font-mono`} value={pattern} onChange={(event) => { setPattern(event.target.value); setMatches(null); setError('') }} />
          </label>
          <label className="text-sm font-semibold">Flags
            <input aria-label="Regex flags" className={`${fieldClass} mt-2 font-mono`} value={flags} onChange={(event) => { setFlags(event.target.value); setMatches(null); setError('') }} placeholder="gim" />
          </label>
        </div>
        <label className="block text-sm font-semibold">Test text
          <textarea aria-label="Regex test text" className={`${textAreaClass} mt-2`} value={text} onChange={(event) => { setText(event.target.value); setMatches(null); setError('') }} />
        </label>
        <div className="flex flex-wrap gap-3"><button type="button" className={primaryButtonClass} onClick={testPattern}>Test expression</button><button type="button" className={secondaryButtonClass} onClick={() => { setPattern(''); setFlags('g'); setText(''); setMatches(null); setError('') }}>Reset</button></div>
        <ToolError message={error || explanationError} />
        {explanation.length > 0 && (
          <section aria-labelledby="regex-explanation-heading" className="space-y-2">
            <h2 id="regex-explanation-heading" className="font-semibold">Pattern breakdown</h2>
            <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {explanation.map((part, index) => <li key={`${part.token}-${index}`} className="flex flex-wrap gap-3 px-3 py-2 text-sm"><code className="min-w-12 font-mono font-semibold">{part.token}</code><span className="w-32 text-gray-500">{part.kind}</span><span>{part.explanation}</span></li>)}
            </ul>
          </section>
        )}
        {matches && <section aria-live="polite" className="space-y-3"><h2 className="font-semibold">{matches.length} match{matches.length === 1 ? '' : 'es'} found</h2><pre className="whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm dark:border-gray-800 dark:bg-gray-900">{highlightedText}</pre>{matches.length > 0 && <CopyButton text={JSON.stringify(matches, null, 2)} label="Copy matches" />}</section>}
      </section>
    </ToolLayout>
  )
}

const phaseTwoTools: Record<string, ComponentType> = {
  'json-diff': JsonDiffTool,
  'cron-generator': CronTool,
  'jwt-generator': JwtGeneratorTool,
  'sql-query-builder': SqlBuilderTool,
  'api-tester': ApiTesterTool,
  'regex-explainer': RegexExplainerTool,
}

export function PhaseTwoToolClient({ slug }: { slug: string }) {
  const Tool = phaseTwoTools[slug]
  return Tool ? <Tool /> : null
}
