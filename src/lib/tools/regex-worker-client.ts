export interface RegexWorkerMatch {
  value: string
  index: number
  groups: string[]
}

export function findRegexMatches(pattern: string, flags: string, text: string): Promise<RegexWorkerMatch[]> {
  if (!pattern) return Promise.reject(new Error('Enter a regular expression.'))
  if (pattern.length > 500) return Promise.reject(new Error('Keep the regular expression under 500 characters.'))
  if (text.length > 5000) return Promise.reject(new Error('Keep the test text under 5,000 characters for responsive matching.'))

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./regex-worker.ts', import.meta.url), { type: 'module' })
    let executionTimeout: ReturnType<typeof setTimeout>
    const startupTimeout = setTimeout(() => {
      worker.terminate()
      reject(new Error('The regular expression worker did not start.'))
    }, 10_000)

    worker.onmessage = (event: MessageEvent<{ ready?: boolean; matches?: RegexWorkerMatch[]; error?: string }>) => {
      if (event.data.ready) {
        clearTimeout(startupTimeout)
        executionTimeout = setTimeout(() => {
          worker.terminate()
          reject(new Error('Matching took too long. Simplify the expression or use a shorter test string.'))
        }, 500)
        worker.postMessage({ pattern, flags, text })
        return
      }
      clearTimeout(startupTimeout)
      clearTimeout(executionTimeout)
      worker.terminate()
      if (event.data.error) reject(new Error(`Invalid regular expression: ${event.data.error}`))
      else resolve(event.data.matches ?? [])
    }
    worker.onerror = () => {
      clearTimeout(startupTimeout)
      clearTimeout(executionTimeout)
      worker.terminate()
      reject(new Error('The regular expression worker could not run.'))
    }
  })
}
