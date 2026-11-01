export type IndentSize = 2 | 4

export interface FormatResult {
  success: boolean
  output: string
  error?: string
}

export function formatJSON(input: string, indent: IndentSize = 2): FormatResult {
  if (!input.trim()) {
    return { success: false, output: '', error: 'Input is empty.' }
  }
  try {
    const parsed = JSON.parse(input)
    return { success: true, output: JSON.stringify(parsed, null, indent) }
  } catch (e) {
    const msg = (e as Error).message
    return { success: false, output: '', error: `Invalid JSON: ${msg}` }
  }
}

export function minifyJSON(input: string): FormatResult {
  if (!input.trim()) {
    return { success: false, output: '', error: 'Input is empty.' }
  }
  try {
    const parsed = JSON.parse(input)
    return { success: true, output: JSON.stringify(parsed) }
  } catch (e) {
    const msg = (e as Error).message
    return { success: false, output: '', error: `Invalid JSON: ${msg}` }
  }
}

export function validateJSON(input: string): { valid: boolean; error?: string } {
  if (!input.trim()) return { valid: false, error: 'Input is empty.' }
  try {
    JSON.parse(input)
    return { valid: true }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}
