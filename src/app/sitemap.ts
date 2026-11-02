import type { MetadataRoute } from 'next'
import { tools } from '@/lib/tools'

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://devtoolbox.app').replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${siteUrl}/${tool.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/tools`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    ...toolPages,
  ]
}
