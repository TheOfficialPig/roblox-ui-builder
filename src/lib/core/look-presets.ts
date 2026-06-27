import type { UIElement } from './types'
import { color3, udim } from './utils'
import { presetToGradient, GRADIENT_PRESETS } from './effects'

export interface LookPreset {
  id: string
  name: string
  description: string
  apply: (element: UIElement) => Partial<UIElement>
}

export const LOOK_PRESETS: LookPreset[] = [
  {
    id: 'flat',
    name: 'Flat',
    description: 'Clean solid panel',
    apply: () => ({
      backgroundTransparency: 0,
      uiCorner: { cornerRadius: udim(0, 8, 0, 8) },
      dropShadow: { enabled: false, offsetX: 0, offsetY: 6, blur: 16, spread: 0, color: color3(0, 0, 0), transparency: 0.55 },
      glow: { enabled: false, color: color3(0, 170, 255), size: 20, transparency: 0.35 },
      borderEffect: { enabled: false, style: 'Solid', width: 2, color: color3(255, 255, 255), transparency: 0 },
    }),
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Frosted glass panel',
    apply: (el) => ({
      backgroundTransparency: 0.35,
      uiCorner: { cornerRadius: udim(0, 16, 0, 16) },
      uiStroke: {
        color: color3(255, 255, 255),
        thickness: 1,
        transparency: 0.6,
        applyStrokeMode: 'Border',
        lineJoinMode: 'Round',
      },
      dropShadow: { enabled: true, offsetX: 0, offsetY: 8, blur: 24, spread: 0, color: color3(0, 0, 0), transparency: 0.5 },
      uiGradient: presetToGradient(GRADIENT_PRESETS.find((g) => g.id === 'ice')!),
    }),
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Glowing cyber accent',
    apply: () => ({
      backgroundColor3: color3(12, 12, 28),
      uiCorner: { cornerRadius: udim(0, 10, 0, 10) },
      glow: { enabled: true, color: color3(0, 255, 200), size: 24, transparency: 0.25 },
      uiStroke: {
        color: color3(0, 255, 200),
        thickness: 2,
        transparency: 0.2,
        applyStrokeMode: 'Border',
        lineJoinMode: 'Round',
      },
      uiGradient: presetToGradient(GRADIENT_PRESETS.find((g) => g.id === 'neon')!),
    }),
  },
  {
    id: 'premium-card',
    name: 'Premium Card',
    description: 'AAA menu card with depth',
    apply: () => ({
      backgroundColor3: color3(22, 26, 38),
      uiCorner: { cornerRadius: udim(0, 14, 0, 14) },
      dropShadow: { enabled: true, offsetX: 0, offsetY: 12, blur: 32, spread: 2, color: color3(0, 0, 0), transparency: 0.45 },
      borderEffect: { enabled: true, style: 'Solid', width: 1, color: color3(255, 255, 255), transparency: 0.85 },
      uiGradient: presetToGradient(GRADIENT_PRESETS.find((g) => g.id === 'midnight')!),
    }),
  },
  {
    id: 'metal',
    name: 'Metal',
    description: 'Brushed metal surface',
    apply: () => ({
      backgroundColor3: color3(70, 74, 82),
      uiCorner: { cornerRadius: udim(0, 6, 0, 6) },
      texture: { enabled: true, pattern: 'granite', imageUrl: '', scale: 1.2, opacity: 0.35, tint: color3(200, 200, 210) },
      borderEffect: { enabled: true, style: 'Solid', width: 2, color: color3(180, 185, 195), transparency: 0.3 },
      dropShadow: { enabled: true, offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: color3(0, 0, 0), transparency: 0.6 },
    }),
  },
  {
    id: 'pill-button',
    name: 'Pill Button',
    description: 'Rounded call-to-action button',
    apply: (el) => ({
      backgroundColor3: color3(59, 111, 255),
      uiCorner: { cornerRadius: udim(0, 24, 0, 24) },
      dropShadow: { enabled: true, offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: color3(30, 60, 180), transparency: 0.4 },
      ...(el.className === 'TextButton' || el.className === 'TextLabel'
        ? { textColor3: color3(255, 255, 255), font: 'GothamBold', textSize: 16 }
        : {}),
    }),
  },
  {
    id: 'rpg-frame',
    name: 'RPG Frame',
    description: 'Ornate fantasy border',
    apply: () => ({
      backgroundColor3: color3(32, 24, 16),
      uiCorner: { cornerRadius: udim(0, 4, 0, 4) },
      borderEffect: { enabled: true, style: 'Solid', width: 3, color: color3(218, 165, 32), transparency: 0.1 },
      uiStroke: {
        color: color3(255, 215, 0),
        thickness: 1,
        transparency: 0.5,
        applyStrokeMode: 'Border',
        lineJoinMode: 'Round',
      },
      texture: { enabled: true, pattern: 'noise', imageUrl: '', scale: 0.8, opacity: 0.15, tint: color3(180, 140, 80) },
    }),
  },
  {
    id: 'hud-chip',
    name: 'HUD Chip',
    description: 'Compact HUD stat badge',
    apply: () => ({
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
      clipsDescendants: true,
    }),
  },
]

export function applyLookPreset(element: UIElement, presetId: string): Partial<UIElement> {
  const preset = LOOK_PRESETS.find((p) => p.id === presetId)
  if (!preset) return {}
  return preset.apply(element)
}
