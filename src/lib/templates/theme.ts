import { createElement } from '@/lib/core/defaults'
import type { UIElement } from '@/lib/core/types'
import { color3, udim, udim2Offset } from '@/lib/core/utils'

/** Shared free-tier palette — cohesive, readable, not over-designed */
export const T = {
  bg: color3(10, 10, 14),
  bgSoft: color3(14, 14, 20),
  panel: color3(20, 20, 28),
  panelRaised: color3(28, 28, 38),
  slot: color3(32, 32, 44),
  border: color3(58, 58, 78),
  borderLight: color3(72, 72, 96),
  accent: color3(51, 95, 255),
  accentHover: color3(41, 78, 210),
  success: color3(0, 176, 111),
  danger: color3(220, 60, 60),
  warning: color3(240, 170, 40),
  text: color3(240, 240, 248),
  textMuted: color3(140, 140, 165),
  textDim: color3(100, 100, 120),
  overlay: color3(0, 0, 0),
} as const

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
} as const

export function corner(px: number) {
  return { cornerRadius: udim(0, px, 0, px) }
}

export function stroke(color = T.border, thickness = 1) {
  return {
    color,
    thickness,
    transparency: 0,
    applyStrokeMode: 'Contextual' as const,
    lineJoinMode: 'Round' as const,
  }
}

type Els = Record<string, UIElement>

export function addChild(
  parentId: string,
  elements: Els,
  el: UIElement,
): UIElement {
  el.parentId = parentId
  elements[el.id] = el
  elements[parentId].children.push(el.id)
  return el
}

/** Standard modal / panel shell */
export function panel(
  name: string,
  size: ReturnType<typeof udim2Offset>,
  position: ReturnType<typeof udim2Offset>,
  opts?: Partial<UIElement>,
) {
  return createElement('Frame', {
    name,
    size,
    position,
    backgroundColor3: T.panel,
    ...corner(radius.lg),
    uiStroke: stroke(),
    ...opts,
  })
}

/** Top header strip inside a panel */
export function headerBar(
  parentId: string,
  els: Els,
  title: string,
  width: number,
  opts?: { subtitle?: string; height?: number },
) {
  const h = opts?.height ?? 52
  const bar = addChild(
    parentId,
    els,
    createElement('Frame', {
      name: 'Header',
      size: udim2Offset(width, h),
      position: udim2Offset(0, 0),
      backgroundColor3: T.panelRaised,
      ...corner(radius.lg),
    }),
  )
  addChild(bar.id, els, createElement('Frame', {
    name: 'AccentLine',
    size: udim2Offset(width, 3),
    position: udim2Offset(0, h - 3),
    backgroundColor3: T.accent,
    backgroundTransparency: 0,
  }))
  addChild(bar.id, els, createElement('TextLabel', {
    name: 'Title',
    text: title.toUpperCase(),
    size: udim2Offset(width - 48, 24),
    position: udim2Offset(16, 10),
    backgroundTransparency: 1,
    font: 'GothamBold',
    textSize: 18,
    textColor3: T.text,
  }))
  if (opts?.subtitle) {
    addChild(bar.id, els, createElement('TextLabel', {
      name: 'Subtitle',
      text: opts.subtitle,
      size: udim2Offset(width - 48, 16),
      position: udim2Offset(16, 32),
      backgroundTransparency: 1,
      font: 'Gotham',
      textSize: 11,
      textColor3: T.textMuted,
    }))
  }
  return bar
}

export function closeBtn(parentId: string, els: Els, panelWidth: number) {
  return addChild(parentId, els, createElement('TextButton', {
    name: 'Close',
    text: '✕',
    size: udim2Offset(28, 28),
    position: udim2Offset(panelWidth - 36, 8),
    backgroundColor3: T.panelRaised,
    textColor3: T.textMuted,
    textSize: 14,
    font: 'GothamBold',
    ...corner(radius.sm),
    uiStroke: stroke(T.border, 1),
  }))
}

export function primaryBtn(
  parentId: string,
  els: Els,
  name: string,
  text: string,
  pos: ReturnType<typeof udim2Offset>,
  width = 280,
) {
  return addChild(parentId, els, createElement('TextButton', {
    name,
    text: text.toUpperCase(),
    size: udim2Offset(width, 44),
    position: pos,
    backgroundColor3: T.accent,
    textColor3: T.text,
    font: 'GothamBold',
    textSize: 15,
    ...corner(radius.md),
  }))
}

export function successBtn(
  parentId: string,
  els: Els,
  name: string,
  text: string,
  pos: ReturnType<typeof udim2Offset>,
  width = 140,
) {
  return addChild(parentId, els, createElement('TextButton', {
    name,
    text: text.toUpperCase(),
    size: udim2Offset(width, 40),
    position: pos,
    backgroundColor3: T.success,
    textColor3: T.text,
    font: 'GothamBold',
    textSize: 14,
    ...corner(radius.md),
  }))
}

export function ghostBtn(
  parentId: string,
  els: Els,
  name: string,
  text: string,
  pos: ReturnType<typeof udim2Offset>,
  width = 280,
) {
  return addChild(parentId, els, createElement('TextButton', {
    name,
    text,
    size: udim2Offset(width, 44),
    position: pos,
    backgroundColor3: T.panelRaised,
    textColor3: T.textMuted,
    font: 'Gotham',
    textSize: 14,
    ...corner(radius.md),
    uiStroke: stroke(),
  }))
}

export function slot(
  parentId: string,
  els: Els,
  name: string,
  size = 80,
  layoutOrder?: number,
) {
  return addChild(parentId, els, createElement('Frame', {
    name,
    size: udim2Offset(size, size),
    backgroundColor3: T.slot,
    layoutOrder,
    ...corner(radius.md),
    uiStroke: stroke(T.border, 1),
  }))
}

export function label(
  parentId: string,
  els: Els,
  name: string,
  text: string,
  pos: ReturnType<typeof udim2Offset>,
  size: ReturnType<typeof udim2Offset>,
  opts?: Partial<UIElement>,
) {
  return addChild(parentId, els, createElement('TextLabel', {
    name,
    text,
    size,
    position: pos,
    backgroundTransparency: 1,
    textColor3: T.text,
    font: 'Gotham',
    textSize: 14,
    ...opts,
  }))
}

export function fullBg(parentId: string, els: Els, color = T.bg) {
  return addChild(parentId, els, createElement('Frame', {
    name: 'Background',
    size: udim(1, 0, 1, 0),
    backgroundColor3: color,
  }))
}

export function statRow(
  parentId: string,
  els: Els,
  name: string,
  text: string,
  y: number,
  width: number,
) {
  const row = addChild(parentId, els, createElement('Frame', {
    name,
    size: udim2Offset(width, 40),
    position: udim2Offset(16, y),
    backgroundColor3: T.panelRaised,
    ...corner(radius.md),
    uiStroke: stroke(T.border, 1),
  }))
  addChild(row.id, els, createElement('TextLabel', {
    name: 'Value',
    text,
    size: udim(1, -24, 1, 0),
    position: udim2Offset(12, 0),
    backgroundTransparency: 1,
    font: 'Gotham',
    textSize: 14,
    textColor3: T.text,
  }))
  return row
}

export function listRow(
  parentId: string,
  els: Els,
  name: string,
  primary: string,
  secondary: string,
  y: number,
  width: number,
) {
  const row = addChild(parentId, els, createElement('Frame', {
    name,
    size: udim2Offset(width, 48),
    position: udim2Offset(16, y),
    backgroundColor3: T.panelRaised,
    ...corner(radius.md),
    uiStroke: stroke(T.border, 1),
  }))
  addChild(row.id, els, createElement('TextLabel', {
    name: 'Primary',
    text: primary,
    size: udim2Offset(width - 80, 20),
    position: udim2Offset(12, 6),
    backgroundTransparency: 1,
    font: 'GothamBold',
    textSize: 13,
    textColor3: T.text,
  }))
  addChild(row.id, els, createElement('TextLabel', {
    name: 'Secondary',
    text: secondary,
    size: udim2Offset(60, 20),
    position: udim2Offset(width - 72, 14),
    backgroundTransparency: 1,
    font: 'Gotham',
    textSize: 12,
    textColor3: T.textMuted,
  }))
  return row
}
