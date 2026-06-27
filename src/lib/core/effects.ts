import type { CSSProperties } from 'react'
import type {
  Color3,
  DropShadowEffect,
  GlowEffect,
  BorderEffect,
  TextureEffect,
  TexturePattern,
  UIElement,
  UIGradientProps,
  GradientPreset,
} from './types'
import { color3 } from './utils'

export const DEFAULT_DROP_SHADOW: DropShadowEffect = {
  enabled: false,
  offsetX: 0,
  offsetY: 6,
  blur: 16,
  spread: 0,
  color: color3(0, 0, 0),
  transparency: 0.55,
}

export const DEFAULT_GLOW: GlowEffect = {
  enabled: false,
  color: color3(0, 170, 255),
  size: 20,
  transparency: 0.35,
}

export const DEFAULT_BORDER_EFFECT: BorderEffect = {
  enabled: false,
  style: 'Solid',
  width: 2,
  color: color3(255, 255, 255),
  transparency: 0,
}

export const DEFAULT_TEXTURE: TextureEffect = {
  enabled: false,
  pattern: 'none',
  imageUrl: '',
  scale: 1,
  opacity: 0.45,
  tint: color3(255, 255, 255),
}

export function resolveDropShadow(el: UIElement): DropShadowEffect {
  return { ...DEFAULT_DROP_SHADOW, ...el.dropShadow }
}

export function resolveGlow(el: UIElement): GlowEffect {
  return { ...DEFAULT_GLOW, ...el.glow }
}

export function resolveBorderEffect(el: UIElement): BorderEffect {
  return { ...DEFAULT_BORDER_EFFECT, ...el.borderEffect }
}

export function resolveTexture(el: UIElement): TextureEffect {
  return { ...DEFAULT_TEXTURE, ...el.texture }
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'ocean',
    name: 'Ocean Blue',
    rotation: 135,
    colorSequence: [
      { offset: 0, color: color3(0, 120, 215) },
      { offset: 1, color: color3(0, 60, 130) },
    ],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    rotation: 90,
    colorSequence: [
      { offset: 0, color: color3(255, 94, 58) },
      { offset: 0.5, color: color3(255, 42, 104) },
      { offset: 1, color: color3(138, 43, 226) },
    ],
  },
  {
    id: 'neon',
    name: 'Neon',
    rotation: 45,
    colorSequence: [
      { offset: 0, color: color3(0, 255, 200) },
      { offset: 1, color: color3(120, 0, 255) },
    ],
  },
  {
    id: 'granite',
    name: 'Granite',
    rotation: 160,
    colorSequence: [
      { offset: 0, color: color3(90, 90, 95) },
      { offset: 0.25, color: color3(130, 130, 138) },
      { offset: 0.5, color: color3(70, 70, 78) },
      { offset: 0.75, color: color3(110, 110, 118) },
      { offset: 1, color: color3(85, 85, 92) },
    ],
  },
  {
    id: 'marble',
    name: 'Marble',
    rotation: 120,
    colorSequence: [
      { offset: 0, color: color3(240, 240, 245) },
      { offset: 0.4, color: color3(200, 200, 210) },
      { offset: 0.7, color: color3(230, 230, 238) },
      { offset: 1, color: color3(180, 180, 192) },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    rotation: 180,
    colorSequence: [
      { offset: 0, color: color3(255, 215, 0) },
      { offset: 0.5, color: color3(218, 165, 32) },
      { offset: 1, color: color3(184, 134, 11) },
    ],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    rotation: 180,
    colorSequence: [
      { offset: 0, color: color3(15, 15, 30) },
      { offset: 1, color: color3(40, 20, 80) },
    ],
  },
  {
    id: 'forest',
    name: 'Forest',
    rotation: 135,
    colorSequence: [
      { offset: 0, color: color3(34, 139, 34) },
      { offset: 1, color: color3(0, 80, 40) },
    ],
  },
  {
    id: 'candy',
    name: 'Candy',
    rotation: 90,
    colorSequence: [
      { offset: 0, color: color3(255, 105, 180) },
      { offset: 0.5, color: color3(255, 182, 193) },
      { offset: 1, color: color3(147, 112, 219) },
    ],
  },
  {
    id: 'carbon',
    name: 'Carbon Fiber',
    rotation: 45,
    colorSequence: [
      { offset: 0, color: color3(30, 30, 35) },
      { offset: 0.5, color: color3(50, 50, 58) },
      { offset: 1, color: color3(25, 25, 30) },
    ],
  },
  {
    id: 'roblox',
    name: 'Roblox Red',
    rotation: 90,
    colorSequence: [
      { offset: 0, color: color3(226, 35, 26) },
      { offset: 1, color: color3(180, 20, 15) },
    ],
  },
  {
    id: 'ice',
    name: 'Ice',
    rotation: 160,
    colorSequence: [
      { offset: 0, color: color3(200, 230, 255) },
      { offset: 0.5, color: color3(140, 200, 255) },
      { offset: 1, color: color3(220, 240, 255) },
    ],
  },
]

export const TEXTURE_OPTIONS: Array<{ id: TexturePattern; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'noise', label: 'Noise' },
  { id: 'dots', label: 'Dots' },
  { id: 'lines', label: 'Lines' },
  { id: 'grid', label: 'Grid' },
  { id: 'granite', label: 'Granite' },
  { id: 'marble', label: 'Marble' },
  { id: 'carbon', label: 'Carbon Fiber' },
  { id: 'brick', label: 'Brick' },
  { id: 'hex', label: 'Hexagon' },
  { id: 'wood', label: 'Wood Grain' },
  { id: 'custom', label: 'Custom Image URL' },
]

function colorToCss(color: Color3, alpha = 1): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
}

function tintCss(tint: Color3): string {
  return colorToCss(tint, 0.35)
}

function patternSize(scale: number, base: number): string {
  return `${Math.max(8, Math.round(base * scale))}px`
}

export function getTextureLayers(
  texture: TextureEffect,
): { image: string; size: string; repeat: string } | null {
  if (!texture.enabled || texture.pattern === 'none') return null

  if (texture.pattern === 'custom' && texture.imageUrl) {
    return {
      image: `url("${texture.imageUrl}")`,
      size: `${Math.round(100 * texture.scale)}px`,
      repeat: 'repeat',
    }
  }

  const s = texture.scale
  const tint = tintCss(texture.tint)

  const patterns: Record<Exclude<TexturePattern, 'none' | 'custom'>, string> = {
    noise: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>`,
    )}")`,
    dots: `radial-gradient(${tint} 1.5px, transparent 1.5px)`,
    lines: `repeating-linear-gradient(0deg, ${tint}, ${tint} 1px, transparent 1px, transparent ${patternSize(s, 6)})`,
    grid: `linear-gradient(${tint} 1px, transparent 1px), linear-gradient(90deg, ${tint} 1px, transparent 1px)`,
    granite: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='g'><feTurbulence type='turbulence' baseFrequency='0.04' numOctaves='5'/><feColorMatrix type='saturate' values='0.2'/></filter><rect width='100%' height='100%' filter='url(%23g)' fill='%23808088'/></svg>`,
    )}"), linear-gradient(135deg, rgba(70,70,78,0.9), rgba(120,120,130,0.85), rgba(60,60,68,0.9))`,
    marble: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='m'><feTurbulence type='turbulence' baseFrequency='0.02' numOctaves='3'/><feGaussianBlur stdDeviation='1.5'/></filter><rect width='100%' height='100%' filter='url(%23m)' fill='%23e8e8ef'/></svg>`,
    )}")`,
    carbon: `repeating-linear-gradient(45deg, rgba(40,40,48,0.95) 0px, rgba(40,40,48,0.95) 2px, rgba(25,25,30,0.95) 2px, rgba(25,25,30,0.95) 4px), repeating-linear-gradient(-45deg, rgba(40,40,48,0.95) 0px, rgba(40,40,48,0.95) 2px, rgba(25,25,30,0.95) 2px, rgba(25,25,30,0.95) 4px)`,
    brick: `linear-gradient(335deg, ${tint} 4px, transparent 4px), linear-gradient(155deg, ${tint} 4px, transparent 4px), linear-gradient(335deg, ${tint} 4px, transparent 4px), linear-gradient(155deg, ${tint} 4px, transparent 4px)`,
    hex: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'><path d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15z' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='1'/></svg>`,
    )}")`,
    wood: `repeating-linear-gradient(90deg, rgba(120,80,40,0.35) 0px, rgba(90,55,25,0.35) 8px, rgba(140,95,50,0.35) 16px, rgba(100,65,30,0.35) 24px)`,
  }

  const sizes: Partial<Record<TexturePattern, string>> = {
    dots: patternSize(s, 10),
    grid: `${patternSize(s, 16)} ${patternSize(s, 16)}`,
    granite: `${patternSize(s, 100)} ${patternSize(s, 100)}, cover`,
    marble: `${patternSize(s, 128)} ${patternSize(s, 128)}, cover`,
    carbon: `${patternSize(s, 8)} ${patternSize(s, 8)}, ${patternSize(s, 8)} ${patternSize(s, 8)}`,
    brick: `${patternSize(s, 20)} ${patternSize(s, 20)}, ${patternSize(s, 20)} ${patternSize(s, 20)}, ${patternSize(s, 20)} ${patternSize(s, 20)}, ${patternSize(s, 20)} ${patternSize(s, 20)}`,
    hex: `${patternSize(s, 28)} ${patternSize(s, 49)}`,
    wood: `${patternSize(s, 32)} 100%`,
    noise: `${patternSize(s, 128)} ${patternSize(s, 128)}`,
    lines: 'auto',
  }

  const pattern = texture.pattern as Exclude<TexturePattern, 'none' | 'custom'>
  return {
    image: patterns[pattern],
    size: sizes[pattern] ?? patternSize(s, 32),
    repeat: pattern === 'granite' || pattern === 'marble' ? 'repeat' : 'repeat',
  }
}

export function presetToGradient(preset: GradientPreset): UIGradientProps {
  return {
    color: color3(255, 255, 255),
    transparency: 0,
    rotation: preset.rotation,
    offset: { x: 0, y: 0 },
    colorSequence: preset.colorSequence,
    transparencySequence: [
      { offset: 0, transparency: 0 },
      { offset: 1, transparency: 0 },
    ],
  }
}

export function buildElementVisualStyle(element: UIElement): CSSProperties {
  const shadow = resolveDropShadow(element)
  const glow = resolveGlow(element)
  const border = resolveBorderEffect(element)

  const shadows: string[] = []

  if (shadow.enabled) {
    const alpha = 1 - shadow.transparency
    shadows.push(
      `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${colorToCss(shadow.color, alpha)}`,
    )
  }

  if (glow.enabled) {
    const alpha = 1 - glow.transparency
    const c = colorToCss(glow.color, alpha)
    shadows.push(`0 0 ${glow.size}px ${glow.size / 2}px ${c}`)
    shadows.push(`0 0 ${glow.size * 2}px ${glow.size}px ${colorToCss(glow.color, alpha * 0.5)}`)
  }

  const result: CSSProperties = {}

  if (shadows.length > 0) {
    result.boxShadow = shadows.join(', ')
  }

  if (border.enabled) {
    const alpha = 1 - border.transparency
    result.borderColor = colorToCss(border.color, alpha)
    result.borderWidth = border.width
    result.borderStyle =
      border.style === 'Dashed'
        ? 'dashed'
        : border.style === 'Dotted'
          ? 'dotted'
          : border.style === 'Double'
            ? 'double'
            : 'solid'
  }

  return result
}

export function buildGradientStyle(element: UIElement): CSSProperties | undefined {
  if (!element.uiGradient) return undefined
  const stops = element.uiGradient.colorSequence
    .map((s) => `${colorToCss(s.color)} ${s.offset * 100}%`)
    .join(', ')
  return {
    backgroundImage: `linear-gradient(${element.uiGradient.rotation}deg, ${stops})`,
  }
}

export function getTextureOverlayStyle(element: UIElement): CSSProperties | null {
  const texture = resolveTexture(element)
  const layer = getTextureLayers(texture)
  if (!layer) return null

  return {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: 'inherit',
    backgroundImage: layer.image,
    backgroundSize: layer.size,
    backgroundRepeat: layer.repeat,
    opacity: texture.opacity,
    mixBlendMode: 'overlay',
  }
}

export function mergeBackgrounds(
  base: CSSProperties,
  gradient?: CSSProperties,
): CSSProperties {
  if (!gradient?.backgroundImage) return base

  return {
    ...base,
    backgroundImage: gradient.backgroundImage,
    backgroundSize: 'cover',
  }
}
