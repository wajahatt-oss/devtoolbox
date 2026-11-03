import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildSqlQuery,
  describeCron,
  diffJson,
  explainRegex,
  generateTestJwt,
  nextCronRuns,
  validateApiRequestUrl,
  validateCron,
} from '../src/lib/tools/phase-two.ts'
import { getToolHref, tools } from '../src/lib/tools/index.ts'

test('all Phase 2 tools are registered with dedicated paths and SEO content', async () => {
  const slugs = ['json-diff', 'cron-generator', 'jwt-generator', 'sql-query-builder', 'api-tester', 'regex-explainer']
  const { toolContent } = await import('../src/lib/tool-content.ts')
  for (const slug of slugs) {
    const tool = tools.find((entry) => entry.slug === slug)
    assert.ok(tool, `${slug} is missing from the tool registry`)
    assert.equal(getToolHref(tool), `/tools/${slug}`)
    assert.ok(toolContent[slug]?.description.length > 80, `${slug} is missing SEO copy`)
    assert.ok(toolContent[slug]?.faqs.length >= 3, `${slug} needs FAQs`)
  }
})

test('JSON diff reports nested object and array changes and rejects invalid or oversized input', () => {
  assert.deepEqual(diffJson(
    '{"user":{"name":"Ada","roles":["reader"]},"enabled":true}',
    '{"user":{"name":"Grace","roles":["reader","admin"],"id":1},"enabled":true}',
  ), [
    { path: 'user.id', kind: 'added', left: undefined, right: 1 },
    { path: 'user.name', kind: 'modified', left: 'Ada', right: 'Grace' },
    { path: 'user.roles[1]', kind: 'added', left: undefined, right: 'admin' },
  ])
  assert.deepEqual(diffJson('{"value":1}', '{"value":1}'), [])
  assert.throws(() => diffJson('{', '{}'), /Invalid original JSON/)
  assert.throws(() => diffJson('{}', ''), /both inputs/)
  assert.throws(() => diffJson('x'.repeat(1_000_001), '{}'), /under 1 MB/)
})

test('cron validation explains schedules and calculates upcoming local run times', () => {
  assert.equal(validateCron(' */15 9-17 * * 1-5 '), '*/15 9-17 * * 1-5')
  assert.match(describeCron('*/15 * * * *'), /every 15 minutes/)
  assert.throws(() => validateCron('0 60 * * *'), /hour values must be between 0 and 23/)
  assert.throws(() => validateCron('* * * *'), /five-field/)
  const start = new Date(2024, 0, 1, 8, 59, 30)
  const next = nextCronRuns('*/15 * * * *', 2, start)
  assert.equal(next[0].getHours(), 9)
  assert.equal(next[0].getMinutes(), 0)
  assert.equal(next[1].getMinutes(), 15)
  const stepped = nextCronRuns('3/5 * * * *', 2, new Date(2024, 0, 1, 0, 2))
  assert.deepEqual(stepped.map((run) => run.getMinutes()), [3, 8])
  const weekday = nextCronRuns('0 9 * * 1-5', 1, start)[0]
  assert.equal(weekday.getDay(), 1)
  assert.equal(weekday.getHours(), 9)
})

test('JWT generator signs a test token with HMAC and validates JSON and algorithm', async () => {
  const header = '{"alg":"HS256","typ":"JWT"}'
  const payload = '{"sub":"demo-user","exp":1893459600}'
  const token = await generateTestJwt(header, payload, 'HS256', 'disposable-test-secret')
  const [encodedHeader, encodedPayload, signature] = token.split('.')
  assert.equal(JSON.parse(Buffer.from(encodedHeader, 'base64url').toString()).alg, 'HS256')
  assert.equal(JSON.parse(Buffer.from(encodedPayload, 'base64url').toString()).sub, 'demo-user')
  assert.match(signature, /^[A-Za-z0-9_-]+$/)
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode('disposable-test-secret'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  assert.equal(await crypto.subtle.verify(
    'HMAC',
    key,
    Buffer.from(signature, 'base64url'),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  ), true)
  await assert.rejects(generateTestJwt(header, payload, 'HS512', 'test'), /match the selected/)
  await assert.rejects(generateTestJwt('[]', payload, 'HS256', 'test'), /header must be a JSON object/)
  await assert.rejects(generateTestJwt(header, payload, 'HS256', ''), /test signing secret/)
})

test('SQL builder quotes identifiers and refuses unbounded destructive queries', () => {
  const insert = buildSqlQuery({
    operation: 'insert',
    dialect: 'mysql',
    table: 'app.users',
    columns: '',
    values: JSON.stringify({ name: "O'Reilly", active: true }),
    where: '',
  })
  assert.equal(insert, "INSERT INTO `app`.`users` (`name`, `active`)\nVALUES ('O''Reilly', TRUE);")
  assert.equal(buildSqlQuery({
    operation: 'select',
    dialect: 'sqlserver',
    table: 'dbo.users',
    columns: 'id, name',
    values: '',
    where: 'id = 1',
  }), 'SELECT [id], [name]\nFROM [dbo].[users]\nWHERE id = 1;')
  assert.throws(() => buildSqlQuery({
    operation: 'delete', dialect: 'postgres', table: 'users', columns: '', values: '', where: '',
  }), /WHERE condition/)
  assert.throws(() => buildSqlQuery({
    operation: 'update', dialect: 'postgres', table: 'users', columns: '', values: '{"name":"Ada"}', where: '',
  }), /WHERE condition/)
  assert.throws(() => buildSqlQuery({
    operation: 'select', dialect: 'postgres', table: 'users; DROP TABLE users', columns: '*', values: '', where: '',
  }), /Invalid SQL identifier/)
})

test('API tester only accepts HTTP(S), blocks obvious private hosts, and permits public URLs', () => {
  assert.equal(validateApiRequestUrl('https://api.example.com/v1/items').hostname, 'api.example.com')
  const blockedUrls = [
    ['file:///etc/passwd', /HTTP and HTTPS/],
    ['http://localhost/admin', /private network hosts/],
    ['http://service.local/private', /private network hosts/],
    ['http://127.0.0.1/', /private network hosts/],
    ['http://localhost./', /private network hosts/],
    ['http://192.168.1.20/', /private network hosts/],
    ['http://[::1]/', /private network hosts/],
    ['http://[::ffff:127.0.0.1]/', /private network hosts/],
    ['https://user:password@example.com/', /Remove credentials/],
  ] as const
  for (const [url, expectedError] of blockedUrls) {
    assert.throws(() => validateApiRequestUrl(url), expectedError, url)
  }
})

test('regex explainer describes common syntax and rejects incomplete classes or escapes', () => {
  const explanation = explainRegex(String.raw`^\w+\s?$`)
  assert.ok(explanation.some((part) => part.kind === 'anchor'))
  assert.ok(explanation.some((part) => part.explanation === 'a word character'))
  assert.ok(explanation.some((part) => part.explanation === 'a whitespace character'))
  assert.throws(() => explainRegex('['), /character class is not closed/)
  assert.throws(() => explainRegex('\\'), /incomplete escape/)
})
