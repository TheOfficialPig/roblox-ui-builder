'use client'

import { useState } from 'react'
import type { UIElement } from '@/lib/core/types'
import { colorToHex, hexToColor3 } from '@/lib/core/utils'
import { cn } from '@/lib/utils/cn'

export function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_1fr] items-center gap-2 px-3 py-1.5">
      <span className="truncate text-[11px] text-studio-muted">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export function PropSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <details
      open={isOpen}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
      className="group border-b border-studio-border/60"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 bg-studio-elevated/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-studio-muted transition hover:text-white [&::-webkit-details-marker]:hidden">
        <span className="text-[10px] text-studio-accent transition group-open:rotate-90">▶</span>
        {title}
      </summary>
      <div className="pb-1">{children}</div>
    </details>
  )
}

const inputClass =
  'w-full rounded-md border border-studio-border bg-studio-input px-2 py-1 text-xs text-white transition focus:border-studio-accent focus:outline-none focus:ring-1 focus:ring-studio-accent/30'

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  )
}

export function NumberInput({
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className={inputClass}
    />
  )
}

export function CheckboxInput({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      className="h-3.5 w-3.5 rounded accent-studio-accent"
    />
  )
}

export function ColorInput({
  value,
  onChange,
}: {
  value: { r: number; g: number; b: number }
  onChange: (v: { r: number; g: number; b: number }) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={colorToHex(value)}
        onChange={(e) => onChange(hexToColor3(e.target.value))}
        className="h-7 w-7 cursor-pointer rounded-md border border-studio-border bg-transparent"
      />
      <span className="text-[10px] text-studio-muted">
        {value.r}, {value.g}, {value.b}
      </span>
    </div>
  )
}

export function UDim2Input({
  value,
  onChange,
}: {
  value: UIElement['position']
  onChange: (v: UIElement['position']) => void
}) {
  const fields = [
    { key: 'xScale' as const, label: 'X%' },
    { key: 'xOffset' as const, label: 'X' },
    { key: 'yScale' as const, label: 'Y%' },
    { key: 'yOffset' as const, label: 'Y' },
  ]
  return (
    <div className="grid grid-cols-2 gap-1">
      {fields.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-1">
          <span className="w-5 shrink-0 text-[9px] text-studio-muted">{label}</span>
          <input
            type="number"
            value={value[key]}
            step={key.includes('Scale') ? 0.01 : 1}
            onChange={(e) => onChange({ ...value, [key]: Number(e.target.value) })}
            className={cn(inputClass, 'min-w-0')}
          />
        </div>
      ))}
    </div>
  )
}

export function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
