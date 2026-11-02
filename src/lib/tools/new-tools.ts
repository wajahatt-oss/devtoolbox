export type DigestAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export function encodeUrl(input: string): string {
  if (!input) throw new Error('Enter text to encode.')
  try {
    return encodeURIComponent(input)
  } catch {
    throw new Error('Text contains an invalid Unicode surrogate and cannot be URL-encoded.')
  }
}

export function decodeUrl(input: string): string {
  if (!input.trim()) throw new Error('Enter URL-encoded text to decode.')
  try {
    return decodeURIComponent(input)
  } catch {
    throw new Error('Invalid percent-encoded text. Check that each % is followed by two hexadecimal digits.')
  }
}

function assertXmlWellFormed(input: string): void {
  if (!input.trim()) throw new Error('Enter XML to format.')
  const withoutComments = input.replace(/<!--[\s\S]*?-->/g, '')
  if (/<!--[\s\S]*$/.test(withoutComments)) throw new Error('Invalid XML: unclosed comment.')
  const stack: string[] = []
  const tags = /<\/?[A-Za-z_][\w:.-]*(?:\s[^<>]*?)?\s*\/?>/g
  let match: RegExpExecArray | null
  let rootCount = 0
  let cursor = 0
  const tokens = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[\s\S]*?>|<\/?[A-Za-z_][\w:.-]*(?:\s[^<>]*?)?\s*\/?>|[^<]+|</gi
  const checkTextOutsideRoot = (text: string) => {
    if (!stack.length && text.trim()) throw new Error('Invalid XML: text is not allowed outside the root element.')
  }
  while ((match = tokens.exec(withoutComments))) {
    const token = match[0]
    if (match.index > cursor) throw new Error('Invalid XML: malformed tag.')
    cursor = tokens.lastIndex
    if (token.startsWith('<!--') || token.startsWith('<?') || /^<!DOCTYPE/i.test(token)) continue
    if (token.startsWith('<![CDATA[')) {
      if (!stack.length) throw new Error('Invalid XML: CDATA is not allowed outside the root element.')
      continue
    }
    if (!token.startsWith('<')) {
      checkTextOutsideRoot(token)
      continue
    }
    if (token === '<') throw new Error('Invalid XML: malformed tag.')
    const tagMatch = token.match(/^<\/?([A-Za-z_][\w:.-]*)/)
    if (!tagMatch) throw new Error('Invalid XML: malformed tag.')
    const name = tagMatch[1]
    if (token.startsWith('</')) {
      if (stack.pop() !== name) throw new Error(`Invalid XML: unexpected closing tag </${name}>.`)
    } else {
      if (!stack.length) rootCount += 1
      if (!token.endsWith('/>')) stack.push(name)
    }
  }
  if (cursor < withoutComments.length) throw new Error('Invalid XML: malformed tag.')
  if (rootCount !== 1) throw new Error('Invalid XML: document must contain exactly one root element.')
  if (stack.length) throw new Error(`Invalid XML: missing closing tag for <${stack[stack.length - 1]}>.`)
  const stripped = withoutComments
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
    .replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(tags, '')
  if (/&(?!(?:#\d+|#x[\da-f]+|[A-Za-z][\w.-]*);)/i.test(stripped)) {
    throw new Error('Invalid XML: entity references must end with a semicolon.')
  }
  if (/[<>]/.test(stripped)) throw new Error('Invalid XML: malformed tag.')
}

function indentMarkup(input: string, xml: boolean): string {
  if (xml) assertXmlWellFormed(input)
  else if (!input.trim()) throw new Error('Enter HTML to format.')

  const tokens = input.match(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[\s\S]*?>|<\/?[^>]+>|[^<]+/gi) ?? []
  const lines: string[] = []
  let depth = 0
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])

  for (const rawToken of tokens) {
    const token = rawToken.trim()
    if (!token) continue
    const closing = /^<\//.test(token)
    const openingMatch = token.match(/^<([A-Za-z][\w:.-]*)/)
    const tagName = openingMatch?.[1].toLowerCase()
    const selfClosing = /\/>$/.test(token) || (!!tagName && !xml && voidTags.has(tagName))

    if (closing) depth = Math.max(0, depth - 1)
    lines.push(`${'  '.repeat(depth)}${token}`)
    if (openingMatch && !closing && !selfClosing && !/^<(?:!|\?)/.test(token)) depth += 1
  }
  return lines.join('\n')
}

export function formatXml(input: string): string {
  return indentMarkup(input, true)
}

export function formatHtml(input: string): string {
  return indentMarkup(input, false)
}

export function minifyCss(input: string): string {
  if (!input.trim()) throw new Error('Enter CSS to minify.')
  let output = ''
  let quote = ''
  let comment = false
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]
    const next = input[i + 1]
    if (comment) {
      if (char === '*' && next === '/') {
        comment = false
        i += 1
      }
      continue
    }
    if (quote) {
      output += char
      if (char === '\\' && next) output += input[++i]
      else if (char === quote) quote = ''
      continue
    }
    if (char === '/' && next === '*') {
      comment = true
      i += 1
    } else if (char === '"' || char === "'") {
      quote = char
      output += char
    } else if (/\s/.test(char)) {
      if (output && /[\w#.-]/.test(output[output.length - 1]) && /[\w#.-]/.test(next ?? '')) {
        output += ' '
      }
    } else {
      output += char
    }
  }
  if (comment) throw new Error('Invalid CSS: unclosed comment.')
  if (quote) throw new Error('Invalid CSS: unclosed string.')
  let braces = 0
  for (const char of output) {
    if (char === '{') braces += 1
    if (char === '}') braces -= 1
    if (braces < 0) throw new Error('Invalid CSS: unexpected closing brace.')
  }
  if (braces !== 0) throw new Error('Invalid CSS: missing closing brace.')
  return output.replace(/\s*([{}:;,>+~])\s*/g, '$1').replace(/;}/g, '}').trim()
}

export interface RegexMatch {
  value: string
  index: number
  groups: string[]
}

export function testRegex(pattern: string, flags: string, text: string): RegexMatch[] {
  if (!pattern) throw new Error('Enter a regular expression.')
  let expression: RegExp
  try {
    expression = new RegExp(pattern, flags)
  } catch (error) {
    throw new Error(`Invalid regular expression: ${(error as Error).message}`)
  }
  const matches: RegexMatch[] = []
  if (!expression.global && !expression.sticky) {
    const match = expression.exec(text)
    if (match) matches.push({ value: match[0], index: match.index, groups: match.slice(1) })
    return matches
  }
  let match: RegExpExecArray | null
  while ((match = expression.exec(text)) !== null) {
    matches.push({ value: match[0], index: match.index, groups: match.slice(1) })
    if (matches.length >= 1000) break
    if (match[0] === '') expression.lastIndex += 1
  }
  return matches
}

function csvCell(value: unknown): string {
  const text = value === null || value === undefined
    ? ''
    : typeof value === 'object'
      ? JSON.stringify(value)
      : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function jsonToCsv(input: string): string {
  if (!input.trim()) throw new Error('Enter a JSON array to convert.')
  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (error) {
    throw new Error(`Invalid JSON: ${(error as Error).message}`)
  }
  if (!Array.isArray(parsed) || parsed.some((row) => row === null || typeof row !== 'object' || Array.isArray(row))) {
    throw new Error('Expected a JSON array of objects, for example [{"name":"Ada","role":"developer"}].')
  }
  if (parsed.length === 0) throw new Error('The JSON array is empty.')
  const columns = [...new Set(parsed.flatMap((row: Record<string, unknown>) => Object.keys(row)))]
  if (!columns.length) throw new Error('The objects do not contain any fields.')
  return [
    columns.map(csvCell).join(','),
    ...parsed.map((row: Record<string, unknown>) => columns.map((column) => csvCell(row[column])).join(',')),
  ].join('\n')
}

export interface TimestampResult {
  iso: string
  utc: string
  local: string
  seconds: number
  milliseconds: number
}

export function convertTimestamp(input: string): TimestampResult {
  const value = input.trim()
  if (!value) throw new Error('Enter a Unix timestamp or date string.')
  const numeric = /^-?\d+$/.test(value)
  const milliseconds = numeric
    ? Number(value) * (value.replace('-', '').length <= 10 ? 1000 : 1)
    : Date.parse(value)
  const date = new Date(milliseconds)
  if (!Number.isFinite(milliseconds) || Number.isNaN(date.getTime())) {
    throw new Error('Invalid timestamp. Use Unix seconds, milliseconds, or a date string such as 2025-01-01T12:00:00Z.')
  }
  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
  }
}

export async function generateHash(input: string, algorithm: DigestAlgorithm): Promise<string> {
  if (!input) throw new Error('Enter text to hash.')
  if (!globalThis.crypto?.subtle) throw new Error('Web Crypto is unavailable. Use a secure browser context (HTTPS or localhost).')
  const bytes = new TextEncoder().encode(input)
  const digest = await globalThis.crypto.subtle.digest(algorithm, bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export type MarkdownInline =
  | { kind: 'text' | 'code' | 'strong' | 'emphasis'; text: string }

export type MarkdownBlock =
  | { kind: 'heading'; level: number; content: MarkdownInline[] }
  | { kind: 'paragraph' | 'quote' | 'unordered-list' | 'ordered-list'; content: MarkdownInline[] }
  | { kind: 'code'; language: string; text: string }

function parseInlineMarkdown(text: string): MarkdownInline[] {
  const parts: MarkdownInline[] = []
  const tokens = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g
  let start = 0
  let match: RegExpExecArray | null
  while ((match = tokens.exec(text))) {
    if (match.index > start) parts.push({ kind: 'text', text: text.slice(start, match.index) })
    const token = match[0]
    if (token.startsWith('`')) parts.push({ kind: 'code', text: token.slice(1, -1) })
    else if (token.startsWith('**') || token.startsWith('__')) parts.push({ kind: 'strong', text: token.slice(2, -2) })
    else parts.push({ kind: 'emphasis', text: token.slice(1, -1) })
    start = match.index + token.length
  }
  if (start < text.length) parts.push({ kind: 'text', text: text.slice(start) })
  return parts
}

export function parseMarkdown(input: string): MarkdownBlock[] {
  if (!input.trim()) throw new Error('Enter Markdown to preview.')
  const lines = input.replace(/\r\n?/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let codeLines: string[] | null = null
  let language = ''
  for (const line of lines) {
    if (line.startsWith('```')) {
      if (codeLines === null) {
        codeLines = []
        language = line.slice(3).trim()
      } else {
        blocks.push({ kind: 'code', language, text: codeLines.join('\n') })
        codeLines = null
        language = ''
      }
      continue
    }
    if (codeLines !== null) {
      codeLines.push(line)
      continue
    }
    if (!line.trim()) continue
    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) blocks.push({ kind: 'heading', level: heading[1].length, content: parseInlineMarkdown(heading[2]) })
    else if (/^\s*[-*+]\s+/.test(line)) blocks.push({ kind: 'unordered-list', content: parseInlineMarkdown(line.replace(/^\s*[-*+]\s+/, '')) })
    else if (/^\s*\d+[.)]\s+/.test(line)) blocks.push({ kind: 'ordered-list', content: parseInlineMarkdown(line.replace(/^\s*\d+[.)]\s+/, '')) })
    else if (/^\s*>\s?/.test(line)) blocks.push({ kind: 'quote', content: parseInlineMarkdown(line.replace(/^\s*>\s?/, '')) })
    else blocks.push({ kind: 'paragraph', content: parseInlineMarkdown(line) })
  }
  if (codeLines !== null) throw new Error('Unclosed fenced code block. Add a closing ``` line.')
  return blocks
}

export type DiffLine = { kind: 'same' | 'added' | 'removed'; text: string }

export function compareText(left: string, right: string): DiffLine[] {
  if (!left && !right) throw new Error('Enter text in at least one of the two inputs.')
  const a = left ? left.split('\n') : []
  const b = right ? right.split('\n') : []
  if (a.length * b.length > 1_000_000) {
    throw new Error('The comparison is too large. Reduce the input to fewer than one million line pairs.')
  }
  const matrix = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1))
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      matrix[i][j] = a[i] === b[j]
        ? matrix[i + 1][j + 1] + 1
        : Math.max(matrix[i + 1][j], matrix[i][j + 1])
    }
  }
  const diff: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      diff.push({ kind: 'same', text: a[i] })
      i += 1
      j += 1
    }
    else if (matrix[i + 1][j] >= matrix[i][j + 1]) diff.push({ kind: 'removed', text: a[i++] })
    else diff.push({ kind: 'added', text: b[j++] })
  }
  while (i < a.length) diff.push({ kind: 'removed', text: a[i++] })
  while (j < b.length) diff.push({ kind: 'added', text: b[j++] })
  return diff
}
