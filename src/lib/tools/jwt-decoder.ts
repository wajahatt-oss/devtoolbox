export interface JWTHeader {
  alg?: string
  typ?: string
  [key: string]: unknown
}

export interface JWTPayload {
  sub?: string
  iss?: string
  aud?: string | string[]
  exp?: number
  iat?: number
  nbf?: number
  [key: string]: unknown
}

export interface JWTDecodeResult {
  success: boolean
  header?: JWTHeader
  payload?: JWTPayload
  signature?: string
  error?: string
  isExpired?: boolean
  expiresAt?: Date
  issuedAt?: Date
}

function base64UrlDecode(str: string): string {
  // Replace URL-safe chars and add padding
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4)
  const decoded = atob(padded)
  // Handle UTF-8 multi-byte characters
  return decodeURIComponent(
    decoded
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
}

export function decodeJWT(token: string): JWTDecodeResult {
  if (!token || !token.trim()) {
    return { success: false, error: 'Token is empty.' }
  }

  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    return {
      success: false,
      error: `Invalid JWT structure. Expected 3 parts separated by dots, got ${parts.length}.`,
    }
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as JWTHeader
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JWTPayload
    const signature = parts[2]

    const now = Math.floor(Date.now() / 1000)
    const isExpired = typeof payload.exp === 'number' ? payload.exp < now : false
    const expiresAt = typeof payload.exp === 'number' ? new Date(payload.exp * 1000) : undefined
    const issuedAt = typeof payload.iat === 'number' ? new Date(payload.iat * 1000) : undefined

    return {
      success: true,
      header,
      payload,
      signature,
      isExpired,
      expiresAt,
      issuedAt,
    }
  } catch (e) {
    return {
      success: false,
      error: `Failed to decode JWT: ${(e as Error).message}`,
    }
  }
}
