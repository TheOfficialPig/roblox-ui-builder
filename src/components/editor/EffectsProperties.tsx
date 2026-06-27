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
import { useEditorStore } from '@/lib/store/editor-store'
import {
  CheckboxInput,
  ColorInput,
  NumberInput,
  PropRow,
  PropSection,
  SelectInput,
  TextInput,
} from './PropInputs'

export function EffectsProperties({ element }: { element: UIElement }) {
  const updateElement = useEditorStore((s) => s.updateElement)
  const update = (updates: Partial<UIElement>) => updateElement(element.id, updates)

  const shadow = resolveDropShadow(element)
  const glow = resolveGlow(element)
  const border = resolveBorderEffect(element)
  const texture = resolveTexture(element)

  return (
    <>
      <PropSection title="Drop Shadow" defaultOpen={shadow.enabled}>
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
      </PropSection>

      <PropSection title="Glow" defaultOpen={glow.enabled}>
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
      </PropSection>

      <PropSection title="Border Effect" defaultOpen={border.enabled}>
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
      </PropSection>

      <PropSection title="Texture" defaultOpen={texture.enabled}>
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
                    texture: { ...texture, pattern: pattern as typeof texture.pattern },
                  })
                }
                options={TEXTURE_OPTIONS.map((t) => ({ value: t.id, label: t.label }))}
              />
            </PropRow>
            {texture.pattern === 'custom' && (
              <PropRow label="Image URL">
                <TextInput
                  value={texture.imageUrl}
                  onChange={(imageUrl) => update({ texture: { ...texture, imageUrl } })}
                  placeholder="https://..."
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
      </PropSection>

      <PropSection title="Gradient" defaultOpen={!!element.uiGradient}>
        <PropRow label="Preset">
          <SelectInput
            value=""
            onChange={(presetId) => {
              const preset = GRADIENT_PRESETS.find((p) => p.id === presetId)
              if (preset) update({ uiGradient: presetToGradient(preset) })
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
                className="rounded-md border border-studio-border px-2 py-0.5 text-xs text-studio-muted transition hover:border-studio-accent hover:text-white"
              >
                Clear gradient
              </button>
            </PropRow>
          </>
        )}
        <div className="grid grid-cols-4 gap-1.5 p-3">
          {GRADIENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title={preset.name}
              onClick={() => update({ uiGradient: presetToGradient(preset) })}
              className="h-8 rounded-md border border-studio-border transition hover:border-studio-accent hover:scale-105"
              style={{
                background: `linear-gradient(${preset.rotation}deg, ${preset.colorSequence
                  .map((s) => `rgb(${s.color.r},${s.color.g},${s.color.b}) ${s.offset * 100}%`)
                  .join(', ')})`,
              }}
            />
          ))}
        </div>
      </PropSection>
    </>
  )
}
