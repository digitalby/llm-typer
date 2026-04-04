'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { TypingMode, TypingStatus } from '@/hooks/use-typer'

interface SettingsPanelProps {
  inputText: string
  speed: number
  jitter: number
  mode: TypingMode
  fgColor: string
  bgColor: string
  status: TypingStatus
  onInputChange: (v: string) => void
  onSpeedChange: (v: number) => void
  onJitterChange: (v: number) => void
  onModeChange: (v: TypingMode) => void
  onFgColorChange: (v: string) => void
  onBgColorChange: (v: string) => void
  onOutput: () => void
  onReset: () => void
}

export function SettingsPanel({
  inputText,
  speed,
  jitter,
  mode,
  fgColor,
  bgColor,
  status,
  onInputChange,
  onSpeedChange,
  onJitterChange,
  onModeChange,
  onFgColorChange,
  onBgColorChange,
  onOutput,
  onReset,
}: SettingsPanelProps) {
  const isTyping = status === 'typing'

  return (
    <Card className="flex h-full flex-col rounded-xl border border-border bg-card shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold tracking-tight">
          Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {/* Text input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="input-text">Text to type</Label>
          <Textarea
            id="input-text"
            placeholder="Paste or type your text here..."
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            className="min-h-[160px] resize-none font-mono text-sm"
            disabled={isTyping}
          />
        </div>

        {/* Mode */}
        <div className="flex flex-col gap-2">
          <Label>Mode</Label>
          <Select
            value={mode}
            onValueChange={(v) => onModeChange(v as TypingMode)}
            disabled={isTyping}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="letter">Letter by letter</SelectItem>
              <SelectItem value="word">Word by word</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Speed */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Speed</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {speed} ms / token
            </span>
          </div>
          <Slider
            min={10}
            max={500}
            step={5}
            value={[speed]}
            onValueChange={(v) => onSpeedChange(Array.isArray(v) ? v[0] : v)}
            disabled={isTyping}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Fast (10 ms)</span>
            <span>Slow (500 ms)</span>
          </div>
        </div>

        {/* Jitter */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Jitter</Label>
            <span className="font-mono text-xs text-muted-foreground">
              ±{Math.round(jitter * 100)}%
            </span>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={[jitter]}
            onValueChange={(v) => onJitterChange(Array.isArray(v) ? v[0] : v)}
            disabled={isTyping}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>None</span>
            <span>Max</span>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fg-color">Text color</Label>
            <div className="flex items-center gap-2">
              <input
                id="fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => onFgColorChange(e.target.value)}
                className="h-9 w-9 cursor-pointer rounded border border-border bg-transparent p-0.5"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {fgColor}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bg-color">Background</Label>
            <div className="flex items-center gap-2">
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="h-9 w-9 cursor-pointer rounded border border-border bg-transparent p-0.5"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {bgColor}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-3 pt-2">
          <Button
            className="flex-1"
            onClick={onOutput}
            disabled={isTyping || inputText.trim() === ''}
          >
            {isTyping ? 'Typing...' : 'Output'}
          </Button>
          <Button variant="outline" onClick={onReset} disabled={status === 'idle'}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
