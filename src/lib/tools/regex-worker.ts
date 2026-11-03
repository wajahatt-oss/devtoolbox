interface RegexWorkerRequest {
  pattern: string
  flags: string
  text: string
}

interface RegexWorkerMatch {
  value: string
  index: number
  groups: string[]
}

self.onmessage = (event: MessageEvent<RegexWorkerRequest>) => {
  try {
    const expression = new RegExp(event.data.pattern, event.data.flags)
    const matches: RegexWorkerMatch[] = []
    let match: RegExpExecArray | null
    do {
      match = expression.exec(event.data.text)
      if (!match) break
      matches.push({ value: match[0], index: match.index, groups: match.slice(1) })
      if (matches.length >= 1000 || (!expression.global && !expression.sticky)) break
      if (match[0] === '') expression.lastIndex += 1
    } while (true)
    self.postMessage({ matches })
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Invalid regular expression.' })
  }
}

self.postMessage({ ready: true })
