import { createElement } from './defaults'
import type { SavedComponent } from './types'
import { color3, udim, udim2Offset } from './utils'

function premiumButton(): SavedComponent {
  const root = createElement('TextButton', {
    name: 'PremiumButton',
    size: udim2Offset(200, 52),
    backgroundColor3: color3(59, 111, 255),
    text: 'Play',
    textColor3: color3(255, 255, 255),
    font: 'GothamBold',
    textSize: 17,
    uiCorner: { cornerRadius: udim(0, 24, 0, 24) },
    dropShadow: {
      enabled: true,
      offsetX: 0,
      offsetY: 4,
      blur: 12,
      spread: 0,
      color: color3(30, 60, 180),
      transparency: 0.4,
    },
  })
  return {
    id: 'builtin-premium-button',
    name: 'Premium Button',
    elements: { [root.id]: root },
    rootIds: [root.id],
    createdAt: new Date().toISOString(),
  }
}

function glassPanel(): SavedComponent {
  const root = createElement('Frame', {
    name: 'GlassPanel',
    size: udim2Offset(320, 200),
    backgroundColor3: color3(22, 26, 38),
    backgroundTransparency: 0.35,
    clipsDescendants: true,
    uiCorner: { cornerRadius: udim(0, 16, 0, 16) },
    uiStroke: {
      color: color3(255, 255, 255),
      thickness: 1,
      transparency: 0.6,
      applyStrokeMode: 'Border',
      lineJoinMode: 'Round',
    },
    dropShadow: {
      enabled: true,
      offsetX: 0,
      offsetY: 8,
      blur: 24,
      spread: 0,
      color: color3(0, 0, 0),
      transparency: 0.5,
    },
  })
  const title = createElement('TextLabel', {
    name: 'Title',
    parentId: root.id,
    size: udim2Offset(280, 32),
    position: udim2Offset(20, 16),
    backgroundTransparency: 1,
    text: 'Panel Title',
    font: 'GothamBold',
    textSize: 20,
    textXAlignment: 'Left',
    textYAlignment: 'Center',
  })
  root.children.push(title.id)
  return {
    id: 'builtin-glass-panel',
    name: 'Glass Panel',
    elements: { [root.id]: root, [title.id]: title },
    rootIds: [root.id],
    createdAt: new Date().toISOString(),
  }
}

function hudChip(): SavedComponent {
  const root = createElement('Frame', {
    name: 'HUDChip',
    size: udim2Offset(140, 36),
    backgroundColor3: color3(0, 0, 0),
    backgroundTransparency: 0.35,
    uiCorner: { cornerRadius: udim(0, 6, 0, 6) },
    uiStroke: {
      color: color3(255, 255, 255),
      thickness: 1,
      transparency: 0.7,
      applyStrokeMode: 'Border',
      lineJoinMode: 'Round',
    },
  })
  const label = createElement('TextLabel', {
    name: 'Value',
    parentId: root.id,
    size: udim2Offset(120, 28),
    position: udim2Offset(10, 4),
    backgroundTransparency: 1,
    text: '1,250 HP',
    font: 'GothamBold',
    textSize: 14,
    textXAlignment: 'Left',
  })
  root.children.push(label.id)
  return {
    id: 'builtin-hud-chip',
    name: 'HUD Chip',
    elements: { [root.id]: root, [label.id]: label },
    rootIds: [root.id],
    createdAt: new Date().toISOString(),
  }
}

export const BUILTIN_COMPONENTS: SavedComponent[] = [
  premiumButton(),
  glassPanel(),
  hudChip(),
]
