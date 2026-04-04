'use client'

import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { TypingStatus } from '@/hooks/use-typer'

interface OutputPanelProps {
  displayed: string
  status: TypingStatus
  fgColor: string
  bgColor: string
}

export function OutputPanel({
  displayed,
  status,
  fgColor,
  bgColor,
}: OutputPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll as text grows.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayed])

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-xl border-0 shadow-none">
      <div
        className="flex flex-1 flex-col overflow-y-auto p-6 font-mono text-sm leading-relaxed"
        style={{ backgroundColor: bgColor, color: fgColor }}
      >
        {status === 'idle' && displayed === '' ? (
          <span className="select-none opacity-30">
            Output will appear here...
          </span>
        ) : (
          <pre className="whitespace-pre-wrap break-words">
            {displayed}
            {status === 'typing' && (
              <span className="animate-blink ml-[1px] inline-block">|</span>
            )}
          </pre>
        )}
        <div ref={bottomRef} />
      </div>
    </Card>
  )
}
