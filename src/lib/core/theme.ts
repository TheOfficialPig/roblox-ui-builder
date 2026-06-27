import type { Color3, ProjectTheme, UIElement } from './types'
import { color3 } from './utils'

export const DEFAULT_THEME: ProjectTheme = {
  name: 'Studio Dark',
  primary: color3(59, 111, 255),
  secondary: color3(32, 38, 54),
  surface: color3(22, 26, 38),
  raised: color3(40, 46, 62),
  text: color3(245, 247, 255),
  muted: color3(140, 148, 175),
  accent: color3(59, 111, 255),
  accent2: color3(0, 190, 120),
  radius: 12,
  fontTitle: 'GothamBold',
  fontBody: 'Gotham',
}

export const BUILT_IN_THEMES: ProjectTheme[] = [
  DEFAULT_THEME,
  {
    name: 'Neon Arcade',
    primary: color3(255, 42, 140),
    secondary: color3(48, 20, 64),
    surface: color3(24, 12, 40),
    raised: color3(60, 28, 88),
    text: color3(255, 240, 255),
    muted: color3(180, 140, 200),
    accent: color3(0, 255, 200),
    accent2: color3(255, 200, 0),
    radius: 8,
    fontTitle: 'Arcade',
    fontBody: 'Arcade',
  },
  {
    name: 'Low Poly',
    primary: color3(90, 140, 220),
    secondary: color3(210, 220, 235),
    surface: color3(225, 232, 242),
    raised: color3(240, 244, 250),
    text: color3(40, 50, 70),
    muted: color3(90, 105, 130),
    accent: color3(90, 140, 220),
    accent2: color3(120, 200, 160),
    radius: 6,
    fontTitle: 'SourceSansBold',
    fontBody: 'SourceSans',
  },
  {
    name: 'RPG Gold',
    primary: color3(218, 165, 32),
    secondary: color3(48, 36, 24),
    surface: color3(32, 24, 16),
    raised: color3(56, 42, 28),
    text: color3(255, 248, 220),
    muted: color3(200, 170, 130),
    accent: color3(255, 215, 0),
    accent2: color3(220, 80, 50),
    radius: 4,
    fontTitle: 'GothamBold',
    fontBody: 'Gotham',
  },
]

export function applyThemeToElement(
  element: UIElement,
  theme: ProjectTheme,
  role: 'surface' | 'raised' | 'primary' | 'secondary' | 'text' | 'accent' = 'surface',
): Partial<UIElement> {
  const updates: Partial<UIElement> = {}

  if (['Frame', 'TextButton', 'ImageButton', 'ScrollingFrame'].includes(element.className)) {
    const bg =
      role === 'primary'
        ? theme.primary
        : role === 'secondary'
          ? theme.secondary
          : role === 'raised'
            ? theme.raised
            : theme.surface
    updates.backgroundColor3 = bg
  }

  if (['TextLabel', 'TextButton'].includes(element.className)) {
    updates.textColor3 = role === 'accent' ? theme.accent : theme.text
    updates.font = theme.fontBody
    if (element.className === 'TextButton' && role === 'primary') {
      updates.font = theme.fontTitle
    }
  }

  updates.uiCorner = {
    cornerRadius: { xScale: 0, xOffset: theme.radius, yScale: 0, yOffset: theme.radius },
  }

  return updates
}

export function mergeTheme(projectTheme?: ProjectTheme): ProjectTheme {
  return { ...DEFAULT_THEME, ...projectTheme }
}
