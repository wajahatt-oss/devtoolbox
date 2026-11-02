import type { Metadata } from 'next'
import { getToolBySlug } from '@/lib/tools'
import { toolContent } from '@/lib/tool-content'

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://devtoolbox.app').replace(/\/$/, '')
const siteName = 'DevToolBox'
const siteDescription =
  'Free browser-based developer tools for formatting, encoding, conversion, testing, and text comparison. Your tool input stays on your device.'

export function generateMetadata(opts: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = `${siteUrl}${opts.path}`
  return {
    title: opts.title,
    description: opts.description,
    keywords: ['free developer tools', 'online developer tools', opts.title.toLowerCase(), 'browser-based tools'],
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title: `${opts.title} | ${siteName}`,
      description: opts.description,
      url,
      siteName,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title: `${opts.title} | ${siteName}`,
      description: opts.description,
    },
  }
}

export function generateToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug)
  const content = toolContent[slug]
  if (!tool || !content) return { title: 'Tool not found' }
  return generateMetadata({
    title: content.title,
    description: content.description,
    path: `/${slug}`,
  })
}

export const defaultMetadata: Metadata = {
  title: {
    default: `${siteName} — Free Online Developer Tools`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: `${siteName} — Free Online Developer Tools`,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Free Online Developer Tools`,
    description: siteDescription,
  },
}
