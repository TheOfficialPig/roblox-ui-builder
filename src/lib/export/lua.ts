import type { ProjectDocument, UIElement } from '../core/types'
import { isGuiObject, isLayoutObject, isModifierObject } from '../core/utils'
import {
  resolveBorderEffect,
  resolveDropShadow,
  resolveGlow,
  resolveTexture,
} from '../core/effects'

function indent(level: number): string {
  return '  '.repeat(level)
}

function formatUDim2(prop: string, value: { xScale: number; xOffset: number; yScale: number; yOffset: number }, level: number): string {
  const pad = indent(level)
  if (value.xScale === 0 && value.yScale === 0) {
    return `${pad}${prop} = UDim2.fromOffset(${value.xOffset}, ${value.yOffset}),`
  }
  if (value.xOffset === 0 && value.yOffset === 0) {
    return `${pad}${prop} = UDim2.fromScale(${value.xScale}, ${value.yScale}),`
  }
  return `${pad}${prop} = UDim2.new(${value.xScale}, ${value.xOffset}, ${value.yScale}, ${value.yOffset}),`
}

function formatColor3(prop: string, color: { r: number; g: number; b: number }, level: number): string {
  const r = (color.r / 255).toFixed(4)
  const g = (color.g / 255).toFixed(4)
  const b = (color.b / 255).toFixed(4)
  return `${indent(level)}${prop} = Color3.fromRGB(${color.r}, ${color.g}, ${color.b}), -- (${r}, ${g}, ${b})`
}

function formatVector2(prop: string, vec: { x: number; y: number }, level: number): string {
  return `${indent(level)}${prop} = Vector2.new(${vec.x}, ${vec.y}),`
}

function generateInstanceCode(element: UIElement, varName: string, level: number): string[] {
  const lines: string[] = []
  const pad = indent(level)

  lines.push(`${pad}local ${varName} = Instance.new("${element.className}")`)
  lines.push(`${pad}${varName}.Name = "${element.name.replace(/"/g, '\\"')}"`)

  if (element.className === 'ScreenGui') {
    lines.push(`${pad}${varName}.ResetOnSpawn = false`)
    lines.push(`${pad}${varName}.ZIndexBehavior = Enum.ZIndexBehavior.Sibling`)
  }

  if (isGuiObject(element) || element.className === 'ScreenGui') {
    lines.push(formatUDim2(`${varName}.Position`, element.position, level))
    lines.push(formatUDim2(`${varName}.Size`, element.size, level))
    lines.push(formatVector2(`${varName}.AnchorPoint`, element.anchorPoint, level))
    lines.push(`${pad}${varName}.Rotation = ${element.rotation},`)
    lines.push(`${pad}${varName}.ZIndex = ${element.zIndex},`)
    lines.push(`${pad}${varName}.Visible = ${element.visible},`)
    lines.push(formatColor3(`${varName}.BackgroundColor3`, element.backgroundColor3, level))
    lines.push(`${pad}${varName}.BackgroundTransparency = ${element.backgroundTransparency},`)
    lines.push(formatColor3(`${varName}.BorderColor3`, element.borderColor3, level))
    lines.push(`${pad}${varName}.BorderSizePixel = ${element.borderSizePixel},`)
    lines.push(`${pad}${varName}.ClipsDescendants = ${element.clipsDescendants},`)
    lines.push(`${pad}${varName}.LayoutOrder = ${element.layoutOrder},`)
    lines.push(`${pad}${varName}.AutomaticSize = Enum.AutomaticSize.${element.automaticSize},`)
  }

  if (['TextLabel', 'TextButton'].includes(element.className)) {
    lines.push(`${pad}${varName}.Text = "${element.text.replace(/"/g, '\\"')}",`)
    lines.push(formatColor3(`${varName}.TextColor3`, element.textColor3, level))
    lines.push(`${pad}${varName}.TextSize = ${element.textSize},`)
    lines.push(`${pad}${varName}.TextScaled = ${element.textScaled},`)
    lines.push(`${pad}${varName}.TextWrapped = ${element.textWrapped},`)
    lines.push(`${pad}${varName}.Font = Enum.Font.${element.font},`)
    lines.push(`${pad}${varName}.RichText = ${element.richText},`)
  }

  if (['ImageLabel', 'ImageButton'].includes(element.className)) {
    if (element.image) lines.push(`${pad}${varName}.Image = "${element.image}",`)
    lines.push(formatColor3(`${varName}.ImageColor3`, element.imageColor3, level))
    lines.push(`${pad}${varName}.ImageTransparency = ${element.imageTransparency},`)
  }

  if (element.className === 'ScrollingFrame') {
    lines.push(formatUDim2(`${varName}.CanvasSize`, element.canvasSize, level))
    lines.push(`${pad}${varName}.ScrollBarThickness = ${element.scrollBarThickness},`)
  }

  if (element.uiStroke) {
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local stroke = Instance.new("UIStroke")`)
    lines.push(formatColor3('stroke.Color', element.uiStroke.color, level + 1))
    lines.push(`${indent(level + 1)}stroke.Thickness = ${element.uiStroke.thickness},`)
    lines.push(`${indent(level + 1)}stroke.Transparency = ${element.uiStroke.transparency},`)
    lines.push(`${indent(level + 1)}stroke.ApplyStrokeMode = Enum.ApplyStrokeMode.${element.uiStroke.applyStrokeMode},`)
    lines.push(`${indent(level + 1)}stroke.LineJoinMode = Enum.LineJoinMode.${element.uiStroke.lineJoinMode},`)
    lines.push(`${indent(level + 1)}stroke.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  if (element.uiCorner) {
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local corner = Instance.new("UICorner")`)
    lines.push(formatUDim2('corner.CornerRadius', element.uiCorner.cornerRadius, level + 1))
    lines.push(`${indent(level + 1)}corner.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  if (element.uiGradient) {
    const g = element.uiGradient
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local gradient = Instance.new("UIGradient")`)
    lines.push(`${indent(level + 1)}gradient.Rotation = ${g.rotation},`)
    lines.push(formatVector2('gradient.Offset', g.offset, level + 1))
    const colorKeypoints = g.colorSequence
      .map((k) => `ColorSequenceKeypoint.new(${k.offset}, Color3.fromRGB(${k.color.r}, ${k.color.g}, ${k.color.b}))`)
      .join(', ')
    lines.push(`${indent(level + 1)}gradient.Color = ColorSequence.new({${colorKeypoints}}),`)
    const transKeypoints = g.transparencySequence
      .map((k) => `NumberSequenceKeypoint.new(${k.offset}, ${k.transparency})`)
      .join(', ')
    lines.push(`${indent(level + 1)}gradient.Transparency = NumberSequence.new({${transKeypoints}}),`)
    lines.push(`${indent(level + 1)}gradient.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  if (element.uiPadding) {
    const p = element.uiPadding
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local padding = Instance.new("UIPadding")`)
    lines.push(`${indent(level + 1)}padding.PaddingTop = UDim.new(0, ${p.paddingTop}),`)
    lines.push(`${indent(level + 1)}padding.PaddingBottom = UDim.new(0, ${p.paddingBottom}),`)
    lines.push(`${indent(level + 1)}padding.PaddingLeft = UDim.new(0, ${p.paddingLeft}),`)
    lines.push(`${indent(level + 1)}padding.PaddingRight = UDim.new(0, ${p.paddingRight}),`)
    lines.push(`${indent(level + 1)}padding.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  if (element.uiAspectRatio) {
    const a = element.uiAspectRatio
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local aspect = Instance.new("UIAspectRatioConstraint")`)
    lines.push(`${indent(level + 1)}aspect.AspectRatio = ${a.aspectRatio},`)
    lines.push(`${indent(level + 1)}aspect.AspectType = Enum.AspectType.${a.aspectType},`)
    lines.push(`${indent(level + 1)}aspect.DominanceAxis = Enum.DominanceAxis.${a.dominanceAxis},`)
    lines.push(`${indent(level + 1)}aspect.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  if (element.uiListLayout) {
    const l = element.uiListLayout
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local layout = Instance.new("UIListLayout")`)
    lines.push(`${indent(level + 1)}layout.FillDirection = Enum.FillDirection.${l.fillDirection},`)
    lines.push(`${indent(level + 1)}layout.HorizontalAlignment = Enum.HorizontalAlignment.${l.horizontalAlignment},`)
    lines.push(`${indent(level + 1)}layout.VerticalAlignment = Enum.VerticalAlignment.${l.verticalAlignment},`)
    lines.push(formatUDim2('layout.Padding', l.padding, level + 1).replace('Position', 'Padding'))
    lines.push(`${indent(level + 1)}layout.SortOrder = Enum.SortOrder.${l.sortOrder},`)
    lines.push(`${indent(level + 1)}layout.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  if (element.uiGridLayout) {
    const g = element.uiGridLayout
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local layout = Instance.new("UIGridLayout")`)
    lines.push(formatUDim2('layout.CellSize', g.cellSize, level + 1))
    lines.push(formatUDim2('layout.CellPadding', g.cellPadding, level + 1))
    lines.push(`${indent(level + 1)}layout.FillDirection = Enum.FillDirection.${g.fillDirection},`)
    lines.push(`${indent(level + 1)}layout.HorizontalAlignment = Enum.HorizontalAlignment.${g.horizontalAlignment},`)
    lines.push(`${indent(level + 1)}layout.VerticalAlignment = Enum.VerticalAlignment.${g.verticalAlignment},`)
    lines.push(`${indent(level + 1)}layout.SortOrder = Enum.SortOrder.${g.sortOrder},`)
    lines.push(`${indent(level + 1)}layout.StartCorner = Enum.StartCorner.${g.startCorner},`)
    lines.push(`${indent(level + 1)}layout.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  return lines
}

function generateEffectLines(element: UIElement, varName: string, level: number): string[] {
  const lines: string[] = []
  const pad = indent(level)
  const shadow = resolveDropShadow(element)
  const glow = resolveGlow(element)
  const border = resolveBorderEffect(element)
  const texture = resolveTexture(element)

  if (shadow.enabled) {
    lines.push(`${pad}-- Drop shadow`)
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local shadow = Instance.new("Frame")`)
    lines.push(`${indent(level + 1)}shadow.Name = "${element.name}_Shadow"`)
    lines.push(formatUDim2('shadow.Size', element.size, level + 1))
    lines.push(`${indent(level + 1)}shadow.Position = UDim2.new(${element.position.xScale}, ${element.position.xOffset + shadow.offsetX}, ${element.position.yScale}, ${element.position.yOffset + shadow.offsetY}),`)
    lines.push(formatVector2('shadow.AnchorPoint', element.anchorPoint, level + 1))
    lines.push(formatColor3('shadow.BackgroundColor3', shadow.color, level + 1))
    lines.push(`${indent(level + 1)}shadow.BackgroundTransparency = ${shadow.transparency},`)
    lines.push(`${indent(level + 1)}shadow.BorderSizePixel = 0`)
    lines.push(`${indent(level + 1)}shadow.ZIndex = ${Math.max(0, element.zIndex - 1)},`)
    if (element.uiCorner) {
      lines.push(`${indent(level + 1)}local shadowCorner = Instance.new("UICorner")`)
      lines.push(formatUDim2('shadowCorner.CornerRadius', element.uiCorner.cornerRadius, level + 1))
      lines.push(`${indent(level + 1)}shadowCorner.Parent = shadow`)
    }
    lines.push(`${indent(level + 1)}shadow.Parent = ${varName}.Parent`)
    lines.push(`${pad}end`)
  }

  if (glow.enabled) {
    lines.push(`${pad}-- Glow effect`)
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local glow = Instance.new("UIStroke")`)
    lines.push(formatColor3('glow.Color', glow.color, level + 1))
    lines.push(`${indent(level + 1)}glow.Thickness = ${Math.max(2, Math.round(glow.size / 2))},`)
    lines.push(`${indent(level + 1)}glow.Transparency = ${glow.transparency},`)
    lines.push(`${indent(level + 1)}glow.ApplyStrokeMode = Enum.ApplyStrokeMode.Border`)
    lines.push(`${indent(level + 1)}glow.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  if (border.enabled) {
    lines.push(`${pad}-- Custom border`)
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local border = Instance.new("UIStroke")`)
    lines.push(formatColor3('border.Color', border.color, level + 1))
    lines.push(`${indent(level + 1)}border.Thickness = ${border.width},`)
    lines.push(`${indent(level + 1)}border.Transparency = ${border.transparency},`)
    lines.push(`${indent(level + 1)}border.ApplyStrokeMode = Enum.ApplyStrokeMode.Border`)
    lines.push(`${indent(level + 1)}border.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  if (texture.enabled && texture.pattern !== 'none') {
    lines.push(`${pad}-- Texture overlay`)
    lines.push(`${pad}do`)
    lines.push(`${indent(level + 1)}local texture = Instance.new("ImageLabel")`)
    lines.push(`${indent(level + 1)}texture.Name = "${element.name}_Texture"`)
    lines.push(`${indent(level + 1)}texture.Size = UDim2.fromScale(1, 1),`)
    lines.push(`${indent(level + 1)}texture.BackgroundTransparency = 1,`)
    lines.push(`${indent(level + 1)}texture.ImageTransparency = ${1 - texture.opacity},`)
    lines.push(formatColor3('texture.ImageColor3', texture.tint, level + 1))
    if (texture.pattern === 'custom' && texture.imageUrl) {
      lines.push(`${indent(level + 1)}texture.Image = "${texture.imageUrl}",`)
    } else {
      lines.push(`${indent(level + 1)}-- Pattern: ${texture.pattern} (assign a rbxassetid texture in Studio)`)
      lines.push(`${indent(level + 1)}texture.Image = "rbxassetid://0",`)
    }
    lines.push(`${indent(level + 1)}texture.ScaleType = Enum.ScaleType.Tile,`)
    lines.push(`${indent(level + 1)}texture.TileSize = UDim2.fromOffset(${Math.round(64 * texture.scale)}, ${Math.round(64 * texture.scale)}),`)
    lines.push(`${indent(level + 1)}texture.ZIndex = ${element.zIndex + 1},`)
    lines.push(`${indent(level + 1)}texture.Parent = ${varName}`)
    lines.push(`${pad}end`)
  }

  return lines
}

function walkTree(
  elementId: string,
  elements: Record<string, UIElement>,
  level: number,
  parentVar: string,
  lines: string[],
  varCounter: { count: number },
): void {
  const element = elements[elementId]
  if (!element || element.isLayerGroup) return

  if (isLayoutObject(element.className) || isModifierObject(element.className)) {
    return
  }

  varCounter.count++
  const varName = `obj_${varCounter.count}`
  lines.push('')
  lines.push(`${indent(level)}-- ${element.className}: ${element.name}`)
  lines.push(...generateInstanceCode(element, varName, level))
  lines.push(`${pad(level)}${varName}.Parent = ${parentVar}`)
  lines.push(...generateEffectLines(element, varName, level))

  for (const childId of element.children) {
    walkTree(childId, elements, level, varName, lines, varCounter)
  }
}

function pad(level: number): string {
  return indent(level)
}

export function exportToLua(project: ProjectDocument): string {
  const lines: string[] = [
    '--[[',
    `  Generated by Roblox UI Builder`,
    `  Project: ${project.name}`,
    `  Generated: ${new Date().toISOString()}`,
    ']]',
    '',
    'local Players = game:GetService("Players")',
    '',
    'local function createUI()',
    `${indent(1)}local player = Players.LocalPlayer`,
    `${indent(1)}local playerGui = player:WaitForChild("PlayerGui")`,
    '',
  ]

  const varCounter = { count: 0 }

  for (const rootId of project.rootIds) {
    walkTree(rootId, project.elements, 1, 'playerGui', lines, varCounter)
  }

  lines.push('')
  lines.push(`${indent(1)}return playerGui`)
  lines.push('end')
  lines.push('')
  lines.push('return createUI')

  return lines.join('\n')
}
