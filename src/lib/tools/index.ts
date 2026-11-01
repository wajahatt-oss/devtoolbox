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
