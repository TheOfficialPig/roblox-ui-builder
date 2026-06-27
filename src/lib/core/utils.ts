import type { Color3, UDim2, UIElement } from './types'

export const udim = (
  xScale = 0,
  xOffset = 0,
  yScale = 0,
  yOffset = 0,
): UDim2 => ({ xScale, xOffset, yScale, yOffset })

export const udim2Offset = (x: number, y: number): UDim2 =>
  udim(0, x, 0, y)

export const udim2Scale = (x: number, y: number): UDim2 =>
  udim(x, 0, y, 0)

export const color3 = (r: number, g: number, b: number): Color3 => ({ r, g, b })

export function resolveUDim2(
  value: UDim2,
  parentWidth: number,
  parentHeight: number,
): { width: number; height: number; x: number; y: number } {
  const width = value.xScale * parentWidth + value.xOffset
  const height = value.yScale * parentHeight + value.yOffset
  return { width, height, x: 0, y: 0 }
}

export function resolvePosition(
  position: UDim2,
  size: UDim2,
  anchorPoint: { x: number; y: number },
  parentWidth: number,
  parentHeight: number,
): { x: number; y: number; width: number; height: number } {
  const resolvedSize = resolveUDim2(size, parentWidth, parentHeight)
  const x = position.xScale * parentWidth + position.xOffset - resolvedSize.width * anchorPoint.x
  const y = position.yScale * parentHeight + position.yOffset - resolvedSize.height * anchorPoint.y
  return { x, y, width: resolvedSize.width, height: resolvedSize.height }
}

export function colorToCss(color: Color3, alpha = 1): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
}

export function colorToHex(color: Color3): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

export function hexToColor3(hex: string): Color3 {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.slice(0, 2), 16)
  const g = parseInt(cleaned.slice(2, 4), 16)
  const b = parseInt(cleaned.slice(4, 6), 16)
  return { r, g, b }
}

export function robloxFontToCss(font: string): string {
  const map: Record<string, string> = {
    Legacy: 'Arial, sans-serif',
    Arial: 'Arial, sans-serif',
    ArialBold: 'Arial, sans-serif',
    SourceSans: '"Source Sans Pro", sans-serif',
    SourceSansBold: '"Source Sans Pro", sans-serif',
    SourceSansSemibold: '"Source Sans Pro", sans-serif',
    SourceSansLight: '"Source Sans Pro", sans-serif',
    Gotham: 'Inter, sans-serif',
    GothamMedium: 'Inter, sans-serif',
    GothamBold: 'Inter, sans-serif',
    GothamBlack: 'Inter, sans-serif',
    Roboto: 'Roboto, sans-serif',
    RobotoCondensed: '"Roboto Condensed", sans-serif',
    RobotoMono: '"Roboto Mono", monospace',
    Code: '"Roboto Mono", monospace',
    Bangers: 'Bangers, cursive',
    Creepster: 'Creepster, cursive',
    LuckiestGuy: '"Luckiest Guy", cursive',
    PermanentMarker: '"Permanent Marker", cursive',
    IndieFlower: '"Indie Flower", cursive',
    Oswald: 'Oswald, sans-serif',
    Nunito: 'Nunito, sans-serif',
    Ubuntu: 'Ubuntu, sans-serif',
  }
  return map[font] ?? 'Inter, sans-serif'
}

export function isGuiObject(element: UIElement): boolean {
  const nonGui = ['UIStroke', 'UICorner', 'UIGradient', 'UIAspectRatioConstraint', 'UIPadding', 'UIScale', 'UIListLayout', 'UIGridLayout', 'UIPageLayout']
  return !nonGui.includes(element.className) && element.className !== 'Folder'
}

export function isLayoutObject(className: string): boolean {
  return ['UIListLayout', 'UIGridLayout', 'UIPageLayout'].includes(className)
}

export function isModifierObject(className: string): boolean {
  return ['UIStroke', 'UICorner', 'UIGradient', 'UIAspectRatioConstraint', 'UIPadding', 'UIScale'].includes(className)
}

export function getElementBounds(
  element: UIElement,
  elements: Record<string, UIElement>,
  deviceWidth: number,
  deviceHeight: number,
): { x: number; y: number; width: number; height: number } {
  if (element.parentId) {
    const parent = elements[element.parentId]
    if (parent && (isGuiObject(parent) || parent.className === 'ScreenGui')) {
      const parentBounds = getElementBounds(parent, elements, deviceWidth, deviceHeight)
      const resolved = resolvePosition(
        element.position,
        element.size,
        element.anchorPoint,
        parentBounds.width,
        parentBounds.height,
      )
      return {
        x: parentBounds.x + resolved.x,
        y: parentBounds.y + resolved.y,
        width: resolved.width,
        height: resolved.height,
      }
    }
  }

  return resolvePosition(
    element.position,
    element.size,
    element.anchorPoint,
    deviceWidth,
    deviceHeight,
  )
}

export function getParentDimensions(
  element: UIElement,
  elements: Record<string, UIElement>,
  deviceWidth: number,
  deviceHeight: number,
): { parentWidth: number; parentHeight: number } {
  if (!element.parentId) {
    return { parentWidth: deviceWidth, parentHeight: deviceHeight }
  }

  const parent = elements[element.parentId]
  if (!parent || (!isGuiObject(parent) && parent.className !== 'ScreenGui')) {
    return { parentWidth: deviceWidth, parentHeight: deviceHeight }
  }

  const parentBounds = getElementBounds(parent, elements, deviceWidth, deviceHeight)
  return { parentWidth: parentBounds.width, parentHeight: parentBounds.height }
}

/** Top-left rect of an element in its parent's coordinate space */
export function getElementRectInParent(
  element: UIElement,
  elements: Record<string, UIElement>,
  deviceWidth: number,
  deviceHeight: number,
): { x: number; y: number; width: number; height: number; parentWidth: number; parentHeight: number } {
  const { parentWidth, parentHeight } = getParentDimensions(element, elements, deviceWidth, deviceHeight)
  const resolved = resolvePosition(
    element.position,
    element.size,
    element.anchorPoint,
    parentWidth,
    parentHeight,
  )
  return { ...resolved, parentWidth, parentHeight }
}

export function rectToRobloxProps(
  x: number,
  y: number,
  width: number,
  height: number,
  anchorPoint: { x: number; y: number },
): Pick<UIElement, 'position' | 'size'> {
  return {
    position: {
      xScale: 0,
      xOffset: x + width * anchorPoint.x,
      yScale: 0,
      yOffset: y + height * anchorPoint.y,
    },
    size: {
      xScale: 0,
      xOffset: width,
      yScale: 0,
      yOffset: height,
    },
  }
}

export type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se'

export function applyResize(
  handle: ResizeHandle,
  origin: { x: number; y: number; width: number; height: number },
  dx: number,
  dy: number,
  minSize = 8,
): { x: number; y: number; width: number; height: number } {
  let { x, y, width, height } = origin

  const affectsNorth = handle === 'n' || handle === 'nw' || handle === 'ne'
  const affectsSouth = handle === 's' || handle === 'sw' || handle === 'se'
  const affectsWest = handle === 'w' || handle === 'nw' || handle === 'sw'
  const affectsEast = handle === 'e' || handle === 'ne' || handle === 'se'

  if (affectsEast) {
    width = Math.max(minSize, origin.width + dx)
  }
  if (affectsWest) {
    width = Math.max(minSize, origin.width - dx)
    x = origin.x + origin.width - width
  }
  if (affectsSouth) {
    height = Math.max(minSize, origin.height + dy)
  }
  if (affectsNorth) {
    height = Math.max(minSize, origin.height - dy)
    y = origin.y + origin.height - height
  }

  return { x, y, width, height }
}

export function snapDimension(value: number, gridSize: number, enabled: boolean): number {
  if (!enabled || gridSize <= 0) return Math.round(value)
  return Math.round(value / gridSize) * gridSize
}

export function isResizable(element: UIElement): boolean {
  return (
    element.className !== 'ScreenGui' &&
    isGuiObject(element) &&
    !element.locked
  )
}
