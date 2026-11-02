'use client'

import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { decodeJWT } from '@/lib/tools/jwt-decoder'
import { getToolBySlug, tools } from '@/lib/tools'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { CopyButton } from '@/components/tools/CopyButton'

const EXAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export function JwtDecoderClient() {
  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState<ReturnType<typeof decodeJWT> | null>(null)

  const tool = getToolBySlug('jwt-decoder')!
  const related = tools.filter((t) => t.slug !== 'jwt-decoder').slice(0, 3)

  function handleDecode() {
    setDecoded(decodeJWT(input))
  }

  function handleClear() {
    setInput('')
    setDecoded(null)
  }

  return (
    <ToolLayout tool={tool} relatedTools={related}>
      {/* Security warning */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 mb-6">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Decoding does not verify the signature.</strong> This tool only decodes the token payload. It cannot confirm authenticity or that the token has not been tampered with.
          Never enter production tokens with sensitive data into online tools.
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <label htmlFor="jwt-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">JWT Token</label>
          <div className="flex items-center gap-2">
            <button onClick={() => { setInput(EXAMPLE); setDecoded(null) }} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Load Example</button>
            <button onClick={handleClear} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
        </div>
        <textarea
          id="jwt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JWT token here..."
          className="h-28 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
          spellCheck={false}
        />
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleDecode}
          disabled={!input.trim()}
          className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          Decode JWT
        </button>
      </div>

      {/* Results */}
      {decoded && (
        <div className="space-y-4">
          {!decoded.success ? (
            <div role="alert" className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {decoded.error}
            </div>
          ) : (
            <>
              {/* Status bar */}
              <div className="flex flex-wrap gap-3">
                {decoded.isExpired !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${decoded.isExpired ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'}`}>
                    {decoded.isExpired ? '⚠ Expired' : '✓ Not Expired'}
                  </span>
                )}
                {decoded.expiresAt && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    Expires: {decoded.expiresAt.toLocaleString()}
                  </span>
                )}
                {decoded.issuedAt && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    Issued: {decoded.issuedAt.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Header */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Header</span>
                  <CopyButton text={JSON.stringify(decoded.header, null, 2)} label="Copy" />
                </div>
                <pre className="p-4 text-sm text-gray-900 dark:text-gray-100 overflow-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payload</span>
                  <CopyButton text={JSON.stringify(decoded.payload, null, 2)} label="Copy" />
                </div>
                <pre className="p-4 text-sm text-gray-900 dark:text-gray-100 overflow-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>

              {/* Signature */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Signature (not verified)</span>
                </div>
                <pre className="p-4 text-sm text-gray-500 dark:text-gray-400 overflow-auto break-all">
                  {decoded.signature}
                </pre>
              </div>
            </>
          )}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About JWT Decoder</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          JSON Web Tokens (JWTs) consist of three Base64URL-encoded parts: a header, a payload, and a signature. This tool decodes the header and payload so you can inspect their contents. The signature is displayed but <strong>not verified</strong>.
        </p>
      </section>
    </ToolLayout>
  )
}
