import assert from 'node:assert/strict'
import test from 'node:test'
import { siteUrl } from '../src/lib/site-url.ts'

test('canonical site URL is absolute and uses HTTP or HTTPS', () => {
  const parsedUrl = new URL(siteUrl)
  assert.ok(['http:', 'https:'].includes(parsedUrl.protocol))
})
