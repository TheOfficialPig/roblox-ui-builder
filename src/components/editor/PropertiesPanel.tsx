'use client'

import type { UIElement } from '@/lib/core/types'
import { ROBLOX_FONTS } from '@/lib/core/types'
import { colorToHex, hexToColor3 } from '@/lib/core/utils'
import { useEditorStore } from '@/lib/store/editor-store'
import { EffectsProperties } from './EffectsProperties'

interface PropRowProps {
  label: string
  children: React.ReactNode
}

function PropRow({ label, children }: PropRowProps) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-center gap-2 border-b border-[#3c3c3c]/50 px-3 py-1.5">
      <span className="truncate text-xs text-gray-400">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function TextInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-[#3c3c3c] bg-[#3c3c3c] px-2 py-0.5 text-xs text-white focus:border-[#0078d4] focus:outline-none"
    />
  )
}

function NumberInput({
  value,
  onChange,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
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
      <span className="text-xs text-gray-400">
        {value.r}, {value.g}, {value.b}
      </span>
    </div>
  )
}

function UDim2Input({
  value,
  onChange,
}: {
  value: UIElement['position']
  onChange: (v: UIElement['position']) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {(['xScale', 'xOffset', 'yScale', 'yOffset'] as const).map((key) => (
        <input
          key={key}
          type="number"
          value={value[key]}
          step={key.includes('Scale') ? 0.01 : 1}
          onChange={(e) => onChange({ ...value, [key]: Number(e.target.value) })}
          placeholder={key}
          className="rounded border border-[#3c3c3c] bg-[#3c3c3c] px-1.5 py-0.5 text-xs text-white focus:border-[#0078d4] focus:outline-none"
        />
      ))}
    </div>
  )
}

function ElementProperties({ element }: { element: UIElement }) {
  const updateElement = useEditorStore((s) => s.updateElement)
  const pushHistory = useEditorStore((s) => s.pushHistory)

  const update = (updates: Partial<UIElement>) => {
    updateElement(element.id, updates)
  }

  const commit = () => pushHistory()

  const isText = ['TextLabel', 'TextButton'].includes(element.className)
  const isImage = ['ImageLabel', 'ImageButton'].includes(element.className)
  const isGui =
    element.className !== 'Folder' &&
    !['UIListLayout', 'UIGridLayout', 'UIPageLayout'].includes(element.className)

  const showEffects =
    isGui || element.className === 'ScreenGui'

  return (
    <div>
      <div className="border-b border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5">
        <span className="text-xs font-medium text-[#0078d4]">{element.className}</span>
      </div>

      <PropRow label="Name">
        <TextInput
          value={element.name}
          onChange={(name) => update({ name })}
        />
      </PropRow>

      {isGui && (
        <>
          <PropRow label="Position">
            <UDim2Input
              value={element.position}
              onChange={(position) => update({ position })}
            />
          </PropRow>
          <PropRow label="Size">
            <UDim2Input value={element.size} onChange={(size) => update({ size })} />
          </PropRow>
          <PropRow label="AnchorPoint">
            <div className="grid grid-cols-2 gap-1">
              <NumberInput
                value={element.anchorPoint.x}
                onChange={(x) => update({ anchorPoint: { ...element.anchorPoint, x } })}
                step={0.01}
              />
              <NumberInput
                value={element.anchorPoint.y}
                onChange={(y) => update({ anchorPoint: { ...element.anchorPoint, y } })}
                step={0.01}
              />
            </div>
          </PropRow>
          <PropRow label="Rotation">
            <NumberInput
              value={element.rotation}
              onChange={(rotation) => update({ rotation })}
            />
          </PropRow>
          <PropRow label="Visible">
            <CheckboxInput
              value={element.visible}
              onChange={(visible) => update({ visible })}
            />
          </PropRow>
          <PropRow label="ZIndex">
            <NumberInput
              value={element.zIndex}
              onChange={(zIndex) => update({ zIndex })}
            />
          </PropRow>
          <PropRow label="BackgroundColor3">
            <ColorInput
              value={element.backgroundColor3}
              onChange={(backgroundColor3) => update({ backgroundColor3 })}
            />
          </PropRow>
          <PropRow label="BackgroundTransparency">
            <NumberInput
              value={element.backgroundTransparency}
              onChange={(backgroundTransparency) => update({ backgroundTransparency })}
              step={0.01}
            />
          </PropRow>
          <PropRow label="BorderColor3">
            <ColorInput
              value={element.borderColor3}
              onChange={(borderColor3) => update({ borderColor3 })}
            />
          </PropRow>
          <PropRow label="BorderSizePixel">
            <NumberInput
              value={element.borderSizePixel}
              onChange={(borderSizePixel) => update({ borderSizePixel })}
            />
          </PropRow>
          <PropRow label="ClipsDescendants">
            <CheckboxInput
              value={element.clipsDescendants}
              onChange={(clipsDescendants) => update({ clipsDescendants })}
            />
          </PropRow>
          <PropRow label="LayoutOrder">
            <NumberInput
              value={element.layoutOrder}
              onChange={(layoutOrder) => update({ layoutOrder })}
            />
          </PropRow>
          <PropRow label="AutomaticSize">
            <select
              value={element.automaticSize}
              onChange={(e) =>
                update({ automaticSize: e.target.value as UIElement['automaticSize'] })
              }
              className="w-full rounded border border-[#3c3c3c] bg-[#3c3c3c] px-2 py-0.5 text-xs text-white focus:outline-none"
            >
              {(['None', 'X', 'Y', 'XY'] as const).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </PropRow>
        </>
      )}

      {isText && (
        <>
          <PropRow label="Text">
            <TextInput value={element.text} onChange={(text) => update({ text })} />
          </PropRow>
          <PropRow label="TextColor3">
            <ColorInput
              value={element.textColor3}
              onChange={(textColor3) => update({ textColor3 })}
            />
          </PropRow>
          <PropRow label="TextSize">
            <NumberInput
              value={element.textSize}
              onChange={(textSize) => update({ textSize })}
            />
          </PropRow>
          <PropRow label="TextScaled">
            <CheckboxInput
              value={element.textScaled}
              onChange={(textScaled) => update({ textScaled })}
            />
          </PropRow>
          <PropRow label="TextWrapped">
            <CheckboxInput
              value={element.textWrapped}
              onChange={(textWrapped) => update({ textWrapped })}
            />
          </PropRow>
          <PropRow label="Font">
            <select
              value={element.font}
              onChange={(e) => update({ font: e.target.value })}
              className="w-full rounded border border-[#3c3c3c] bg-[#3c3c3c] px-2 py-0.5 text-xs text-white focus:outline-none"
            >
              {ROBLOX_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </PropRow>
          <PropRow label="RichText">
            <CheckboxInput
              value={element.richText}
              onChange={(richText) => update({ richText })}
            />
          </PropRow>
        </>
      )}

      {isImage && (
        <>
          <PropRow label="Image">
            <TextInput value={element.image} onChange={(image) => update({ image })} />
          </PropRow>
          <PropRow label="ImageColor3">
            <ColorInput
              value={element.imageColor3}
              onChange={(imageColor3) => update({ imageColor3 })}
            />
          </PropRow>
          <PropRow label="ImageTransparency">
            <NumberInput
              value={element.imageTransparency}
              onChange={(imageTransparency) => update({ imageTransparency })}
              step={0.01}
            />
          </PropRow>
        </>
      )}

      {element.uiCorner && (
        <PropRow label="CornerRadius">
          <NumberInput
            value={element.uiCorner.cornerRadius.xOffset}
            onChange={(v) =>
              update({
                uiCorner: {
                  cornerRadius: {
                    xScale: 0,
                    xOffset: v,
                    yScale: 0,
                    yOffset: v,
                  },
                },
              })
            }
          />
        </PropRow>
      )}

      {element.uiStroke && (
        <>
          <PropRow label="Stroke Color">
            <ColorInput
              value={element.uiStroke.color}
              onChange={(color) =>
                update({ uiStroke: { ...element.uiStroke!, color } })
              }
            />
          </PropRow>
          <PropRow label="Stroke Thickness">
            <NumberInput
              value={element.uiStroke.thickness}
              onChange={(thickness) =>
                update({ uiStroke: { ...element.uiStroke!, thickness } })
              }
            />
          </PropRow>
        </>
      )}

      {showEffects && <EffectsProperties element={element} />}

      <div className="p-2">
        <button
          type="button"
          onClick={commit}
          className="w-full rounded bg-[#0078d4] py-1 text-xs text-white hover:bg-[#1a86d9]"
        >
          Apply Changes
        </button>
      </div>
    </div>
  )
}

export function PropertiesPanel() {
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const elements = useEditorStore((s) => s.project.elements)

  if (selectedIds.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-[#3c3c3c] px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Properties
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-xs text-gray-500">Select an object to edit properties</p>
        </div>
      </div>
    )
  }

  if (selectedIds.length > 1) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-[#3c3c3c] px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Properties
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-xs text-gray-500">{selectedIds.length} objects selected</p>
        </div>
      </div>
    )
  }

  const element = elements[selectedIds[0]]
  if (!element) return null

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[#3c3c3c] px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Properties
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ElementProperties element={element} />
      </div>
    </div>
  )
}
