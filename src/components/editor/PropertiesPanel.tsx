'use client'

import type { UIElement } from '@/lib/core/types'
import { ROBLOX_FONTS } from '@/lib/core/types'
import {
  getPropertySections,
  PROPERTY_LABELS,
  type PropertyKey,
} from '@/lib/core/property-schema'
import { useEditorStore } from '@/lib/store/editor-store'
import { EffectsProperties } from './EffectsProperties'
import {
  CheckboxInput,
  ColorInput,
  NumberInput,
  PropRow,
  PropSection,
  SelectInput,
  TextInput,
  UDim2Input,
} from './PropInputs'

function PropertyField({
  keyName,
  element,
  update,
}: {
  keyName: PropertyKey
  element: UIElement
  update: (updates: Partial<UIElement>) => void
}) {
  const label = PROPERTY_LABELS[keyName]

  switch (keyName) {
    case 'name':
      return (
        <PropRow label={label}>
          <TextInput value={element.name} onChange={(name) => update({ name })} />
        </PropRow>
      )
    case 'locked':
      return (
        <PropRow label={label}>
          <CheckboxInput value={element.locked} onChange={(locked) => update({ locked })} />
        </PropRow>
      )
    case 'visible':
      return (
        <PropRow label={label}>
          <CheckboxInput value={element.visible} onChange={(visible) => update({ visible })} />
        </PropRow>
      )
    case 'position':
      return (
        <PropRow label={label}>
          <UDim2Input value={element.position} onChange={(position) => update({ position })} />
        </PropRow>
      )
    case 'size':
      return (
        <PropRow label={label}>
          <UDim2Input value={element.size} onChange={(size) => update({ size })} />
        </PropRow>
      )
    case 'anchorPoint':
      return (
        <PropRow label={label}>
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
      )
    case 'rotation':
      return (
        <PropRow label={label}>
          <NumberInput value={element.rotation} onChange={(rotation) => update({ rotation })} />
        </PropRow>
      )
    case 'zIndex':
      return (
        <PropRow label={label}>
          <NumberInput value={element.zIndex} onChange={(zIndex) => update({ zIndex })} />
        </PropRow>
      )
    case 'layoutOrder':
      return (
        <PropRow label={label}>
          <NumberInput value={element.layoutOrder} onChange={(layoutOrder) => update({ layoutOrder })} />
        </PropRow>
      )
    case 'automaticSize':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.automaticSize}
            onChange={(v) => update({ automaticSize: v as UIElement['automaticSize'] })}
            options={(['None', 'X', 'Y', 'XY'] as const).map((v) => ({ value: v, label: v }))}
          />
        </PropRow>
      )
    case 'backgroundColor3':
      return (
        <PropRow label={label}>
          <ColorInput
            value={element.backgroundColor3}
            onChange={(backgroundColor3) => update({ backgroundColor3 })}
          />
        </PropRow>
      )
    case 'backgroundTransparency':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.backgroundTransparency}
            onChange={(backgroundTransparency) => update({ backgroundTransparency })}
            step={0.01}
          />
        </PropRow>
      )
    case 'borderColor3':
      return (
        <PropRow label={label}>
          <ColorInput
            value={element.borderColor3}
            onChange={(borderColor3) => update({ borderColor3 })}
          />
        </PropRow>
      )
    case 'borderSizePixel':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.borderSizePixel}
            onChange={(borderSizePixel) => update({ borderSizePixel })}
          />
        </PropRow>
      )
    case 'clipsDescendants':
      return (
        <PropRow label={label}>
          <CheckboxInput
            value={element.clipsDescendants}
            onChange={(clipsDescendants) => update({ clipsDescendants })}
          />
        </PropRow>
      )
    case 'text':
      return (
        <PropRow label={label}>
          <TextInput value={element.text} onChange={(text) => update({ text })} />
        </PropRow>
      )
    case 'textColor3':
      return (
        <PropRow label={label}>
          <ColorInput value={element.textColor3} onChange={(textColor3) => update({ textColor3 })} />
        </PropRow>
      )
    case 'textSize':
      return (
        <PropRow label={label}>
          <NumberInput value={element.textSize} onChange={(textSize) => update({ textSize })} />
        </PropRow>
      )
    case 'textScaled':
      return (
        <PropRow label={label}>
          <CheckboxInput value={element.textScaled} onChange={(textScaled) => update({ textScaled })} />
        </PropRow>
      )
    case 'textWrapped':
      return (
        <PropRow label={label}>
          <CheckboxInput value={element.textWrapped} onChange={(textWrapped) => update({ textWrapped })} />
        </PropRow>
      )
    case 'font':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.font}
            onChange={(font) => update({ font })}
            options={ROBLOX_FONTS.map((f) => ({ value: f, label: f }))}
          />
        </PropRow>
      )
    case 'richText':
      return (
        <PropRow label={label}>
          <CheckboxInput value={element.richText} onChange={(richText) => update({ richText })} />
        </PropRow>
      )
    case 'image':
      return (
        <PropRow label={label}>
          <TextInput value={element.image} onChange={(image) => update({ image })} />
        </PropRow>
      )
    case 'imageColor3':
      return (
        <PropRow label={label}>
          <ColorInput
            value={element.imageColor3}
            onChange={(imageColor3) => update({ imageColor3 })}
          />
        </PropRow>
      )
    case 'imageTransparency':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.imageTransparency}
            onChange={(imageTransparency) => update({ imageTransparency })}
            step={0.01}
          />
        </PropRow>
      )
    case 'canvasSize':
      return (
        <PropRow label={label}>
          <UDim2Input value={element.canvasSize} onChange={(canvasSize) => update({ canvasSize })} />
        </PropRow>
      )
    case 'scrollBarThickness':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.scrollBarThickness}
            onChange={(scrollBarThickness) => update({ scrollBarThickness })}
          />
        </PropRow>
      )
    case 'attachedCorner':
      if (!element.uiCorner) return null
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiCorner.cornerRadius.xOffset}
            onChange={(v) =>
              update({
                uiCorner: {
                  cornerRadius: { xScale: 0, xOffset: v, yScale: 0, yOffset: v },
                },
              })
            }
          />
        </PropRow>
      )
    case 'attachedStroke':
      if (!element.uiStroke) return null
      return (
        <>
          <PropRow label="Stroke Color">
            <ColorInput
              value={element.uiStroke.color}
              onChange={(color) => update({ uiStroke: { ...element.uiStroke!, color } })}
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
      )
    case 'uiStrokeColor':
      return (
        <PropRow label={label}>
          <ColorInput
            value={element.uiStroke?.color ?? { r: 255, g: 255, b: 255 }}
            onChange={(color) =>
              update({ uiStroke: { ...element.uiStroke!, color } })
            }
          />
        </PropRow>
      )
    case 'uiStrokeThickness':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiStroke?.thickness ?? 1}
            onChange={(thickness) =>
              update({ uiStroke: { ...element.uiStroke!, thickness } })
            }
          />
        </PropRow>
      )
    case 'uiStrokeTransparency':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiStroke?.transparency ?? 0}
            onChange={(transparency) =>
              update({ uiStroke: { ...element.uiStroke!, transparency } })
            }
            step={0.01}
          />
        </PropRow>
      )
    case 'uiCornerRadius':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiCorner?.cornerRadius.xOffset ?? 8}
            onChange={(v) =>
              update({
                uiCorner: {
                  cornerRadius: { xScale: 0, xOffset: v, yScale: 0, yOffset: v },
                },
              })
            }
          />
        </PropRow>
      )
    case 'uiGradientRotation':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiGradient?.rotation ?? 0}
            onChange={(rotation) =>
              update({ uiGradient: { ...element.uiGradient!, rotation } })
            }
          />
        </PropRow>
      )
    case 'uiPaddingTop':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiPadding?.paddingTop ?? 0}
            onChange={(paddingTop) =>
              update({ uiPadding: { ...element.uiPadding!, paddingTop } })
            }
          />
        </PropRow>
      )
    case 'uiPaddingBottom':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiPadding?.paddingBottom ?? 0}
            onChange={(paddingBottom) =>
              update({ uiPadding: { ...element.uiPadding!, paddingBottom } })
            }
          />
        </PropRow>
      )
    case 'uiPaddingLeft':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiPadding?.paddingLeft ?? 0}
            onChange={(paddingLeft) =>
              update({ uiPadding: { ...element.uiPadding!, paddingLeft } })
            }
          />
        </PropRow>
      )
    case 'uiPaddingRight':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiPadding?.paddingRight ?? 0}
            onChange={(paddingRight) =>
              update({ uiPadding: { ...element.uiPadding!, paddingRight } })
            }
          />
        </PropRow>
      )
    case 'uiAspectRatio':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiAspectRatio?.aspectRatio ?? 1}
            onChange={(aspectRatio) =>
              update({ uiAspectRatio: { ...element.uiAspectRatio!, aspectRatio } })
            }
            step={0.01}
          />
        </PropRow>
      )
    case 'uiAspectType':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiAspectRatio?.aspectType ?? 'FitWithinMaxSize'}
            onChange={(aspectType) =>
              update({
                uiAspectRatio: {
                  ...element.uiAspectRatio!,
                  aspectType: aspectType as 'FitWithinMaxSize' | 'ScaleWithParentSize',
                },
              })
            }
            options={[
              { value: 'FitWithinMaxSize', label: 'Fit Within Max Size' },
              { value: 'ScaleWithParentSize', label: 'Scale With Parent' },
            ]}
          />
        </PropRow>
      )
    case 'uiListFillDirection':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiListLayout?.fillDirection ?? 'Vertical'}
            onChange={(fillDirection) =>
              update({
                uiListLayout: {
                  ...element.uiListLayout!,
                  fillDirection: fillDirection as 'Horizontal' | 'Vertical',
                },
              })
            }
            options={[
              { value: 'Horizontal', label: 'Horizontal' },
              { value: 'Vertical', label: 'Vertical' },
            ]}
          />
        </PropRow>
      )
    case 'uiListHorizontalAlignment':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiListLayout?.horizontalAlignment ?? 'Left'}
            onChange={(horizontalAlignment) =>
              update({
                uiListLayout: {
                  ...element.uiListLayout!,
                  horizontalAlignment: horizontalAlignment as UIElement['uiListLayout'] extends infer T
                    ? T extends { horizontalAlignment: infer H }
                      ? H
                      : never
                    : never,
                },
              })
            }
            options={[
              { value: 'Left', label: 'Left' },
              { value: 'Center', label: 'Center' },
              { value: 'Right', label: 'Right' },
            ]}
          />
        </PropRow>
      )
    case 'uiListVerticalAlignment':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiListLayout?.verticalAlignment ?? 'Top'}
            onChange={(verticalAlignment) =>
              update({
                uiListLayout: {
                  ...element.uiListLayout!,
                  verticalAlignment: verticalAlignment as 'Top' | 'Center' | 'Bottom',
                },
              })
            }
            options={[
              { value: 'Top', label: 'Top' },
              { value: 'Center', label: 'Center' },
              { value: 'Bottom', label: 'Bottom' },
            ]}
          />
        </PropRow>
      )
    case 'uiListPadding':
      return (
        <PropRow label={label}>
          <UDim2Input
            value={element.uiListLayout?.padding ?? { xScale: 0, xOffset: 0, yScale: 0, yOffset: 0 }}
            onChange={(padding) =>
              update({ uiListLayout: { ...element.uiListLayout!, padding } })
            }
          />
        </PropRow>
      )
    case 'uiListSortOrder':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiListLayout?.sortOrder ?? 'LayoutOrder'}
            onChange={(sortOrder) =>
              update({
                uiListLayout: {
                  ...element.uiListLayout!,
                  sortOrder: sortOrder as 'Name' | 'Custom' | 'LayoutOrder',
                },
              })
            }
            options={[
              { value: 'Name', label: 'Name' },
              { value: 'Custom', label: 'Custom' },
              { value: 'LayoutOrder', label: 'Layout Order' },
            ]}
          />
        </PropRow>
      )
    case 'uiGridCellSize':
      return (
        <PropRow label={label}>
          <UDim2Input
            value={element.uiGridLayout?.cellSize ?? { xScale: 0, xOffset: 100, yScale: 0, yOffset: 100 }}
            onChange={(cellSize) =>
              update({ uiGridLayout: { ...element.uiGridLayout!, cellSize } })
            }
          />
        </PropRow>
      )
    case 'uiGridCellPadding':
      return (
        <PropRow label={label}>
          <UDim2Input
            value={element.uiGridLayout?.cellPadding ?? { xScale: 0, xOffset: 5, yScale: 0, yOffset: 5 }}
            onChange={(cellPadding) =>
              update({ uiGridLayout: { ...element.uiGridLayout!, cellPadding } })
            }
          />
        </PropRow>
      )
    case 'uiGridFillDirection':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiGridLayout?.fillDirection ?? 'Horizontal'}
            onChange={(fillDirection) =>
              update({
                uiGridLayout: {
                  ...element.uiGridLayout!,
                  fillDirection: fillDirection as 'Horizontal' | 'Vertical',
                },
              })
            }
            options={[
              { value: 'Horizontal', label: 'Horizontal' },
              { value: 'Vertical', label: 'Vertical' },
            ]}
          />
        </PropRow>
      )
    case 'uiGridHorizontalAlignment':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiGridLayout?.horizontalAlignment ?? 'Left'}
            onChange={(horizontalAlignment) =>
              update({
                uiGridLayout: {
                  ...element.uiGridLayout!,
                  horizontalAlignment: horizontalAlignment as 'Left' | 'Center' | 'Right',
                },
              })
            }
            options={[
              { value: 'Left', label: 'Left' },
              { value: 'Center', label: 'Center' },
              { value: 'Right', label: 'Right' },
            ]}
          />
        </PropRow>
      )
    case 'uiGridVerticalAlignment':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiGridLayout?.verticalAlignment ?? 'Top'}
            onChange={(verticalAlignment) =>
              update({
                uiGridLayout: {
                  ...element.uiGridLayout!,
                  verticalAlignment: verticalAlignment as 'Top' | 'Center' | 'Bottom',
                },
              })
            }
            options={[
              { value: 'Top', label: 'Top' },
              { value: 'Center', label: 'Center' },
              { value: 'Bottom', label: 'Bottom' },
            ]}
          />
        </PropRow>
      )
    case 'uiGridSortOrder':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiGridLayout?.sortOrder ?? 'LayoutOrder'}
            onChange={(sortOrder) =>
              update({
                uiGridLayout: {
                  ...element.uiGridLayout!,
                  sortOrder: sortOrder as 'Name' | 'Custom' | 'LayoutOrder',
                },
              })
            }
            options={[
              { value: 'Name', label: 'Name' },
              { value: 'Custom', label: 'Custom' },
              { value: 'LayoutOrder', label: 'Layout Order' },
            ]}
          />
        </PropRow>
      )
    case 'uiGridStartCorner':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiGridLayout?.startCorner ?? 'TopLeft'}
            onChange={(startCorner) =>
              update({
                uiGridLayout: {
                  ...element.uiGridLayout!,
                  startCorner: startCorner as 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight',
                },
              })
            }
            options={[
              { value: 'TopLeft', label: 'Top Left' },
              { value: 'TopRight', label: 'Top Right' },
              { value: 'BottomLeft', label: 'Bottom Left' },
              { value: 'BottomRight', label: 'Bottom Right' },
            ]}
          />
        </PropRow>
      )
    case 'uiPageFillDirection':
      return (
        <PropRow label={label}>
          <SelectInput
            value={element.uiPageLayout?.fillDirection ?? 'Horizontal'}
            onChange={(fillDirection) =>
              update({
                uiPageLayout: {
                  ...element.uiPageLayout!,
                  fillDirection: fillDirection as 'Horizontal' | 'Vertical',
                },
              })
            }
            options={[
              { value: 'Horizontal', label: 'Horizontal' },
              { value: 'Vertical', label: 'Vertical' },
            ]}
          />
        </PropRow>
      )
    case 'uiPagePadding':
      return (
        <PropRow label={label}>
          <UDim2Input
            value={element.uiPageLayout?.padding ?? { xScale: 0, xOffset: 0, yScale: 0, yOffset: 0 }}
            onChange={(padding) =>
              update({ uiPageLayout: { ...element.uiPageLayout!, padding } })
            }
          />
        </PropRow>
      )
    case 'uiPageCircular':
      return (
        <PropRow label={label}>
          <CheckboxInput
            value={element.uiPageLayout?.circular ?? false}
            onChange={(circular) =>
              update({ uiPageLayout: { ...element.uiPageLayout!, circular } })
            }
          />
        </PropRow>
      )
    case 'uiPageTweenTime':
      return (
        <PropRow label={label}>
          <NumberInput
            value={element.uiPageLayout?.tweenTime ?? 0.5}
            onChange={(tweenTime) =>
              update({ uiPageLayout: { ...element.uiPageLayout!, tweenTime } })
            }
            step={0.1}
          />
        </PropRow>
      )
    case 'effects':
      return <EffectsProperties element={element} />
    default:
      return null
  }
}

function ElementProperties({ element }: { element: UIElement }) {
  const updateElement = useEditorStore((s) => s.updateElement)
  const sections = getPropertySections(element.className)

  const update = (updates: Partial<UIElement>) => {
    updateElement(element.id, updates)
  }

  return (
    <div>
      <div className="border-b border-studio-border bg-studio-accent/10 px-3 py-2">
        <span className="text-xs font-semibold text-studio-accent">{element.className}</span>
      </div>

      {sections.map((section) => {
        if (section.id === 'effects') {
          return <EffectsProperties key={section.id} element={element} />
        }

        const fields = section.properties
          .filter((key) => key !== 'effects')
          .map((key) => (
            <PropertyField key={key} keyName={key} element={element} update={update} />
          ))
          .filter(Boolean)

        if (fields.length === 0) return null

        return (
          <PropSection key={section.id} title={section.title} defaultOpen={section.defaultOpen}>
            {fields}
          </PropSection>
        )
      })}
    </div>
  )
}

export function PropertiesPanel() {
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const elements = useEditorStore((s) => s.project.elements)

  if (selectedIds.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <PanelHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-studio-elevated text-lg">◇</div>
          <p className="text-xs text-studio-muted">Select an object to edit its properties</p>
        </div>
      </div>
    )
  }

  if (selectedIds.length > 1) {
    return (
      <div className="flex h-full flex-col">
        <PanelHeader />
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-xs text-studio-muted">{selectedIds.length} objects selected</p>
        </div>
      </div>
    )
  }

  const element = elements[selectedIds[0]]
  if (!element) return null

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader />
      <div className="flex-1 overflow-y-auto">
        <ElementProperties element={element} />
      </div>
    </div>
  )
}

function PanelHeader() {
  return (
    <div className="border-b border-studio-border px-3 py-2.5">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-studio-muted">
        Properties
      </span>
    </div>
  )
}
