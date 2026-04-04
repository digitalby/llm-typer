'use client'

import { useState } from 'react'
import { TypingMode, useTyper } from '@/hooks/use-typer'
import { OutputPanel } from '@/components/output-panel'
import { SettingsPanel } from '@/components/settings-panel'

export function TyperLayout() {
  const [inputText, setInputText] = useState<string>('')
  const [speed, setSpeed] = useState<number>(50)
  const [jitter, setJitter] = useState<number>(0.5)
  const [mode, setMode] = useState<TypingMode>('letter')
  const [fgColor, setFgColor] = useState<string>('#e2e8f0')
  const [bgColor, setBgColor] = useState<string>('#0f172a')

  const { displayed, status, start, stop, reset } = useTyper({ speed, jitter, mode })

  return (
    <div className="flex h-screen w-full gap-4 bg-background p-4">
      <div className="w-[360px] shrink-0">
        <SettingsPanel
          inputText={inputText}
          speed={speed}
          jitter={jitter}
          mode={mode}
          fgColor={fgColor}
          bgColor={bgColor}
          status={status}
          onInputChange={setInputText}
          onSpeedChange={setSpeed}
          onJitterChange={setJitter}
          onModeChange={setMode}
          onFgColorChange={setFgColor}
          onBgColorChange={setBgColor}
          onOutput={() => start(inputText)}
          onReset={() => { stop(); reset() }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <OutputPanel
          displayed={displayed}
          status={status}
          fgColor={fgColor}
          bgColor={bgColor}
        />
      </div>
    </div>
  )
}
