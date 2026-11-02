import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { NewToolClient } from '@/components/tools/NewToolClient'
import { toolContent } from '@/lib/tool-content'
import { tools } from '@/lib/tools'
import { generateToolMetadata } from '@/lib/seo'

const newToolSlugs = [
  'url-encoder-decoder',
  'xml-formatter',
  'html-formatter',
  'css-minifier',
  'regex-tester',
  'markdown-previewer',
  'json-to-csv',
  'timestamp-converter',
  'hash-generator',
  'diff-checker',
]

export function generateStaticParams() {
  return newToolSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  return generateToolMetadata(slug)
}

export default async function NewToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!newToolSlugs.includes(slug) || !tools.some((tool) => tool.slug === slug) || !toolContent[slug]) notFound()
  return <NewToolClient slug={slug} />
}
