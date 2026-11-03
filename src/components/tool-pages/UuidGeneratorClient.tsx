'use client'

import { useState, useSyncExternalStore } from 'react'
import { RefreshCw, Download } from 'lucide-react'
import { generateMultipleUUIDs, getInitialUUIDSnapshot, getServerUUIDSnapshot, subscribeToInitialUUIDs } from '@/lib/tools/uuid-generator'
import { getToolBySlug, tools } from '@/lib/tools'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { CopyButton } from '@/components/tools/CopyButton'
import { downloadTextFile } from '@/lib/utils'

export function UuidGeneratorClient() {
  const [count, setCount] = useState(5)
  const [generated, setGenerated] = useState<string[] | null>(null)
  const initialUuids = useSyncExternalStore(
    subscribeToInitialUUIDs,
    getInitialUUIDSnapshot,
    getServerUUIDSnapshot,
  )
  const uuids = generated ?? initialUuids

  const tool = getToolBySlug('uuid-generator')!
  const related = tools.filter((t) => t.slug !== 'uuid-generator').slice(0, 3)

  function generate() {
    setGenerated(generateMultipleUUIDs(count))
  }

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="uuid-count" className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Generate
        </button>
      </div>

      {/* UUID list */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{uuids.length} UUID{uuids.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-2">
            <CopyButton text={uuids.join('\n')} label="Copy All" />
            <button
              onClick={() => downloadTextFile(uuids.join('\n'), 'uuids.txt')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 group">
              <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{uuid}</span>
              <CopyButton text={uuid} label="Copy" className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About UUID v4</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          UUID v4 (Universally Unique Identifier version 4) values are randomly generated using your browser&apos;s cryptographically secure <code>crypto.randomUUID()</code> function. Collisions are extremely unlikely but not impossible, so enforce uniqueness in your database when it matters.
        </p>
      </section>
    </ToolLayout>
  )
}
