export type RobloxClassName =
  | 'ScreenGui'
  | 'Folder'
  | 'Frame'
  | 'TextLabel'
  | 'TextButton'
  | 'ImageLabel'
  | 'ImageButton'
  | 'ScrollingFrame'
  | 'ViewportFrame'
  | 'UIStroke'
  | 'UICorner'
  | 'UIGradient'
  | 'UIAspectRatioConstraint'
  | 'UIPadding'
  | 'UIListLayout'
  | 'UIGridLayout'
  | 'UIPageLayout'

export type AutomaticSize = 'None' | 'X' | 'Y' | 'XY'
export type FillDirection = 'Horizontal' | 'Vertical'
export type HorizontalAlignment = 'Left' | 'Center' | 'Right'
export type VerticalAlignment = 'Top' | 'Center' | 'Bottom'
export type SortOrder = 'Name' | 'Custom' | 'LayoutOrder'
export type DevicePreview = 'phone' | 'tablet' | 'desktop'
export type ExportFormat = 'lua' | 'png' | 'json'

export interface UDim2 {
  xScale: number
  xOffset: number
  yScale: number
  yOffset: number
}

export interface Vector2 {
  x: number
  y: number
}

export interface Color3 {
  r: number
  g: number
  b: number
}

export interface UIStrokeProps {
  color: Color3
  thickness: number
  transparency: number
  applyStrokeMode: 'Contextual' | 'Border'
  lineJoinMode: 'Round' | 'Bevel' | 'Miter'
}

export interface UICornerProps {
  cornerRadius: UDim2
}

export interface UIGradientProps {
  color: Color3
  transparency: number
  rotation: number
  offset: Vector2
  colorSequence: Array<{ offset: number; color: Color3 }>
  transparencySequence: Array<{ offset: number; transparency: number }>
}

export interface UIPaddingProps {
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
}

export interface UIAspectRatioConstraintProps {
  aspectRatio: number
  aspectType: 'FitWithinMaxSize' | 'ScaleWithParentSize'
  dominanceAxis: 'Width' | 'Height'
}

export interface UIListLayoutProps {
  fillDirection: FillDirection
  horizontalAlignment: HorizontalAlignment
  verticalAlignment: VerticalAlignment
  padding: UDim2
  sortOrder: SortOrder
}

export interface UIGridLayoutProps {
  cellSize: UDim2
  cellPadding: UDim2
  fillDirection: FillDirection
  horizontalAlignment: HorizontalAlignment
  verticalAlignment: VerticalAlignment
  sortOrder: SortOrder
  startCorner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight'
}

export interface UIPageLayoutProps {
  fillDirection: FillDirection
  horizontalAlignment: HorizontalAlignment
  verticalAlignment: VerticalAlignment
  padding: UDim2
  sortOrder: SortOrder
  circular: boolean
  gamepadInputEnabled: boolean
  scrollWheelInputEnabled: boolean
  touchInputEnabled: boolean
  tweenTime: number
  easingStyle: string
  easingDirection: string
}

export type TexturePattern =
  | 'none'
  | 'noise'
  | 'dots'
  | 'lines'
  | 'grid'
  | 'granite'
  | 'marble'
  | 'carbon'
  | 'brick'
  | 'hex'
  | 'wood'
  | 'custom'

export type BorderStyleType = 'Solid' | 'Dashed' | 'Dotted' | 'Double'

export interface DropShadowEffect {
  enabled: boolean
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: Color3
  transparency: number
}

export interface GlowEffect {
  enabled: boolean
  color: Color3
  size: number
  transparency: number
}

export interface BorderEffect {
  enabled: boolean
  style: BorderStyleType
  width: number
  color: Color3
  transparency: number
}

export interface TextureEffect {
  enabled: boolean
  pattern: TexturePattern
  imageUrl: string
  scale: number
  opacity: number
  tint: Color3
}

export interface GradientPreset {
  id: string
  name: string
  rotation: number
  colorSequence: Array<{ offset: number; color: Color3 }>
}

export interface UIElement {
  id: string
  className: RobloxClassName
  name: string
  parentId: string | null
  children: string[]
  locked: boolean
  visible: boolean
  collapsed: boolean

  position: UDim2
  size: UDim2
  anchorPoint: Vector2
  rotation: number
  zIndex: number

  backgroundColor3: Color3
  backgroundTransparency: number
  borderColor3: Color3
  borderSizePixel: number
  clipsDescendants: boolean
  layoutOrder: number
  automaticSize: AutomaticSize

  text: string
  textColor3: Color3
  textSize: number
  textScaled: boolean
  textWrapped: boolean
  font: string
  richText: boolean

  image: string
  imageColor3: Color3
  imageTransparency: number

  canvasSize: UDim2
  scrollBarThickness: number

  uiStroke?: UIStrokeProps
  uiCorner?: UICornerProps
  uiGradient?: UIGradientProps
  uiPadding?: UIPaddingProps
  uiAspectRatio?: UIAspectRatioConstraintProps
  uiListLayout?: UIListLayoutProps
  uiGridLayout?: UIGridLayoutProps
  uiPageLayout?: UIPageLayoutProps

  dropShadow?: DropShadowEffect
  glow?: GlowEffect
  borderEffect?: BorderEffect
  texture?: TextureEffect

  /** Editor-only layer group (not exported as Roblox instance) */
  isLayerGroup?: boolean
}

export interface ProjectDocument {
  id: string
  name: string
  description?: string
  elements: Record<string, UIElement>
  rootIds: string[]
  devicePreview: DevicePreview
  version: number
  createdAt: string
  updatedAt: string
}

export interface ProjectMetadata {
  id: string
  name: string
  description?: string
  starred: boolean
  folderId?: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface CanvasViewport {
  zoom: number
  panX: number
  panY: number
}

export interface DevicePreset {
  id: DevicePreview
  label: string
  width: number
  height: number
}

export interface SnapGuide {
  orientation: 'horizontal' | 'vertical'
  position: number
}

export interface ExportManifestEntry {
  name: string
  path: string
  elementId: string
  isFolder: boolean
  children?: ExportManifestEntry[]
}

export const DEVICE_PRESETS: Record<DevicePreview, DevicePreset> = {
  phone: { id: 'phone', label: 'Phone', width: 390, height: 844 },
  tablet: { id: 'tablet', label: 'Tablet', width: 768, height: 1024 },
  desktop: { id: 'desktop', label: 'Desktop', width: 1920, height: 1080 },
}

export const ROBLOX_FONTS = [
  'Legacy',
  'Arial',
  'ArialBold',
  'SourceSans',
  'SourceSansBold',
  'SourceSansSemibold',
  'SourceSansLight',
  'Bodoni',
  'Garamond',
  'Cartoon',
  'Code',
  'Highway',
  'SciFi',
  'Arcade',
  'Fantasy',
  'Antique',
  'Gotham',
  'GothamMedium',
  'GothamBold',
  'GothamBlack',
  'AmaticSC',
  'Bangers',
  'Creepster',
  'DenkOne',
  'Fondamento',
  'FredokaOne',
  'GrenzeGotisch',
  'IndieFlower',
  'JosefinSans',
  'Jura',
  'Kalam',
  'LuckiestGuy',
  'Merriweather',
  'Michroma',
  'Nunito',
  'Oswald',
  'PatrickHand',
  'PermanentMarker',
  'Roboto',
  'RobotoCondensed',
  'RobotoMono',
  'Sarpanch',
  'SpecialElite',
  'TitilliumWeb',
  'Ubuntu',
] as const

export const CREATABLE_OBJECTS: Array<{
  className: RobloxClassName
  label: string
  category: 'container' | 'display' | 'input' | 'layout' | 'modifier'
}> = [
  { className: 'ScreenGui', label: 'ScreenGui', category: 'container' },
  { className: 'Folder', label: 'Folder', category: 'container' },
  { className: 'Frame', label: 'Frame', category: 'container' },
  { className: 'ScrollingFrame', label: 'ScrollingFrame', category: 'container' },
  { className: 'ViewportFrame', label: 'ViewportFrame', category: 'container' },
  { className: 'TextLabel', label: 'TextLabel', category: 'display' },
  { className: 'TextButton', label: 'TextButton', category: 'input' },
  { className: 'ImageLabel', label: 'ImageLabel', category: 'display' },
  { className: 'ImageButton', label: 'ImageButton', category: 'input' },
  { className: 'UIStroke', label: 'UIStroke', category: 'modifier' },
  { className: 'UICorner', label: 'UICorner', category: 'modifier' },
  { className: 'UIGradient', label: 'UIGradient', category: 'modifier' },
  { className: 'UIAspectRatioConstraint', label: 'UIAspectRatioConstraint', category: 'modifier' },
  { className: 'UIPadding', label: 'UIPadding', category: 'modifier' },
  { className: 'UIListLayout', label: 'UIListLayout', category: 'layout' },
  { className: 'UIGridLayout', label: 'UIGridLayout', category: 'layout' },
  { className: 'UIPageLayout', label: 'UIPageLayout', category: 'layout' },
]
