export interface Tool {
  slug: string
  name: string
  description: string
  category: string
  icon: string
  popular?: boolean
}

export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data with syntax highlighting and error detection.',
    category: 'Formatters',
    icon: '{ }',
    popular: true,
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens. View header, payload, and expiration info.',
    category: 'Security',
    icon: '🔑',
    popular: true,
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate cryptographically secure UUID v4 values. Single or bulk generation.',
    category: 'Generators',
    icon: '🆔',
    popular: true,
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text to Base64 or decode Base64 back to plain text. Supports UTF-8.',
    category: 'Encoders',
    icon: '🔤',
    popular: true,
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries with configurable indentation and keyword casing.',
    category: 'Formatters',
    icon: '🗄️',
    popular: true,
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    description: 'Encode URL components safely or decode percent-encoded text in your browser.',
    category: 'Encoders',
    icon: '🔗',
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Validate and indent XML documents locally, with helpful errors for malformed markup.',
    category: 'Formatters',
    icon: '🧾',
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Make compact HTML easier to read with consistent indentation.',
    category: 'Formatters',
    icon: '🌐',
  },
  {
    slug: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Remove unnecessary CSS whitespace and comments while checking basic syntax.',
    category: 'Formatters',
    icon: '🎨',
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test JavaScript regular expressions against sample text and inspect matches.',
    category: 'Text',
    icon: '🔍',
  },
  {
    slug: 'markdown-previewer',
    name: 'Markdown Previewer',
    description: 'Preview common Markdown headings, lists, emphasis, and code without sending text anywhere.',
    category: 'Text',
    icon: '📝',
  },
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert an array of JSON objects into properly escaped CSV data.',
    category: 'Converters',
    icon: '📊',
  },
  {
    slug: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert Unix seconds, milliseconds, or date strings into readable UTC and local dates.',
    category: 'Converters',
    icon: '🕒',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate SHA-1, SHA-256, SHA-384, or SHA-512 digests locally with Web Crypto.',
    category: 'Security',
    icon: '#',
  },
  {
    slug: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare two text blocks and review added, removed, and unchanged lines.',
    category: 'Text',
    icon: '↔️',
  },
]

export const categories = [...new Set(tools.map((t) => t.category))]

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug)
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category)
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase()
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  )
}
