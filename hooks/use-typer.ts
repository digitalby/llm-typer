import { useCallback, useRef, useState } from 'react'

export type TypingMode = 'letter' | 'word'
export type TypingStatus = 'idle' | 'typing' | 'done'

export interface UseTyperOptions {
  /** Base delay in milliseconds between each token. */
  speed: number
  /** Jitter factor 0–1: each tick fires at speed ± (speed * jitter * random). Default 0.5. */
  jitter?: number
  mode: TypingMode
}

export interface UseTyperResult {
  displayed: string
  status: TypingStatus
  start: (text: string) => void
  stop: () => void
  reset: () => void
}

function tokenize(text: string, mode: TypingMode): string[] {
  if (mode === 'letter') {
    return text.split('')
  }
  // Word mode: split on whitespace boundaries but keep the separators attached to
  // the preceding word so the output stream assembles correctly.
  const words: string[] = []
  const re = /\S+\s*/g
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    words.push(match[0])
  }
  return words
}

export function useTyper({
  speed,
  jitter = 0.5,
  mode,
}: UseTyperOptions): UseTyperResult {
  const [displayed, setDisplayed] = useState<string>('')
  const [status, setStatus] = useState<TypingStatus>('idle')

  // Stable refs so the recursive setTimeout closure never captures stale values.
  const tokensRef = useRef<string[]>([])
  const indexRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const speedRef = useRef<number>(speed)
  const jitterRef = useRef<number>(jitter)
  const modeRef = useRef<TypingMode>(mode)

  // Keep refs in sync with latest props so a running animation picks up changes.
  speedRef.current = speed
  jitterRef.current = jitter
  modeRef.current = mode

  const scheduleNext = useCallback(() => {
    const tokens = tokensRef.current
    const idx = indexRef.current

    if (idx >= tokens.length) {
      setStatus('done')
      return
    }

    const base = speedRef.current
    const j = jitterRef.current
    // Random offset in [-j*base, +j*base]
    const offset = (Math.random() * 2 - 1) * j * base
    const delay = Math.max(1, Math.round(base + offset))

    timerRef.current = setTimeout(() => {
      indexRef.current += 1
      setDisplayed(tokens.slice(0, indexRef.current).join(''))
      scheduleNext()
    }, delay)
  }, [])

  const start = useCallback(
    (text: string) => {
      // Clear any running animation first.
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      const tokens = tokenize(text, modeRef.current)
      tokensRef.current = tokens
      indexRef.current = 0
      setDisplayed('')
      setStatus('typing')
      scheduleNext()
    },
    [scheduleNext],
  )

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setStatus('idle')
  }, [])

  const reset = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    tokensRef.current = []
    indexRef.current = 0
    setDisplayed('')
    setStatus('idle')
  }, [])

  return { displayed, status, start, stop, reset }
}
