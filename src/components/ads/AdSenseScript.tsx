import Script from 'next/script'
import { canLoadAdSense } from '@/lib/adsense'

const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID

export function AdSenseScript() {
  if (!canLoadAdSense(publisherId)) return null

  return (
    <Script
      id="google-adsense"
      async
      crossOrigin="anonymous"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
    />
  )
}
