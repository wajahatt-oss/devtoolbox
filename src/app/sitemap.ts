import type { MetadataRoute } from 'next'
import { getToolHref, tools } from '@/lib/tools'
import { siteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${siteUrl}${getToolHref(tool)}`,
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
