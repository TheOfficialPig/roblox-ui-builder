import type {
  UIAspectRatioConstraintProps,
  UICornerProps,
  UIGradientProps,
  UIPaddingProps,
  UIScaleProps,
  UIStrokeProps,
  UIElement,
} from './types'
import { isModifierObject } from './utils'

export interface ResolvedModifiers {
  uiCorner?: UICornerProps
  uiStroke?: UIStrokeProps
  uiGradient?: UIGradientProps
  uiPadding?: UIPaddingProps
  uiAspectRatio?: UIAspectRatioConstraintProps
  uiScale?: UIScaleProps
}

/** Merge modifier props from the element and attached modifier children (Roblox-style). */
export function resolveAttachedModifiers(
  element: UIElement,
  elements: Record<string, UIElement>,
): ResolvedModifiers {
  const resolved: ResolvedModifiers = {}

  if (element.uiCorner) resolved.uiCorner = element.uiCorner
  if (element.uiStroke) resolved.uiStroke = element.uiStroke
  if (element.uiGradient) resolved.uiGradient = element.uiGradient
  if (element.uiPadding) resolved.uiPadding = element.uiPadding
  if (element.uiAspectRatio) resolved.uiAspectRatio = element.uiAspectRatio
  if (element.uiScale) resolved.uiScale = element.uiScale

  for (const childId of element.children) {
    const child = elements[childId]
    if (!child || !child.visible || !isModifierObject(child.className)) continue

    switch (child.className) {
      case 'UICorner':
        if (child.uiCorner) resolved.uiCorner = child.uiCorner
        break
      case 'UIStroke':
        if (child.uiStroke) resolved.uiStroke = child.uiStroke
        break
      case 'UIGradient':
        if (child.uiGradient) resolved.uiGradient = child.uiGradient
        break
      case 'UIPadding':
        if (child.uiPadding) resolved.uiPadding = child.uiPadding
        break
      case 'UIAspectRatioConstraint':
        if (child.uiAspectRatio) resolved.uiAspectRatio = child.uiAspectRatio
        break
      case 'UIScale':
        if (child.uiScale) resolved.uiScale = child.uiScale
        break
    }
  }

  return resolved
}

export function resolveUIScale(
  element: UIElement,
  elements: Record<string, UIElement>,
): number {
  const mods = resolveAttachedModifiers(element, elements)
  return mods.uiScale?.scale ?? 1
}

export function cornerRadiusToCss(
  corner: UICornerProps,
  width: number,
  height: number,
): string | number {
  const rx = corner.cornerRadius.xScale * width + corner.cornerRadius.xOffset
  const ry = corner.cornerRadius.yScale * height + corner.cornerRadius.yOffset
  if (Math.abs(rx - ry) < 0.5) return Math.max(0, Math.round(rx))
  return `${Math.max(0, rx)}px ${Math.max(0, ry)}px`
}
