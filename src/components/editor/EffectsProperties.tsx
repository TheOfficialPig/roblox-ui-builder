'use client'

import type { UIElement, BorderStyleType } from '@/lib/core/types'
import {
  GRADIENT_PRESETS,
  TEXTURE_OPTIONS,
  presetToGradient,
  resolveBorderEffect,
  resolveDropShadow,
  resolveGlow,
  resolveTexture,
} from '@/lib/core/effects'
import { colorToHex, hexToColor3 } from '@/lib/core/utils'
import { useEditorStore } from '@/lib/store/editor-store'

interface PropRowProps {
  label: string
  children: React.ReactNode
}

function PropRow({ label, children }: PropRowProps) {
  return (
    <div className="grid grid-cols-[90px_1fr] items-center gap-2 border-b border-[#3c3c3c]/50 px-3 py-1.5">
      <span className="truncate text-xs text-gray-400">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5">
      <span className="text-xs font-medium text-gray-300">{title}</span>
    </div>
  )
}

function NumberInput({
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
      className="w-full rounded border border-[#3c3c3c] bg-[#3c3c3c] px-2 py-0.5 text-xs text-white focus:border-[#0078d4] focus:outline-none"
    />
  )
}

function CheckboxInput({
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
      className="h-3.5 w-3.5 rounded accent-[#0078d4]"
    />
  )
}

function ColorInput({
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
        className="h-6 w-6 cursor-pointer rounded border border-[#3c3c3c] bg-transparent"
      />
      <span className="text-[10px] text-gray-500">
        {value.r}, {value.g}, {value.b}
      </span>
    </div>
  )
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-[#3c3c3c] bg-[#3c3c3c] px-2 py-0.5 text-xs text-white focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function EffectsProperties({ element }: { element: UIElement }) {
  const updateElement = useEditorStore((s) => s.updateElement)

  const update = (updates: Partial<UIElement>) => updateElement(element.id, updates)

  const shadow = resolveDropShadow(element)
  const glow = resolveGlow(element)
  const border = resolveBorderEffect(element)
  const texture = resolveTexture(element)

  return (
    <>
      <SectionHeader title="Effects" />

      <SectionHeader title="Drop Shadow" />
      <PropRow label="Enabled">
        <CheckboxInput
          value={shadow.enabled}
          onChange={(enabled) => update({ dropShadow: { ...shadow, enabled } })}
        />
      </PropRow>
      {shadow.enabled && (
        <>
          <PropRow label="Offset X">
            <NumberInput
              value={shadow.offsetX}
              onChange={(offsetX) => update({ dropShadow: { ...shadow, offsetX } })}
            />
          </PropRow>
          <PropRow label="Offset Y">
            <NumberInput
              value={shadow.offsetY}
              onChange={(offsetY) => update({ dropShadow: { ...shadow, offsetY } })}
            />
          </PropRow>
          <PropRow label="Blur">
            <NumberInput
              value={shadow.blur}
              min={0}
              onChange={(blur) => update({ dropShadow: { ...shadow, blur } })}
            />
          </PropRow>
          <PropRow label="Spread">
            <NumberInput
              value={shadow.spread}
              onChange={(spread) => update({ dropShadow: { ...shadow, spread } })}
            />
          </PropRow>
          <PropRow label="Color">
            <ColorInput
              value={shadow.color}
              onChange={(color) => update({ dropShadow: { ...shadow, color } })}
            />
          </PropRow>
          <PropRow label="Transparency">
            <NumberInput
              value={shadow.transparency}
              step={0.05}
              min={0}
              max={1}
              onChange={(transparency) => update({ dropShadow: { ...shadow, transparency } })}
            />
          </PropRow>
        </>
      )}

      <SectionHeader title="Glow" />
      <PropRow label="Enabled">
        <CheckboxInput
          value={glow.enabled}
          onChange={(enabled) => update({ glow: { ...glow, enabled } })}
        />
      </PropRow>
      {glow.enabled && (
        <>
          <PropRow label="Color">
            <ColorInput
              value={glow.color}
              onChange={(color) => update({ glow: { ...glow, color } })}
            />
          </PropRow>
          <PropRow label="Size">
            <NumberInput
              value={glow.size}
              min={0}
              onChange={(size) => update({ glow: { ...glow, size } })}
            />
          </PropRow>
          <PropRow label="Transparency">
            <NumberInput
              value={glow.transparency}
              step={0.05}
              min={0}
              max={1}
              onChange={(transparency) => update({ glow: { ...glow, transparency } })}
            />
          </PropRow>
        </>
      )}

      <SectionHeader title="Border" />
      <PropRow label="Enabled">
        <CheckboxInput
          value={border.enabled}
          onChange={(enabled) => update({ borderEffect: { ...border, enabled } })}
        />
      </PropRow>
      {border.enabled && (
        <>
          <PropRow label="Style">
            <SelectInput
              value={border.style}
              onChange={(style) =>
                update({ borderEffect: { ...border, style: style as BorderStyleType } })
              }
              options={[
                { value: 'Solid', label: 'Solid' },
                { value: 'Dashed', label: 'Dashed' },
                { value: 'Dotted', label: 'Dotted' },
                { value: 'Double', label: 'Double' },
              ]}
            />
          </PropRow>
          <PropRow label="Width">
            <NumberInput
              value={border.width}
              min={1}
              onChange={(width) => update({ borderEffect: { ...border, width } })}
            />
          </PropRow>
          <PropRow label="Color">
            <ColorInput
              value={border.color}
              onChange={(color) => update({ borderEffect: { ...border, color } })}
            />
          </PropRow>
          <PropRow label="Transparency">
            <NumberInput
              value={border.transparency}
              step={0.05}
              min={0}
              max={1}
              onChange={(transparency) => update({ borderEffect: { ...border, transparency } })}
            />
          </PropRow>
        </>
      )}

      <SectionHeader title="Texture" />
      <PropRow label="Enabled">
        <CheckboxInput
          value={texture.enabled}
          onChange={(enabled) =>
            update({
              texture: {
                ...texture,
                enabled,
                pattern: enabled && texture.pattern === 'none' ? 'granite' : texture.pattern,
              },
            })
          }
        />
      </PropRow>
      {texture.enabled && (
        <>
          <PropRow label="Pattern">
            <SelectInput
              value={texture.pattern}
              onChange={(pattern) =>
                update({
                  texture: {
                    ...texture,
                    pattern: pattern as typeof texture.pattern,
                  },
                })
              }
              options={TEXTURE_OPTIONS.map((t) => ({ value: t.id, label: t.label }))}
            />
          </PropRow>
          {texture.pattern === 'custom' && (
            <PropRow label="Image URL">
              <input
                type="text"
                value={texture.imageUrl}
                onChange={(e) =>
                  update({ texture: { ...texture, imageUrl: e.target.value } })
                }
                placeholder="https://..."
                className="w-full rounded border border-[#3c3c3c] bg-[#3c3c3c] px-2 py-0.5 text-xs text-white focus:border-[#0078d4] focus:outline-none"
              />
            </PropRow>
          )}
          <PropRow label="Scale">
            <NumberInput
              value={texture.scale}
              step={0.1}
              min={0.25}
              max={4}
              onChange={(scale) => update({ texture: { ...texture, scale } })}
            />
          </PropRow>
          <PropRow label="Opacity">
            <NumberInput
              value={texture.opacity}
              step={0.05}
              min={0}
              max={1}
              onChange={(opacity) => update({ texture: { ...texture, opacity } })}
            />
          </PropRow>
          <PropRow label="Tint">
            <ColorInput
              value={texture.tint}
              onChange={(tint) => update({ texture: { ...texture, tint } })}
            />
          </PropRow>
        </>
      )}

      <SectionHeader title="Gradient Colors" />
      <PropRow label="Preset">
        <SelectInput
          value=""
          onChange={(presetId) => {
            const preset = GRADIENT_PRESETS.find((p) => p.id === presetId)
            if (preset) {
              update({ uiGradient: presetToGradient(preset) })
            }
          }}
          options={[
            { value: '', label: 'Choose preset...' },
            ...GRADIENT_PRESETS.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
      </PropRow>
      {element.uiGradient && (
        <>
          <PropRow label="Rotation">
            <NumberInput
              value={element.uiGradient.rotation}
              onChange={(rotation) =>
                update({ uiGradient: { ...element.uiGradient!, rotation } })
              }
            />
          </PropRow>
          <PropRow label="Remove">
            <button
              type="button"
              onClick={() => update({ uiGradient: undefined })}
              className="rounded border border-[#3c3c3c] px-2 py-0.5 text-xs text-gray-300 hover:bg-[#2a2d2e]"
            >
              Clear gradient
            </button>
          </PropRow>
          <div className="grid grid-cols-4 gap-1 p-2">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                title={preset.name}
                onClick={() => update({ uiGradient: presetToGradient(preset) })}
                className="h-8 rounded border border-[#3c3c3c] hover:border-[#0078d4]"
                style={{
                  background: `linear-gradient(${preset.rotation}deg, ${preset.colorSequence
                    .map((s) => `rgb(${s.color.r},${s.color.g},${s.color.b}) ${s.offset * 100}%`)
                    .join(', ')})`,
                }}
              />
            ))}
          </div>
        </>
      )}
      {!element.uiGradient && (
        <div className="grid grid-cols-4 gap-1 p-2">
          {GRADIENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title={preset.name}
              onClick={() => update({ uiGradient: presetToGradient(preset) })}
              className="h-8 rounded border border-[#3c3c3c] hover:border-[#0078d4]"
              style={{
                background: `linear-gradient(${preset.rotation}deg, ${preset.colorSequence
                  .map((s) => `rgb(${s.color.r},${s.color.g},${s.color.b}) ${s.offset * 100}%`)
                  .join(', ')})`,
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}
