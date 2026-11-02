'use client'

import { useEffect, useRef } from 'react'
import { canLoadAdSense, isValidAdSenseSlot } from '@/lib/adsense'

declare global {
  interface Window {
    adsbygoogle: Record<string, never>[]
  }
}

interface AdSenseUnitProps {
  slot: string | undefined
  placement: string
}

const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID
const adsEnabled = canLoadAdSense(publisherId)

export function AdSenseUnit({ slot, placement }: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null)
  const initialized = useRef(false)
  const validSlot = isValidAdSenseSlot(slot)

  useEffect(() => {
    if (!adsEnabled || !validSlot || !adRef.current || initialized.current) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      initialized.current = true
    } catch (error) {
      console.error(`AdSense failed to initialize placement "${placement}".`, error)
    }
  }, [placement, validSlot])

  if (!adsEnabled || !validSlot) return null

  return (
    <aside aria-label="Advertisement" className="mx-auto my-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200/70 bg-gray-50/50 p-2 dark:border-gray-800/70 dark:bg-gray-900/30">
        <ins
          ref={adRef}
          className="adsbygoogle block min-h-24 w-full sm:min-h-28 lg:min-h-32"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-adtest={process.env.NODE_ENV === 'development' ? 'on' : undefined}
        />
      </div>
    </aside>
  )
}
