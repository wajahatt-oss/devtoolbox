import { JsonFormatterClient } from '@/components/tool-pages/JsonFormatterClient'
import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('json-formatter')

export default function JsonFormatterPage() {
  return <JsonFormatterClient />
}
