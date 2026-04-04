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
  // Keep trailing whitespace attached to each word so assembled output matches
  // the source exactly.
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

  // Only the timer handle needs a ref; everything else is captured at start() time.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = useCallback(
    (text: string) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      // Capture current settings into the closure so that mid-animation
      // prop changes don't interfere with a running sequence.
      const tokens = tokenize(text, mode)
      const capturedSpeed = speed
      const capturedJitter = jitter
      let index = 0

      setDisplayed('')
      setStatus('typing')

      function scheduleNext() {
        if (index >= tokens.length) {
          setStatus('done')
          return
        }
        const offset = (Math.random() * 2 - 1) * capturedJitter * capturedSpeed
        const delay = Math.max(1, Math.round(capturedSpeed + offset))
        timerRef.current = setTimeout(() => {
          index += 1
          setDisplayed(tokens.slice(0, index).join(''))
          scheduleNext()
        }, delay)
      }

      scheduleNext()
    },
    [speed, jitter, mode],
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
    setDisplayed('')
    setStatus('idle')
  }, [])

  return { displayed, status, start, stop, reset }
}
