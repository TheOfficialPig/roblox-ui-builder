import { createElement } from '@/lib/core/defaults'
import type { UIElement } from '@/lib/core/types'
import { udim, udim2Offset } from '@/lib/core/utils'
import type { StylePalette } from './styles'
import { DESKTOP_H, DESKTOP_W, PAD } from './styles'

type Els = Record<string, UIElement>

export const CANVAS_W = DESKTOP_W
export const CANVAS_H = DESKTOP_H

export function cx(w: number) {
  return Math.round((CANVAS_W - w) / 2)
}

export function cy(h: number) {
  return Math.round((CANVAS_H - h) / 2)
}

/** Width of a full-width panel (screen margins) */
export function panelW() {
  return CANVAS_W - PAD * 2
}

/** Inner content width inside a screenPanel */
export function panelInnerW() {
  return CANVAS_W - PAD * 4
}

export function addChild(parentId: string, elements: Els, el: UIElement): UIElement {
  el.parentId = parentId
  elements[el.id] = el
  elements[parentId].children.push(el.id)
  return el
}

function corner(palette: StylePalette) {
  const r = palette.radius
  return { cornerRadius: udim(0, r, 0, r) }
}

function borderStroke(palette: StylePalette) {
  if (palette.borderPx <= 0) return {}
  return {
    borderSizePixel: palette.borderPx,
    borderColor3: palette.border,
  }
}

export function bg(root: string, els: Els, palette: StylePalette) {
  return addChild(root, els, createElement('Frame', {
    name: 'Background',
    size: udim(1, 0, 1, 0),
    position: udim2Offset(0, 0),
    backgroundColor3: palette.bg,
  }))
}

export function box(
  parent: string,
  els: Els,
  palette: StylePalette,
  name: string,
  x: number,
  y: number,
  w: number,
  h: number,
  opts?: Partial<UIElement>,
) {
  return addChild(parent, els, createElement('Frame', {
    name,
    size: udim2Offset(w, h),
    position: udim2Offset(x, y),
    backgroundColor3: palette.panel,
    clipsDescendants: true,
    ...corner(palette),
    ...borderStroke(palette),
    ...opts,
  }))
}

export function raised(
  parent: string,
  els: Els,
  palette: StylePalette,
  name: string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  return box(parent, els, palette, name, x, y, w, h, { backgroundColor3: palette.raised })
}

export function txt(
  parent: string,
  els: Els,
  palette: StylePalette,
  name: string,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  opts?: Partial<UIElement>,
) {
  return addChild(parent, els, createElement('TextLabel', {
    name,
    text,
    size: udim2Offset(w, h),
    position: udim2Offset(x, y),
    backgroundTransparency: 1,
    textColor3: palette.text,
    font: palette.fontBody,
    textSize: 16,
    ...opts,
  }))
}

export function title(
  parent: string,
  els: Els,
  palette: StylePalette,
  text: string,
  x: number,
  y: number,
  w: number,
) {
  return txt(parent, els, palette, 'Title', text, x, y, w, 40, {
    font: palette.fontTitle,
    textSize: palette.fontTitle === 'Code' ? 20 : 28,
  })
}

export function btn(
  parent: string,
  els: Els,
  palette: StylePalette,
  name: string,
  text: string,
  x: number,
  y: number,
  w: number,
  variant: 'primary' | 'secondary' | 'success' = 'primary',
) {
  const colors = {
    primary: palette.accent,
    secondary: palette.raised,
    success: palette.accent2,
  }
  return addChild(parent, els, createElement('TextButton', {
    name,
    text: palette.fontTitle === 'Code' ? text.toUpperCase() : text,
    size: udim2Offset(w, 52),
    position: udim2Offset(x, y),
    backgroundColor3: colors[variant],
    textColor3: variant === 'secondary' ? palette.muted : palette.text,
    font: palette.fontTitle,
    textSize: palette.fontTitle === 'Code' ? 15 : 17,
    ...corner(palette),
    ...borderStroke(palette),
  }))
}

export function slot(
  parent: string,
  els: Els,
  palette: StylePalette,
  name: string,
  x: number,
  y: number,
  size: number,
) {
  return raised(parent, els, palette, name, x, y, size, size)
}

export function slotGrid(
  parent: string,
  els: Els,
  palette: StylePalette,
  cols: number,
  cell: number,
  gap: number,
  startX: number,
  startY: number,
  count: number,
  prefix = 'Slot',
) {
  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    slot(
      parent,
      els,
      palette,
      `${prefix}${i + 1}`,
      startX + col * (cell + gap),
      startY + row * (cell + gap),
      cell,
    )
  }
}

/** Full-screen panel with standard desktop margins */
export function screenPanel(parent: string, els: Els, palette: StylePalette, name: string, top = 40) {
  const w = panelW()
  const h = CANVAS_H - top - PAD
  return box(parent, els, palette, name, PAD, top, w, h)
}

export function hudBar(
  parent: string,
  els: Els,
  palette: StylePalette,
  name: string,
  x: number,
  y: number,
  w: number,
  fillPct: number,
  fillColor = palette.accent2,
) {
  const bar = raised(parent, els, palette, name, x, y, w, 28)
  addChild(bar.id, els, createElement('Frame', {
    name: 'Fill',
    size: udim2Offset(Math.round((w - 10) * fillPct), 18),
    position: udim2Offset(5, 5),
    backgroundColor3: fillColor,
    ...corner(palette),
  }))
  return bar
}
