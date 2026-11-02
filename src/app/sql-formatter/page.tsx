import { SqlFormatterClient } from '@/components/tool-pages/SqlFormatterClient'
import { generateToolMetadata } from '@/lib/seo'

export const metadata = generateToolMetadata('sql-formatter')

export default function SqlFormatterPage() {
  return <SqlFormatterClient />
}
