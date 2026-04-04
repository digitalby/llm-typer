import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTyper } from '@/hooks/use-typer'

describe('useTyper', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in idle state with empty displayed text', () => {
    const { result } = renderHook(() =>
      useTyper({ speed: 50, jitter: 0, mode: 'letter' }),
    )

    expect(result.current.status).toBe('idle')
    expect(result.current.displayed).toBe('')
  })

  it('transitions to typing after start()', () => {
    const { result } = renderHook(() =>
      useTyper({ speed: 50, jitter: 0, mode: 'letter' }),
    )

    act(() => {
      result.current.start('hello')
    })

    expect(result.current.status).toBe('typing')
  })

  it('letter mode advances one character per tick', () => {
    const { result } = renderHook(() =>
      useTyper({ speed: 100, jitter: 0, mode: 'letter' }),
    )

    act(() => {
      result.current.start('hi')
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.displayed).toBe('h')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.displayed).toBe('hi')
  })

  it('completes with full text and status done', () => {
    const { result } = renderHook(() =>
      useTyper({ speed: 50, jitter: 0, mode: 'letter' }),
    )

    act(() => {
      result.current.start('abc')
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(result.current.displayed).toBe('abc')
    expect(result.current.status).toBe('done')
  })

  it('reset() returns to idle with empty displayed', () => {
    const { result } = renderHook(() =>
      useTyper({ speed: 50, jitter: 0, mode: 'letter' }),
    )

    act(() => {
      result.current.start('hello world')
    })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    act(() => {
      result.current.reset()
    })

    expect(result.current.status).toBe('idle')
    expect(result.current.displayed).toBe('')
  })

  it('stop() halts animation without clearing displayed text', () => {
    const { result } = renderHook(() =>
      useTyper({ speed: 50, jitter: 0, mode: 'letter' }),
    )

    act(() => {
      result.current.start('hello')
    })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    const snapshot = result.current.displayed

    act(() => {
      result.current.stop()
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // No further advancement after stop
    expect(result.current.displayed).toBe(snapshot)
    expect(result.current.status).toBe('idle')
  })

  it('word mode advances one word (with trailing space) per tick', () => {
    const { result } = renderHook(() =>
      useTyper({ speed: 100, jitter: 0, mode: 'word' }),
    )

    act(() => {
      result.current.start('foo bar baz')
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.displayed).toBe('foo ')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current.displayed).toBe('foo bar ')
  })

  it('start() on a running animation resets and restarts cleanly', () => {
    const { result } = renderHook(() =>
      useTyper({ speed: 100, jitter: 0, mode: 'letter' }),
    )

    act(() => {
      result.current.start('first')
    })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    act(() => {
      result.current.start('second')
    })

    expect(result.current.displayed).toBe('')
    expect(result.current.status).toBe('typing')

    act(() => {
      vi.runAllTimers()
    })
    expect(result.current.displayed).toBe('second')
  })

  it('jitter produces variable delays without crashing', () => {
    // With jitter=1 the delay range is [0, 2*speed] — test that it still completes.
    const { result } = renderHook(() =>
      useTyper({ speed: 50, jitter: 1, mode: 'letter' }),
    )

    act(() => {
      result.current.start('ok')
    })
    act(() => {
      vi.runAllTimers()
    })

    expect(result.current.displayed).toBe('ok')
    expect(result.current.status).toBe('done')
  })
})
