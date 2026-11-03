import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PhaseTwoToolClient } from '@/components/tools/PhaseTwoToolClient'
import { generateToolMetadata } from '@/lib/seo'
import { tools } from '@/lib/tools'

const phaseTwoSlugs = [
  'json-diff',
  'cron-generator',
  'jwt-generator',
  'sql-query-builder',
  'api-tester',
  'regex-explainer',
]

export function generateStaticParams() {
  return phaseTwoSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  return generateToolMetadata(slug)
}

export default async function PhaseTwoToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!phaseTwoSlugs.includes(slug) || !tools.some((tool) => tool.slug === slug)) notFound()
  return <PhaseTwoToolClient slug={slug} />
}
