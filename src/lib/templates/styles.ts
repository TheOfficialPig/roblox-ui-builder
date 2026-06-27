import type { Color3 } from '@/lib/core/types'
import { color3 } from '@/lib/core/utils'

export const TEMPLATE_CATEGORIES = ['modern', 'retro', 'pixel', 'lowpoly'] as const
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  modern: 'Modern',
  retro: 'Retro',
  pixel: 'Pixel',
  lowpoly: 'Low Poly',
}

/** Phone canvas — most Roblox UIs target mobile */
export const PHONE_W = 390
export const PHONE_H = 844
export const PAD = 16

export interface StylePalette {
  bg: Color3
  panel: Color3
  raised: Color3
  slot: Color3
  accent: Color3
  accent2: Color3
  text: Color3
  muted: Color3
  border: Color3
  radius: number
  fontTitle: string
  fontBody: string
  borderPx: number
}

export const PALETTES: Record<TemplateCategory, StylePalette> = {
  modern: {
    bg: color3(12, 14, 22),
    panel: color3(22, 26, 38),
    raised: color3(32, 38, 54),
    slot: color3(40, 46, 62),
    accent: color3(59, 111, 255),
    accent2: color3(0, 190, 120),
    text: color3(245, 247, 255),
    muted: color3(140, 148, 175),
    border: color3(55, 62, 85),
    radius: 12,
    fontTitle: 'GothamBold',
    fontBody: 'Gotham',
    borderPx: 1,
  },
  retro: {
    bg: color3(28, 20, 16),
    panel: color3(48, 32, 24),
    raised: color3(64, 44, 32),
    slot: color3(80, 56, 40),
    accent: color3(255, 180, 40),
    accent2: color3(220, 80, 50),
    text: color3(255, 248, 220),
    muted: color3(200, 170, 130),
    border: color3(120, 80, 50),
    radius: 4,
    fontTitle: 'Arcade',
    fontBody: 'Arcade',
    borderPx: 3,
  },
  pixel: {
    bg: color3(16, 20, 32),
    panel: color3(24, 32, 48),
    raised: color3(32, 44, 64),
    slot: color3(40, 52, 72),
    accent: color3(80, 220, 120),
    accent2: color3(240, 80, 80),
    text: color3(240, 248, 255),
    muted: color3(120, 140, 160),
    border: color3(200, 220, 255),
    radius: 0,
    fontTitle: 'Code',
    fontBody: 'Code',
    borderPx: 4,
  },
  lowpoly: {
    bg: color3(198, 210, 225),
    panel: color3(225, 232, 242),
    raised: color3(240, 244, 250),
    slot: color3(210, 220, 235),
    accent: color3(90, 140, 220),
    accent2: color3(120, 200, 160),
    text: color3(40, 50, 70),
    muted: color3(90, 105, 130),
    border: color3(160, 175, 200),
    radius: 6,
    fontTitle: 'SourceSansBold',
    fontBody: 'SourceSans',
    borderPx: 2,
  },
}
