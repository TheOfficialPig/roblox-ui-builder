import type { UIElement } from '../core/types'
import { getElementBounds } from '../core/utils'

const SNAP_THRESHOLD = 6

export interface SnapResult {
  x: number
  y: number
  guides: Array<{ orientation: 'horizontal' | 'vertical'; position: number }>
}

export function snapPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  movingIds: string[],
  elements: Record<string, UIElement>,
  deviceWidth: number,
  deviceHeight: number,
  gridSize: number,
  snapEnabled: boolean,
  gridEnabled: boolean,
): SnapResult {
  const guides: SnapResult['guides'] = []
  let snappedX = x
  let snappedY = y

  const movingEdges = {
    left: x,
    right: x + width,
    centerX: x + width / 2,
    top: y,
    bottom: y + height,
    centerY: y + height / 2,
  }

  if (gridEnabled && gridSize > 0) {
    snappedX = Math.round(snappedX / gridSize) * gridSize
    snappedY = Math.round(snappedY / gridSize) * gridSize
  }

  if (!snapEnabled) {
    return { x: snappedX, y: snappedY, guides }
  }

  const targets: Array<{ v?: number; h?: number }> = [
    { v: 0 },
    { v: deviceWidth / 2 },
    { v: deviceWidth },
    { h: 0 },
    { h: deviceHeight / 2 },
    { h: deviceHeight },
  ]

  for (const [id, el] of Object.entries(elements)) {
    if (movingIds.includes(id) || !el.visible) continue
    const bounds = getElementBounds(el, elements, deviceWidth, deviceHeight)
    targets.push(
      { v: bounds.x },
      { v: bounds.x + bounds.width / 2 },
      { v: bounds.x + bounds.width },
      { h: bounds.y },
      { h: bounds.y + bounds.height / 2 },
      { h: bounds.y + bounds.height },
    )
  }

  for (const target of targets) {
    if (target.v !== undefined) {
      for (const [edge, val] of Object.entries({
        left: movingEdges.left,
        centerX: movingEdges.centerX,
        right: movingEdges.right,
      })) {
        if (Math.abs(val - target.v) < SNAP_THRESHOLD) {
          const offset = target.v - val
          snappedX += offset
          guides.push({ orientation: 'vertical', position: target.v })
          break
        }
      }
    }
    if (target.h !== undefined) {
      for (const [edge, val] of Object.entries({
        top: movingEdges.top,
        centerY: movingEdges.centerY,
        bottom: movingEdges.bottom,
      })) {
        if (Math.abs(val - target.h) < SNAP_THRESHOLD) {
          const offset = target.h - val
          snappedY += offset
          guides.push({ orientation: 'horizontal', position: target.h })
          break
        }
      }
    }
  }

  return { x: snappedX, y: snappedY, guides }
}
