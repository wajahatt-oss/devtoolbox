export interface Base64Result {
  success: boolean
  output: string
  error?: string
}

export function encodeBase64(input: string): Base64Result {
  if (!input) return { success: false, output: '', error: 'Input is empty.' }
  try {
    // Handle UTF-8 properly
    const encoded = btoa(
      encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    )
    return { success: true, output: encoded }
  } catch (e) {
    return { success: false, output: '', error: `Encoding failed: ${(e as Error).message}` }
  }
}

export function decodeBase64(input: string): Base64Result {
  if (!input.trim()) return { success: false, output: '', error: 'Input is empty.' }
  try {
    const decoded = decodeURIComponent(
      atob(input.trim())
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return { success: true, output: decoded }
  } catch (e) {
    return {
      success: false,
      output: '',
      error: `Invalid Base64 input: ${(e as Error).message}`,
    }
  }
}
