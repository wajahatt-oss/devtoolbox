export type JsonChangeKind = 'added' | 'removed' | 'modified'

export interface JsonChange {
  path: string
  kind: JsonChangeKind
  left: unknown
  right: unknown
}

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function diffJson(leftInput: string, rightInput: string): JsonChange[] {
  if (!leftInput.trim() || !rightInput.trim()) {
    throw new Error('Enter JSON in both inputs to compare.')
  }
  if (leftInput.length > 1_000_000 || rightInput.length > 1_000_000) {
    throw new Error('Keep each JSON document under 1 MB to compare it responsively.')
  }

  let left: unknown
  let right: unknown
  try {
    left = JSON.parse(leftInput)
  } catch (error) {
    throw new Error(`Invalid original JSON: ${(error as Error).message}`)
  }
  try {
    right = JSON.parse(rightInput)
  } catch (error) {
    throw new Error(`Invalid updated JSON: ${(error as Error).message}`)
  }

  const changes: JsonChange[] = []
  const pending: { before: unknown; after: unknown; path: string }[] = [
    { before: left, after: right, path: '' },
  ]
  const addChange = (change: JsonChange) => {
    changes.push(change)
    if (changes.length > 5000) throw new Error('The comparison has more than 5,000 changes. Reduce the input and compare again.')
  }

  while (pending.length) {
    const { before, after, path } = pending.pop()!
    if (Object.is(before, after)) continue
    if (Array.isArray(before) && Array.isArray(after)) {
      const length = Math.max(before.length, after.length)
      for (let index = length - 1; index >= 0; index -= 1) {
        const childPath = `${path}[${index}]`
        if (index >= before.length) addChange({ path: childPath, kind: 'added', left: undefined, right: after[index] })
        else if (index >= after.length) addChange({ path: childPath, kind: 'removed', left: before[index], right: undefined })
        else pending.push({ before: before[index], after: after[index], path: childPath })
      }
      continue
    }
    if (isJsonRecord(before) && isJsonRecord(after)) {
      const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])]
      for (let index = keys.length - 1; index >= 0; index -= 1) {
        const key = keys[index]
        const childPath = path ? `${path}.${key}` : key
        if (!Object.hasOwn(after, key)) addChange({ path: childPath, kind: 'removed', left: before[key], right: undefined })
        else if (!Object.hasOwn(before, key)) addChange({ path: childPath, kind: 'added', left: undefined, right: after[key] })
        else pending.push({ before: before[key], after: after[key], path: childPath })
      }
      continue
    }
    addChange({ path: path || '$', kind: 'modified', left: before, right: after })
  }
  return changes
}

const CRON_BOUNDS = [
  { min: 0, max: 59, label: 'minute' },
  { min: 0, max: 23, label: 'hour' },
  { min: 1, max: 31, label: 'day of month' },
  { min: 1, max: 12, label: 'month' },
  { min: 0, max: 7, label: 'day of week' },
] as const

type CronField = (typeof CRON_BOUNDS)[number]

function parseCronField(value: string, field: CronField): number[] {
  if (!value) throw new Error(`The ${field.label} field is empty.`)
  const values = new Set<number>()

  for (const part of value.split(',')) {
    const [rangePart, stepPart, ...extra] = part.split('/')
    if (extra.length || (stepPart !== undefined && !/^\d+$/.test(stepPart))) {
      throw new Error(`Invalid ${field.label} field: "${part}".`)
    }
    const step = stepPart === undefined ? 1 : Number(stepPart)
    if (step < 1) throw new Error(`The ${field.label} step must be at least 1.`)

    let start: number
    let end: number
    if (rangePart === '*') {
      start = field.min
      end = field.max
    } else {
      const range = rangePart.split('-')
      if (range.some((item) => !/^\d+$/.test(item)) || range.length > 2) {
        throw new Error(`Invalid ${field.label} value: "${rangePart}".`)
      }
      start = Number(range[0])
      end = range.length === 2 ? Number(range[1]) : stepPart === undefined ? start : field.max
      if (range.length === 2 && end < start) {
        throw new Error(`The ${field.label} range cannot end before it starts.`)
      }
    }

    if (start < field.min || end > field.max) {
      throw new Error(`${field.label} values must be between ${field.min} and ${field.max}.`)
    }
    for (let current = start; current <= end; current += step) values.add(current)
  }

  return [...values].sort((a, b) => a - b)
}

interface ParsedCron {
  values: [number[], number[], number[], number[], number[]]
  wildcard: [boolean, boolean, boolean, boolean, boolean]
}

function parseCron(expression: string): ParsedCron {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) throw new Error('Use a five-field cron expression: minute hour day month weekday.')
  const parsed = CRON_BOUNDS.map((field, index) => parseCronField(parts[index], field))
  const weekday = parsed[4].map((day) => day === 7 ? 0 : day)
  return {
    values: [parsed[0], parsed[1], parsed[2], parsed[3], [...new Set(weekday)].sort((a, b) => a - b)],
    wildcard: [parts[0] === '*', parts[1] === '*', parts[2] === '*', parts[3] === '*', parts[4] === '*'],
  }
}

export function validateCron(expression: string): string {
  parseCron(expression)
  return expression.trim().split(/\s+/).join(' ')
}

export function describeCron(expression: string): string {
  const normalized = validateCron(expression)
  const [minute, hour, day, month, weekday] = normalized.split(' ')
  const descriptions = [
    minute === '*' ? 'every minute' : minute.startsWith('*/') ? `every ${minute.slice(2)} minutes` : `at minute ${minute}`,
    hour === '*' ? 'every hour' : hour.startsWith('*/') ? `every ${hour.slice(2)} hours` : `at hour ${hour}`,
    day === '*' ? 'every day of the month' : `on day ${day} of the month`,
    month === '*' ? 'every month' : `in month ${month}`,
    weekday === '*' ? 'every day of the week' : `on weekday ${weekday}`,
  ]
  if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    return 'Runs every minute.'
  }
  return `Runs ${descriptions.join(', ')} (in your local time zone).`
}

export function nextCronRuns(expression: string, count = 5, from = new Date()): Date[] {
  const cron = parseCron(expression)
  const runs: Date[] = []
  const start = new Date(from)
  const maxDays = 5 * 366
  for (let dayOffset = 0; dayOffset < maxDays && runs.length < count; dayOffset += 1) {
    const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + dayOffset)
    const weekday = day.getDay()
    const dayMatches = cron.values[2].includes(day.getDate())
    const weekdayMatches = cron.values[4].includes(weekday)
    const calendarMatches = cron.wildcard[2] || cron.wildcard[4]
      ? dayMatches && weekdayMatches
      : dayMatches || weekdayMatches
    if (!cron.values[3].includes(day.getMonth() + 1) || !calendarMatches) continue

    for (const hour of cron.values[1]) {
      for (const minute of cron.values[0]) {
        const candidate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute)
        if (
          candidate.getFullYear() === day.getFullYear()
          && candidate.getMonth() === day.getMonth()
          && candidate.getDate() === day.getDate()
          && candidate.getHours() === hour
          && candidate.getMinutes() === minute
          && candidate.getTime() > start.getTime()
        ) {
          runs.push(candidate)
          if (runs.length === count) break
        }
      }
      if (runs.length === count) break
    }
  }
  if (runs.length < count) throw new Error('Could not find enough run times within five years.')
  return runs
}

export type JwtTestAlgorithm = 'HS256' | 'HS384' | 'HS512'

function encodeBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export async function generateTestJwt(
  headerInput: string,
  payloadInput: string,
  algorithm: JwtTestAlgorithm,
  secret: string,
): Promise<string> {
  if (!secret) throw new Error('Enter a test signing secret.')
  if (!globalThis.crypto?.subtle) throw new Error('Web Crypto is unavailable. Use HTTPS or localhost.')

  let header: unknown
  let payload: unknown
  try {
    header = JSON.parse(headerInput)
  } catch (error) {
    throw new Error(`Invalid header JSON: ${(error as Error).message}`)
  }
  try {
    payload = JSON.parse(payloadInput)
  } catch (error) {
    throw new Error(`Invalid payload JSON: ${(error as Error).message}`)
  }
  if (!isJsonRecord(header)) throw new Error('The JWT header must be a JSON object.')
  if (!isJsonRecord(payload)) throw new Error('The JWT payload must be a JSON object.')
  if (header.alg !== algorithm) throw new Error(`Set the header alg to ${algorithm} to match the selected signing algorithm.`)

  const signingInput = `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(JSON.stringify(payload))}`
  const hash = `SHA-${algorithm.slice(2)}`
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash },
    false,
    ['sign'],
  )
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput))
  const signatureBytes = new Uint8Array(signature)
  let binary = ''
  for (let offset = 0; offset < signatureBytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...signatureBytes.subarray(offset, offset + 0x8000))
  }
  const encodedSignature = btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${signingInput}.${encodedSignature}`
}

export type SqlDialect = 'postgres' | 'mysql' | 'sqlserver'
export type SqlOperation = 'select' | 'insert' | 'update' | 'delete'

export interface SqlBuilderInput {
  operation: SqlOperation
  table: string
  columns: string
  values: string
  where: string
  dialect: SqlDialect
}

function quoteIdentifier(identifier: string, dialect: SqlDialect): string {
  const parts = identifier.trim().split('.')
  if (!parts.length || parts.some((part) => !/^[A-Za-z_][A-Za-z0-9_$]*$/.test(part))) {
    throw new Error(`Invalid SQL identifier: "${identifier}". Use letters, numbers, underscores, and dots for qualified names.`)
  }
  const [open, close] = dialect === 'mysql' ? ['`', '`'] : dialect === 'sqlserver' ? ['[', ']'] : ['"', '"']
  return parts.map((part) => `${open}${part}${close}`).join('.')
}

function sqlLiteral(value: unknown, dialect: SqlDialect): string {
  if (value === null) return 'NULL'
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'boolean') {
    return dialect === 'sqlserver' ? (value ? '1' : '0') : (value ? 'TRUE' : 'FALSE')
  }
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
  throw new Error('SQL builder values must be strings, numbers, booleans, or null.')
}

export function buildSqlQuery(input: SqlBuilderInput): string {
  const table = quoteIdentifier(input.table, input.dialect)
  const where = input.where.trim()
  const columns = input.columns.split(',').map((column) => column.trim()).filter(Boolean)

  if (input.operation === 'select') {
    const selection = columns.length
      ? columns.map((column) => column === '*' ? '*' : quoteIdentifier(column, input.dialect)).join(', ')
      : '*'
    return `SELECT ${selection}\nFROM ${table}${where ? `\nWHERE ${where}` : ''};`
  }

  if (input.operation === 'delete') {
    if (!where) throw new Error('Add a WHERE condition before generating DELETE to avoid deleting every row.')
    return `DELETE FROM ${table}\nWHERE ${where};`
  }

  let values: unknown
  try {
    values = JSON.parse(input.values)
  } catch (error) {
    throw new Error(`Values must be a JSON object: ${(error as Error).message}`)
  }
  if (!isJsonRecord(values) || !Object.keys(values).length) {
    throw new Error('Enter a non-empty JSON object of column names and values.')
  }

  const entries = Object.entries(values)
  const columnList = entries.map(([column]) => quoteIdentifier(column, input.dialect)).join(', ')
  if (input.operation === 'insert') {
    const valueList = entries.map(([, value]) => sqlLiteral(value, input.dialect)).join(', ')
    return `INSERT INTO ${table} (${columnList})\nVALUES (${valueList});`
  }
  if (!where) throw new Error('Add a WHERE condition before generating UPDATE to avoid updating every row.')
  const assignments = entries
    .map(([column, value]) => `${quoteIdentifier(column, input.dialect)} = ${sqlLiteral(value, input.dialect)}`)
    .join(',\n  ')
  return `UPDATE ${table}\nSET ${assignments}\nWHERE ${where};`
}

function isPrivateIpv4(hostname: string): boolean {
  const octets = hostname.split('.').map(Number)
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) return false
  const [first, second] = octets
  return first === 0 || first === 10 || first === 127
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168)
    || (first === 100 && second >= 64 && second <= 127)
    || first >= 224
}

function isPrivateIpv6(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  return normalized === '::' || normalized === '::1'
    || normalized.startsWith('fc') || normalized.startsWith('fd')
    || /^fe[89ab]/.test(normalized)
    || normalized.startsWith('ff')
    || normalized.startsWith('::ffff:')
}

export function validateApiRequestUrl(input: string): URL {
  let url: URL
  try {
    url = new URL(input)
  } catch {
    throw new Error('Enter a valid absolute URL, including https://.')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS request URLs are supported.')
  }
  if (url.username || url.password) throw new Error('Remove credentials from the URL and provide authorization using a request header.')
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '')
  if (
    hostname === 'localhost'
    || hostname.endsWith('.localhost')
    || hostname.endsWith('.local')
    || isPrivateIpv4(hostname)
    || isPrivateIpv6(hostname)
  ) {
    throw new Error('Requests to local and private network hosts are blocked.')
  }
  return url
}

export type RegexTokenKind = 'literal' | 'escape' | 'character class' | 'group' | 'quantifier' | 'anchor' | 'alternation'

export interface RegexToken {
  token: string
  kind: RegexTokenKind
  explanation: string
}

export function explainRegex(pattern: string): RegexToken[] {
  if (!pattern) throw new Error('Enter a regular expression.')
  const tokens: RegexToken[] = []
  for (let index = 0; index < pattern.length;) {
    const current = pattern[index]
    let token: string
    let kind: RegexTokenKind
    let explanation: string
    if (current === '\\') {
      if (index + 1 >= pattern.length) throw new Error('The pattern ends with an incomplete escape.')
      token = pattern.slice(index, index + 2)
      const escapes: Record<string, string> = {
        d: 'a digit (0–9)',
        D: 'a non-digit',
        w: 'a word character',
        W: 'a non-word character',
        s: 'a whitespace character',
        S: 'a non-whitespace character',
        b: 'a word boundary',
        B: 'a non-word boundary',
        n: 'a newline',
        t: 'a tab',
      }
      kind = 'escape'
      explanation = escapes[token[1]] ?? `the literal character "${token[1]}"`
      index += 2
    } else if (current === '[') {
      const end = pattern.indexOf(']', index + 1)
      if (end === -1) throw new Error('The character class is not closed.')
      token = pattern.slice(index, end + 1)
      kind = 'character class'
      explanation = token[1] === '^' ? 'any character not listed' : 'any one listed character'
      index = end + 1
    } else if (current === '(') {
      token = pattern.startsWith('(?:', index) ? '(?:' : pattern.startsWith('(?', index) ? pattern.slice(index, index + 3) : '('
      kind = 'group'
      explanation = token === '(' ? 'start a capturing group' : token === '(?:' ? 'start a non-capturing group' : 'start a lookaround or special group'
      index += token.length
    } else if (current === ')') {
      token = current
      kind = 'group'
      explanation = 'end a group'
      index += 1
    } else if (current === '^' || current === '$') {
      token = current
      kind = 'anchor'
      explanation = current === '^' ? 'start of input (or line with the m flag)' : 'end of input (or line with the m flag)'
      index += 1
    } else if (current === '|') {
      token = current
      kind = 'alternation'
      explanation = 'match either side of this alternative'
      index += 1
    } else if ('*+?{'.includes(current)) {
      const quantifier = current === '{' ? pattern.slice(index).match(/^\{\d+(?:,\d*)?\}/)?.[0] : current
      if (!quantifier) throw new Error('Invalid quantifier. Use *, +, ?, or a range like {2,4}.')
      token = quantifier
      kind = 'quantifier'
      const explanations: Record<string, string> = { '*': 'repeat the previous item zero or more times', '+': 'repeat the previous item one or more times', '?': 'make the previous item optional' }
      explanation = explanations[token] ?? `repeat the previous item ${token.slice(1, -1)} times`
      index += token.length
      if (pattern[index] === '?') {
        token += '?'
        explanation += ' (lazy match)'
        index += 1
      }
    } else if (current === '.') {
      token = current
      kind = 'literal'
      explanation = 'any character except a line terminator'
      index += 1
    } else {
      token = current
      kind = 'literal'
      explanation = `the literal character "${current}"`
      index += 1
    }
    tokens.push({ token, kind, explanation })
  }
  return tokens
}
