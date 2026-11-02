import type { Metadata } from 'next'
import { ToolsClient } from '@/components/tool-pages/ToolsClient'
import { generateMetadata as createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'All Online Developer Tools',
  description: 'Browse free browser-based developer utilities for formatting, encoding, conversion, testing, and text comparison.',
  path: '/tools',
})

export default function ToolsPage() {
  return <ToolsClient />
}
