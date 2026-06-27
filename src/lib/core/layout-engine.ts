import type { UIElement } from './types'
import { isLayoutObject, isModifierObject, isGuiObject } from './utils'

export interface LayoutRect {
  x: number
  y: number
  width: number
  height: number
}

function resolvePadding(padding: { xOffset: number; yOffset: number }) {
  return { x: padding.xOffset, y: padding.yOffset }
}

function sortByLayoutOrder(children: UIElement[]): UIElement[] {
  return [...children].sort((a, b) => a.layoutOrder - b.layoutOrder || a.name.localeCompare(b.name))
}

function alignOffset(
  align: string,
  parentSize: number,
  contentSize: number,
  isHorizontal: boolean,
): number {
  if (align === 'Center') return (parentSize - contentSize) / 2
  if (isHorizontal ? align === 'Right' : align === 'Bottom') return parentSize - contentSize
  return 0
}

export function getLayoutChildIds(parent: UIElement, elements: Record<string, UIElement>): string[] {
  return parent.children.filter((id) => {
    const child = elements[id]
    return child && child.visible && isGuiObject(child)
  })
}

export function findLayoutObject(
  parent: UIElement,
  elements: Record<string, UIElement>,
): UIElement | null {
  for (const childId of parent.children) {
    const child = elements[childId]
    if (child && isLayoutObject(child.className)) return child
  }
  return null
}

export function computeLayoutRects(
  parent: UIElement,
  elements: Record<string, UIElement>,
  parentWidth: number,
  parentHeight: number,
): Record<string, LayoutRect> {
  const layoutObj = findLayoutObject(parent, elements)
  if (!layoutObj) return {}

  const childIds = getLayoutChildIds(parent, elements)
  const children = sortByLayoutOrder(
    childIds.map((id) => elements[id]).filter(Boolean) as UIElement[],
  )

  const rects: Record<string, LayoutRect> = {}

  if (layoutObj.uiListLayout) {
    const l = layoutObj.uiListLayout
    const pad = resolvePadding(l.padding)
    const horizontal = l.fillDirection === 'Horizontal'
    let cursorX = pad.x
    let cursorY = pad.y
    let maxCross = 0
    const sizes = children.map((c) => ({
      w: c.size.xScale * parentWidth + c.size.xOffset,
      h: c.size.yScale * parentHeight + c.size.yOffset,
    }))

    const mainTotal = sizes.reduce(
      (sum, s) => sum + (horizontal ? s.w : s.h),
      pad.x * Math.max(0, children.length - 1),
    )
    const crossMax = sizes.reduce(
      (max, s) => Math.max(max, horizontal ? s.h : s.w),
      0,
    )

    const mainAlign = horizontal ? l.horizontalAlignment : l.verticalAlignment
    const crossAlign = horizontal ? l.verticalAlignment : l.horizontalAlignment
    const mainStart = alignOffset(mainAlign, horizontal ? parentWidth : parentHeight, mainTotal, horizontal)
    const crossStart = alignOffset(crossAlign, horizontal ? parentHeight : parentWidth, crossMax, !horizontal)

    if (horizontal) {
      cursorX = mainStart + pad.x
      cursorY = crossStart
    } else {
      cursorY = mainStart + pad.y
      cursorX = crossStart
    }

    children.forEach((child, i) => {
      const w = sizes[i].w
      const h = sizes[i].h
      if (horizontal) {
        rects[child.id] = { x: cursorX, y: cursorY, width: w, height: h }
        cursorX += w + pad.x
        maxCross = Math.max(maxCross, h)
      } else {
        rects[child.id] = { x: cursorX, y: cursorY, width: w, height: h }
        cursorY += h + pad.y
        maxCross = Math.max(maxCross, w)
      }
    })
  }

  if (layoutObj.uiGridLayout) {
    const g = layoutObj.uiGridLayout
    const pad = resolvePadding(g.cellPadding)
    const cellW = g.cellSize.xScale * parentWidth + g.cellSize.xOffset
    const cellH = g.cellSize.yScale * parentHeight + g.cellSize.yOffset
    const cols =
      g.fillDirection === 'Horizontal'
        ? Math.max(1, Math.floor((parentWidth + pad.x) / (cellW + pad.x)))
        : Math.ceil(Math.sqrt(children.length))

    const gridW = cols * cellW + Math.max(0, cols - 1) * pad.x
    const rows = Math.ceil(children.length / cols)
    const gridH = rows * cellH + Math.max(0, rows - 1) * pad.y

    const startX = alignOffset(g.horizontalAlignment, parentWidth, gridW, true)
    const startY = alignOffset(g.verticalAlignment, parentHeight, gridH, false)

    children.forEach((child, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      let x = startX + col * (cellW + pad.x)
      let y = startY + row * (cellH + pad.y)

      if (g.startCorner === 'TopRight' || g.startCorner === 'BottomRight') {
        x = startX + (cols - 1 - col) * (cellW + pad.x)
      }
      if (g.startCorner === 'BottomLeft' || g.startCorner === 'BottomRight') {
        y = startY + (rows - 1 - row) * (cellH + pad.y)
      }

      rects[child.id] = { x, y, width: cellW, height: cellH }
    })
  }

  return rects
}

export function parentUsesLayout(parent: UIElement, elements: Record<string, UIElement>): boolean {
  return findLayoutObject(parent, elements) !== null
}

export function isLayoutManagedChild(
  parent: UIElement,
  childId: string,
  elements: Record<string, UIElement>,
): boolean {
  const child = elements[childId]
  if (!child || !isGuiObject(child)) return false
  return parentUsesLayout(parent, elements)
}
