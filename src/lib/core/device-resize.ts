import type { DevicePreview, ProjectDocument, UIElement } from './types'
import { DEVICE_PRESETS } from './types'
import type { UDim2 } from './types'

function scaleOffsetUdim(value: UDim2, scaleX: number, scaleY: number): UDim2 {
  return {
    xScale: value.xScale,
    xOffset: Math.round(value.xOffset * scaleX),
    yScale: value.yScale,
    yOffset: Math.round(value.yOffset * scaleY),
  }
}

function avgScale(scaleX: number, scaleY: number): number {
  return (scaleX + scaleY) / 2
}

function scaleUniform(value: number, scale: number): number {
  return Math.max(1, Math.round(value * scale))
}

/** Scale all pixel-based layout in a project when the preview device changes. */
export function resizeProjectElements(
  elements: Record<string, UIElement>,
  from: DevicePreview,
  to: DevicePreview,
): void {
  if (from === to) return

  const old = DEVICE_PRESETS[from]
  const next = DEVICE_PRESETS[to]
  const scaleX = next.width / old.width
  const scaleY = next.height / old.height
  const uniform = avgScale(scaleX, scaleY)

  for (const element of Object.values(elements)) {
    element.position = scaleOffsetUdim(element.position, scaleX, scaleY)
    element.size = scaleOffsetUdim(element.size, scaleX, scaleY)

    if (element.className === 'ScrollingFrame') {
      element.canvasSize = scaleOffsetUdim(element.canvasSize, scaleX, scaleY)
      element.scrollBarThickness = scaleUniform(element.scrollBarThickness, uniform)
    }

    if (element.borderSizePixel > 0) {
      element.borderSizePixel = scaleUniform(element.borderSizePixel, uniform)
    }

    if (element.textSize > 0) {
      element.textSize = scaleUniform(element.textSize, uniform)
    }

    if (element.uiCorner) {
      element.uiCorner = {
        cornerRadius: scaleOffsetUdim(element.uiCorner.cornerRadius, scaleX, scaleY),
      }
    }

    if (element.uiStroke) {
      element.uiStroke = {
        ...element.uiStroke,
        thickness: scaleUniform(element.uiStroke.thickness, uniform),
      }
    }

    if (element.uiPadding) {
      const p = element.uiPadding
      element.uiPadding = {
        paddingTop: scaleUniform(p.paddingTop, scaleY),
        paddingBottom: scaleUniform(p.paddingBottom, scaleY),
        paddingLeft: scaleUniform(p.paddingLeft, scaleX),
        paddingRight: scaleUniform(p.paddingRight, scaleX),
      }
    }

    if (element.uiGridLayout) {
      const g = element.uiGridLayout
      element.uiGridLayout = {
        ...g,
        cellSize: scaleOffsetUdim(g.cellSize, scaleX, scaleY),
        cellPadding: scaleOffsetUdim(g.cellPadding, scaleX, scaleY),
      }
    }

    if (element.uiListLayout) {
      element.uiListLayout = {
        ...element.uiListLayout,
        padding: scaleOffsetUdim(element.uiListLayout.padding, scaleX, scaleY),
      }
    }

    if (element.uiPageLayout) {
      element.uiPageLayout = {
        ...element.uiPageLayout,
        padding: scaleOffsetUdim(element.uiPageLayout.padding, scaleX, scaleY),
      }
    }

    if (element.dropShadow) {
      const s = element.dropShadow
      element.dropShadow = {
        ...s,
        offsetX: Math.round(s.offsetX * scaleX),
        offsetY: Math.round(s.offsetY * scaleY),
        blur: scaleUniform(s.blur, uniform),
        spread: scaleUniform(s.spread, uniform),
      }
    }

    if (element.glow) {
      element.glow = {
        ...element.glow,
        size: scaleUniform(element.glow.size, uniform),
      }
    }

    if (element.borderEffect?.enabled) {
      element.borderEffect = {
        ...element.borderEffect,
        width: scaleUniform(element.borderEffect.width, uniform),
      }
    }
  }
}

export function resizeProjectForDevice(
  project: ProjectDocument,
  to: DevicePreview,
): ProjectDocument {
  const from = project.devicePreview
  if (from === to) return project

  const elements = structuredClone(project.elements) as Record<string, UIElement>
  resizeProjectElements(elements, from, to)

  return {
    ...project,
    elements,
    devicePreview: to,
    updatedAt: new Date().toISOString(),
  }
}
