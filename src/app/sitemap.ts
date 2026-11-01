import type { MetadataRoute } from 'next'
import { tools } from '@/lib/tools'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devtoolbox.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${siteUrl}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...toolPages,
  ]
}
