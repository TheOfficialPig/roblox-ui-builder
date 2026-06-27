import type { ProjectDocument, UIAnimation, UIElement } from '../core/types'
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
    lines.push(`${pad}${varName}.TextXAlignment = Enum.TextXAlignment.${element.textXAlignment ?? 'Center'},`)
    lines.push(`${pad}${varName}.TextYAlignment = Enum.TextYAlignment.${element.textYAlignment ?? 'Center'},`)
    lines.push(`${pad}${varName}.Font = Enum.Font.${element.font},`)
    lines.push(`${pad}${varName}.RichText = ${element.richText},`)
  }

  if (element.className === 'TextButton') {
    lines.push(`${pad}${varName}.AutoButtonColor = ${element.autoButtonColor ?? true},`)
  }

  if (['ImageLabel', 'ImageButton'].includes(element.className)) {
    if (element.image) lines.push(`${pad}${varName}.Image = "${element.image}",`)
    lines.push(formatColor3(`${varName}.ImageColor3`, element.imageColor3, level))
    lines.push(`${pad}${varName}.ImageTransparency = ${element.imageTransparency},`)
    lines.push(`${pad}${varName}.ScaleType = Enum.ScaleType.${element.scaleType ?? 'Stretch'},`)
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

function generateModifierCode(element: UIElement, varName: string, level: number): string[] {
  const lines: string[] = []
  const pad = indent(level)

  lines.push(`${pad}local ${varName} = Instance.new("${element.className}")`)
  lines.push(`${pad}${varName}.Name = "${element.name.replace(/"/g, '\\"')}"`)

  if (element.className === 'UICorner' && element.uiCorner) {
    lines.push(formatUDim2(`${varName}.CornerRadius`, element.uiCorner.cornerRadius, level))
  }

  if (element.className === 'UIStroke' && element.uiStroke) {
    lines.push(formatColor3(`${varName}.Color`, element.uiStroke.color, level))
    lines.push(`${pad}${varName}.Thickness = ${element.uiStroke.thickness},`)
    lines.push(`${pad}${varName}.Transparency = ${element.uiStroke.transparency},`)
    lines.push(`${pad}${varName}.ApplyStrokeMode = Enum.ApplyStrokeMode.${element.uiStroke.applyStrokeMode},`)
    lines.push(`${pad}${varName}.LineJoinMode = Enum.LineJoinMode.${element.uiStroke.lineJoinMode},`)
  }

  if (element.className === 'UIGradient' && element.uiGradient) {
    const g = element.uiGradient
    lines.push(`${pad}${varName}.Rotation = ${g.rotation},`)
    lines.push(formatVector2(`${varName}.Offset`, g.offset, level))
    const colorKeypoints = g.colorSequence
      .map((k) => `ColorSequenceKeypoint.new(${k.offset}, Color3.fromRGB(${k.color.r}, ${k.color.g}, ${k.color.b}))`)
      .join(', ')
    lines.push(`${pad}${varName}.Color = ColorSequence.new({${colorKeypoints}}),`)
    const transKeypoints = g.transparencySequence
      .map((k) => `NumberSequenceKeypoint.new(${k.offset}, ${k.transparency})`)
      .join(', ')
    lines.push(`${pad}${varName}.Transparency = NumberSequence.new({${transKeypoints}}),`)
  }

  if (element.className === 'UIPadding' && element.uiPadding) {
    const p = element.uiPadding
    lines.push(`${pad}${varName}.PaddingTop = UDim.new(0, ${p.paddingTop}),`)
    lines.push(`${pad}${varName}.PaddingBottom = UDim.new(0, ${p.paddingBottom}),`)
    lines.push(`${pad}${varName}.PaddingLeft = UDim.new(0, ${p.paddingLeft}),`)
    lines.push(`${pad}${varName}.PaddingRight = UDim.new(0, ${p.paddingRight}),`)
  }

  if (element.className === 'UIAspectRatioConstraint' && element.uiAspectRatio) {
    lines.push(`${pad}${varName}.AspectRatio = ${element.uiAspectRatio.aspectRatio},`)
    lines.push(`${pad}${varName}.AspectType = Enum.AspectType.${element.uiAspectRatio.aspectType},`)
    lines.push(`${pad}${varName}.DominantAxis = Enum.DominantAxis.${element.uiAspectRatio.dominanceAxis},`)
  }

  if (element.className === 'UIScale' && element.uiScale) {
    lines.push(`${pad}${varName}.Scale = ${element.uiScale.scale},`)
  }

  return lines
}

function generateLayoutCode(element: UIElement, varName: string, level: number): string[] {
  const lines: string[] = []
  const pad = indent(level)

  lines.push(`${pad}local ${varName} = Instance.new("${element.className}")`)
  lines.push(`${pad}${varName}.Name = "${element.name.replace(/"/g, '\\"')}"`)

  if (element.uiListLayout) {
    const l = element.uiListLayout
    lines.push(`${pad}${varName}.FillDirection = Enum.FillDirection.${l.fillDirection},`)
    lines.push(`${pad}${varName}.HorizontalAlignment = Enum.HorizontalAlignment.${l.horizontalAlignment},`)
    lines.push(`${pad}${varName}.VerticalAlignment = Enum.VerticalAlignment.${l.verticalAlignment},`)
    lines.push(formatUDim2(`${varName}.Padding`, l.padding, level))
    lines.push(`${pad}${varName}.SortOrder = Enum.SortOrder.${l.sortOrder},`)
  }

  if (element.uiGridLayout) {
    const g = element.uiGridLayout
    lines.push(formatUDim2(`${varName}.CellSize`, g.cellSize, level))
    lines.push(formatUDim2(`${varName}.CellPadding`, g.cellPadding, level))
    lines.push(`${pad}${varName}.FillDirection = Enum.FillDirection.${g.fillDirection},`)
    lines.push(`${pad}${varName}.HorizontalAlignment = Enum.HorizontalAlignment.${g.horizontalAlignment},`)
    lines.push(`${pad}${varName}.VerticalAlignment = Enum.VerticalAlignment.${g.verticalAlignment},`)
    lines.push(`${pad}${varName}.SortOrder = Enum.SortOrder.${g.sortOrder},`)
    lines.push(`${pad}${varName}.StartCorner = Enum.StartCorner.${g.startCorner},`)
  }

  if (element.uiPageLayout) {
    const p = element.uiPageLayout
    lines.push(`${pad}${varName}.FillDirection = Enum.FillDirection.${p.fillDirection},`)
    lines.push(`${pad}${varName}.HorizontalAlignment = Enum.HorizontalAlignment.${p.horizontalAlignment},`)
    lines.push(`${pad}${varName}.VerticalAlignment = Enum.VerticalAlignment.${p.verticalAlignment},`)
    lines.push(`${pad}${varName}.SortOrder = Enum.SortOrder.${p.sortOrder},`)
    lines.push(`${pad}${varName}.GamepadInputEnabled = ${p.gamepadInputEnabled},`)
    lines.push(`${pad}${varName}.ScrollWheelInputEnabled = ${p.scrollWheelInputEnabled},`)
    lines.push(`${pad}${varName}.TouchInputEnabled = ${p.touchInputEnabled},`)
    lines.push(`${pad}${varName}.Circular = ${p.circular},`)
    lines.push(`${pad}${varName}.EasingDirection = Enum.EasingDirection.${p.easingDirection},`)
    lines.push(`${pad}${varName}.EasingStyle = Enum.EasingStyle.${p.easingStyle},`)
    lines.push(formatUDim2(`${varName}.Padding`, p.padding, level))
    lines.push(`${pad}${varName}.TweenTime = ${p.tweenTime},`)
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

  if (element.className === 'Folder') {
    for (const childId of element.children) {
      walkTree(childId, elements, level, parentVar, lines, varCounter)
    }
    return
  }

  if (isModifierObject(element.className)) {
    varCounter.count++
    const varName = `mod_${varCounter.count}`
    lines.push('')
    lines.push(`${indent(level)}-- ${element.className}: ${element.name}`)
    lines.push(...generateModifierCode(element, varName, level))
    lines.push(`${pad(level)}${varName}.Parent = ${parentVar}`)
    return
  }

  if (isLayoutObject(element.className)) {
    varCounter.count++
    const varName = `layout_${varCounter.count}`
    lines.push('')
    lines.push(`${indent(level)}-- ${element.className}: ${element.name}`)
    lines.push(...generateLayoutCode(element, varName, level))
    lines.push(`${pad(level)}${varName}.Parent = ${parentVar}`)
    for (const childId of element.children) {
      walkTree(childId, elements, level, parentVar, lines, varCounter)
    }
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

function generateAnimationCode(
  animations: UIAnimation[],
  elements: Record<string, UIElement>,
  level: number,
): string[] {
  const lines: string[] = []
  const pad = indent(level)

  for (const anim of animations.filter((a) => a.enabled)) {
    const el = elements[anim.elementId]
    if (!el) continue
    const varName = el.name.replace(/[^a-zA-Z0-9_]/g, '_')

    lines.push(`${pad}-- Animation: ${anim.name}`)
    lines.push(`${pad}task.delay(${anim.delay}, function()`)
    lines.push(`${indent(level + 1)}local target = playerGui:FindFirstChild("${el.name.replace(/"/g, '\\"')}", true)`)
    lines.push(`${indent(level + 1)}if not target then return end`)
    lines.push(`${indent(level + 1)}local tweenInfo = TweenInfo.new(${anim.duration}, Enum.EasingStyle.${anim.easingStyle}, Enum.EasingDirection.${anim.easingDirection}${anim.loop ? ', -1' : ''})`)

    if (anim.property === 'BackgroundTransparency') {
      lines.push(`${indent(level + 1)}local tween = TweenService:Create(target, tweenInfo, { BackgroundTransparency = ${anim.targetTransparency ?? 0} })`)
    } else if (anim.property === 'Rotation') {
      lines.push(`${indent(level + 1)}local tween = TweenService:Create(target, tweenInfo, { Rotation = ${anim.targetRotation ?? 0} })`)
    } else if (anim.property === 'Position' && anim.targetPosition) {
      const p = anim.targetPosition
      lines.push(`${indent(level + 1)}local tween = TweenService:Create(target, tweenInfo, { Position = UDim2.new(${p.xScale}, ${p.xOffset}, ${p.yScale}, ${p.yOffset}) })`)
    } else if (anim.property === 'Size' && anim.targetSize) {
      const s = anim.targetSize
      lines.push(`${indent(level + 1)}local tween = TweenService:Create(target, tweenInfo, { Size = UDim2.new(${s.xScale}, ${s.xOffset}, ${s.yScale}, ${s.yOffset}) })`)
    } else {
      lines.push(`${indent(level + 1)}return`)
    }

    lines.push(`${indent(level + 1)}tween:Play()`)
    lines.push(`${pad}end)`)
    lines.push('')
  }

  return lines
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

  if (project.animations?.length) {
    lines.push('')
    lines.push(`${indent(1)}-- Animations`)
    lines.push(`${indent(1)}local TweenService = game:GetService("TweenService")`)
    lines.push(...generateAnimationCode(project.animations, project.elements, 1))
  }

  lines.push('')
  lines.push(`${indent(1)}return playerGui`)
  lines.push('end')
  lines.push('')
  lines.push('return createUI')

  return lines.join('\n')
}
