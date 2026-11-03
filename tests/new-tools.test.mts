import assert from 'node:assert/strict'
import test from 'node:test'
import {
  compareText,
  convertTimestamp,
  decodeUrl,
  encodeUrl,
  formatHtml,
  formatXml,
  generateHash,
  jsonToCsv,
  minifyCss,
  parseMarkdown,
  testRegex,
} from '../src/lib/tools/new-tools.ts'
import { toolContent } from '../src/lib/tool-content.ts'
import { tools } from '../src/lib/tools/index.ts'
import { decodeBase64, encodeBase64 } from '../src/lib/tools/base64.ts'
import { decodeJWT } from '../src/lib/tools/jwt-decoder.ts'
import { formatJSON, minifyJSON } from '../src/lib/tools/json-formatter.ts'
import { generateMultipleUUIDs } from '../src/lib/tools/uuid-generator.ts'
import { formatSQL } from '../src/lib/tools/sql-formatter.ts'
import { canLoadAdSense, isValidAdSensePublisherId, isValidAdSenseSlot } from '../src/lib/adsense.ts'

test('all registered tools have page-specific SEO copy and useful FAQs', () => {
  assert.equal(tools.length, 21)
  for (const tool of tools) {
    const content = toolContent[tool.slug]
    assert.ok(content, `${tool.slug} is missing SEO content`)
    assert.ok(content.description.length > 80, `${tool.slug} needs a detailed meta description`)
    assert.equal(content.introduction.length, 2)
    assert.ok(content.introduction.every((paragraph) => paragraph.length > 100), `${tool.slug} needs detailed page content`)
    assert.ok(content.faqs.length >= 3, `${tool.slug} needs FAQ entries`)
  }
})

test('AdSense stays disabled until approval, consent readiness, and valid IDs are configured', () => {
  const approvalBefore = process.env.NEXT_PUBLIC_ADSENSE_APPROVED
  const consentBefore = process.env.NEXT_PUBLIC_ADSENSE_CONSENT_READY
  try {
    delete process.env.NEXT_PUBLIC_ADSENSE_APPROVED
    delete process.env.NEXT_PUBLIC_ADSENSE_CONSENT_READY
    assert.equal(canLoadAdSense('ca-pub-123456789'), false)
    process.env.NEXT_PUBLIC_ADSENSE_APPROVED = 'true'
    assert.equal(canLoadAdSense('ca-pub-123456789'), false)
    process.env.NEXT_PUBLIC_ADSENSE_CONSENT_READY = 'true'
    assert.equal(canLoadAdSense('not-a-publisher-id'), false)
    assert.equal(canLoadAdSense('ca-pub-123456789'), true)
    assert.equal(isValidAdSensePublisherId('ca-pub-123456789'), true)
    assert.equal(isValidAdSensePublisherId('pub-123456789'), false)
    assert.equal(isValidAdSenseSlot('987654321'), true)
    assert.equal(isValidAdSenseSlot('slot-id'), false)
  } finally {
    if (approvalBefore === undefined) delete process.env.NEXT_PUBLIC_ADSENSE_APPROVED
    else process.env.NEXT_PUBLIC_ADSENSE_APPROVED = approvalBefore
    if (consentBefore === undefined) delete process.env.NEXT_PUBLIC_ADSENSE_CONSENT_READY
    else process.env.NEXT_PUBLIC_ADSENSE_CONSENT_READY = consentBefore
  }
})

test('JSON formatter formats valid input and rejects invalid JSON', () => {
  assert.equal(formatJSON('{"a":1}', 2).output, '{\n  "a": 1\n}')
  assert.equal(minifyJSON('{ "a": 1 }').output, '{"a":1}')
  assert.equal(formatJSON('{broken}').success, false)
  assert.equal(minifyJSON('  ').success, false)
})

test('Base64 tool round-trips UTF-8 and rejects invalid input', () => {
  const encoded = encodeBase64('Hello, 世界')
  assert.equal(encoded.success, true)
  assert.equal(decodeBase64(encoded.output).output, 'Hello, 世界')
  assert.equal(decodeBase64('not base64!').success, false)
  assert.equal(encodeBase64('').success, false)
})

test('JWT decoder returns claims but rejects invalid structure and data', () => {
  const header = Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')
  const payload = Buffer.from('{"sub":"user-1","exp":4102444800}').toString('base64url')
  const decoded = decodeJWT(`${header}.${payload}.signature`)
  assert.equal(decoded.success, true)
  assert.equal(decoded.payload?.sub, 'user-1')
  assert.equal(decodeJWT('not-a-token').success, false)
  assert.equal(decodeJWT('@@.@@.sig').success, false)
})

test('UUID generator produces v4 values and clamps requested batch size', () => {
  const uuids = generateMultipleUUIDs(3)
  assert.equal(uuids.length, 3)
  assert.ok(uuids.every((uuid) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)))
  assert.equal(generateMultipleUUIDs(0).length, 1)
  assert.equal(generateMultipleUUIDs(101).length, 100)
})

test('SQL formatter formats query text and rejects empty input', () => {
  assert.match(formatSQL('select id,name from users', 2, 'upper'), /SELECT[\s\S]+FROM/)
  assert.throws(() => formatSQL('  ', 2, 'upper'), /Enter SQL/)
})

test('URL component encoder handles spaces and Unicode and rejects malformed escapes', () => {
  assert.equal(encodeUrl('hello world/雪'), 'hello%20world%2F%E9%9B%AA')
  assert.equal(decodeUrl('hello%20world%2F%E9%9B%AA'), 'hello world/雪')
  assert.throws(() => decodeUrl('%Q1'), /Invalid percent-encoded text/)
  assert.throws(() => encodeUrl(''), /Enter text/)
  assert.throws(() => encodeUrl('\uD800'), /invalid Unicode surrogate/)
})

test('XML formatter indents valid XML and rejects broken nesting', () => {
  assert.equal(formatXml('<root><value>yes</value></root>'), '<root>\n  <value>\n    yes\n  </value>\n</root>')
  assert.throws(() => formatXml('<root><value></root>'), /unexpected closing tag/)
  assert.throws(() => formatXml('<one/><two/>'), /exactly one root/)
  assert.throws(() => formatXml('outside<root/>'), /outside the root/)
  assert.throws(() => formatXml('<root>&missing</root>'), /entity references/)
  assert.throws(() => formatXml(''), /Enter XML/)
})

test('HTML formatter indents tags and rejects empty input', () => {
  assert.equal(formatHtml('<div><p>Hello</p></div>'), '<div>\n  <p>\n    Hello\n  </p>\n</div>')
  assert.throws(() => formatHtml('  '), /Enter HTML/)
})

test('CSS minifier preserves strings, removes comments, and checks malformed syntax', () => {
  assert.equal(minifyCss('/* note */ a { content: "a  b"; color: red; }'), 'a{content:"a  b";color:red}')
  assert.throws(() => minifyCss('a { color: red'), /missing closing brace/)
  assert.throws(() => minifyCss('a { content: "unterminated }'), /unclosed string/)
})

test('regex tester returns captures and reports invalid expressions', () => {
  assert.deepEqual(testRegex('(cat)', 'g', 'cat scat'), [
    { value: 'cat', index: 0, groups: ['cat'] },
    { value: 'cat', index: 5, groups: ['cat'] },
  ])
  assert.equal(testRegex('dog', '', 'cat').length, 0)
  assert.throws(() => testRegex('[', '', 'text'), /Invalid regular expression/)
  assert.throws(() => testRegex('', '', 'text'), /Enter a regular expression/)
})

test('Markdown parser handles common syntax and rejects an unclosed code fence', () => {
  const parsed = parseMarkdown('# Title\n\n**bold** and `code`\n- item\n> quote')
  assert.equal(parsed[0].kind, 'heading')
  assert.equal(parsed[1].kind, 'paragraph')
  assert.equal(parsed[2].kind, 'unordered-list')
  assert.equal(parsed[3].kind, 'quote')
  assert.throws(() => parseMarkdown('```ts\nconst value = 1'), /Unclosed fenced code block/)
  assert.throws(() => parseMarkdown(''), /Enter Markdown/)
})

test('JSON to CSV unions object keys and escapes CSV data', () => {
  assert.equal(jsonToCsv('[{"name":"Ada, L.","note":"said \\"hi\\""},{"name":"Lin"}]'), 'name,note\n"Ada, L.","said ""hi"""\nLin,')
  assert.throws(() => jsonToCsv('{ "name": "Ada" }'), /array of objects/)
  assert.throws(() => jsonToCsv('[1,2]'), /array of objects/)
  assert.throws(() => jsonToCsv('not json'), /Invalid JSON/)
})

test('timestamp converter accepts seconds, milliseconds, and rejects invalid input', () => {
  assert.equal(convertTimestamp('1735689600').iso, '2025-01-01T00:00:00.000Z')
  assert.equal(convertTimestamp('1735689600000').iso, '2025-01-01T00:00:00.000Z')
  assert.throws(() => convertTimestamp('not a date or timestamp'), /Invalid timestamp/)
  assert.throws(() => convertTimestamp(''), /Enter a Unix timestamp/)
})

test('hash generator returns a SHA-256 hex digest and validates empty text', async () => {
  assert.equal(await generateHash('abc', 'SHA-256'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  await assert.rejects(generateHash('', 'SHA-256'), /Enter text to hash/)
})

test('diff checker identifies inserted and removed lines and bounds large comparisons', () => {
  assert.deepEqual(compareText('alpha\nold', 'alpha\nnew'), [
    { kind: 'same', text: 'alpha' },
    { kind: 'removed', text: 'old' },
    { kind: 'added', text: 'new' },
  ])
  assert.deepEqual(compareText('', 'new'), [{ kind: 'added', text: 'new' }])
  assert.throws(() => compareText('', ''), /at least one/)
  const large = Array(1001).fill('line').join('\n')
  assert.throws(() => compareText(large, large), /too large/)
})
