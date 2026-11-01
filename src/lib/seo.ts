import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devtoolbox.app'
const siteName = 'DevToolBox'
const siteDescription =
  'Free online developer tools. Format JSON, decode JWTs, generate UUIDs, encode Base64, and format SQL — all in your browser.'

export function generateMetadata(opts: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = `${siteUrl}${opts.path}`
  return {
    title: `${opts.title} | ${siteName}`,
    description: opts.description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title: `${opts.title} | ${siteName}`,
      description: opts.description,
      url,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${opts.title} | ${siteName}`,
      description: opts.description,
    },
  }
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
}
