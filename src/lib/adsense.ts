const PUBLISHER_ID_PATTERN = /^ca-pub-\d+$/
const SLOT_ID_PATTERN = /^\d+$/

export function isValidAdSensePublisherId(publisherId: string | undefined): publisherId is string {
  return !!publisherId && PUBLISHER_ID_PATTERN.test(publisherId)
}

export function isAdSenseApproved(): boolean {
  return process.env.NEXT_PUBLIC_ADSENSE_APPROVED === 'true'
    && process.env.NEXT_PUBLIC_ADSENSE_CONSENT_READY === 'true'
}

export function canLoadAdSense(publisherId: string | undefined): publisherId is string {
  return isAdSenseApproved() && isValidAdSensePublisherId(publisherId)
}

export function isValidAdSenseSlot(slotId: string | undefined): slotId is string {
  return !!slotId && SLOT_ID_PATTERN.test(slotId)
}
