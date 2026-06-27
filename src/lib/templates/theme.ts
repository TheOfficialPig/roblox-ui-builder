import { createElement } from '@/lib/core/defaults'
import type { UIElement } from '@/lib/core/types'
import { color3, udim, udim2Offset } from '@/lib/core/utils'

/** Shared free-tier palette */
export const T = {
  bg: color3(10, 10, 14),
  panel: color3(20, 20, 28),
  panelRaised: color3(28, 28, 38),
  slot: color3(32, 32, 44),
  border: color3(58, 58, 78),
  accent: color3(51, 95, 255),
  success: color3(0, 176, 111),
  danger: color3(220, 60, 60),
  text: color3(240, 240, 248),
  textMuted: color3(140, 140, 165),
  textDim: color3(100, 100, 120),
  overlay: color3(0, 0, 0),
} as const

export const radius = { sm: 6, md: 8, lg: 12 } as const

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

export function addChild(parentId: string, elements: Els, el: UIElement): UIElement {
  el.parentId = parentId
  elements[el.id] = el
  elements[parentId].children.push(el.id)
  return el
}

/** Centered on 1366×768 desktop canvas */
export function centerPos(w: number, h: number) {
  return udim2Offset(Math.round((1366 - w) / 2), Math.round((768 - h) / 2))
}

export function panel(
  name: string,
  w: number,
  h: number,
  pos = centerPos(w, h),
  opts?: Partial<UIElement>,
) {
  return createElement('Frame', {
    name,
    size: udim2Offset(w, h),
    position: pos,
    backgroundColor3: T.panel,
    clipsDescendants: true,
    ...corner(radius.lg),
    uiStroke: stroke(),
    ...opts,
  })
}

export function panelTitle(parentId: string, els: Els, text: string, w: number) {
  return label(parentId, els, 'Title', text.toUpperCase(), 16, 14, w - 32, 28, {
    font: 'GothamBold',
    textSize: 18,
    textColor3: T.text,
  })
}

export function primaryBtn(
  parentId: string,
  els: Els,
  name: string,
  text: string,
  x: number,
  y: number,
  w = 260,
) {
  return addChild(parentId, els, createElement('TextButton', {
    name,
    text: text.toUpperCase(),
    size: udim2Offset(w, 42),
    position: udim2Offset(x, y),
    backgroundColor3: T.accent,
    textColor3: T.text,
    font: 'GothamBold',
    textSize: 14,
    ...corner(radius.md),
  }))
}

export function successBtn(
  parentId: string,
  els: Els,
  name: string,
  text: string,
  x: number,
  y: number,
  w = 260,
) {
  return addChild(parentId, els, createElement('TextButton', {
    name,
    text: text.toUpperCase(),
    size: udim2Offset(w, 42),
    position: udim2Offset(x, y),
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
  x: number,
  y: number,
  w = 260,
) {
  return addChild(parentId, els, createElement('TextButton', {
    name,
    text,
    size: udim2Offset(w, 42),
    position: udim2Offset(x, y),
    backgroundColor3: T.panelRaised,
    textColor3: T.textMuted,
    font: 'Gotham',
    textSize: 14,
    ...corner(radius.md),
    uiStroke: stroke(),
  }))
}

export function label(
  parentId: string,
  els: Els,
  name: string,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  opts?: Partial<UIElement>,
) {
  return addChild(parentId, els, createElement('TextLabel', {
    name,
    text,
    size: udim2Offset(w, h),
    position: udim2Offset(x, y),
    backgroundTransparency: 1,
    textColor3: T.text,
    font: 'Gotham',
    textSize: 14,
    ...opts,
  }))
}

export function fullBg(parentId: string, els: Els) {
  return addChild(parentId, els, createElement('Frame', {
    name: 'Background',
    size: udim(1, 0, 1, 0),
    backgroundColor3: T.bg,
  }))
}

/** Manually placed grid — canvas doesn't auto-layout UIGridLayout yet */
export function gridSlots(
  parentId: string,
  els: Els,
  count: number,
  cols: number,
  cell: number,
  gap: number,
  startX: number,
  startY: number,
  prefix = 'Slot',
) {
  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    addChild(parentId, els, createElement('Frame', {
      name: `${prefix}${i + 1}`,
      size: udim2Offset(cell, cell),
      position: udim2Offset(startX + col * (cell + gap), startY + row * (cell + gap)),
      backgroundColor3: T.slot,
      ...corner(radius.md),
      uiStroke: stroke(),
    }))
  }
}

export function rowFrame(
  parentId: string,
  els: Els,
  name: string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  return addChild(parentId, els, createElement('Frame', {
    name,
    size: udim2Offset(w, h),
    position: udim2Offset(x, y),
    backgroundColor3: T.panelRaised,
    ...corner(radius.md),
    uiStroke: stroke(),
  }))
}
