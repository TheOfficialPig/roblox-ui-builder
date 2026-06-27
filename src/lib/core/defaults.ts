import { v4 as uuidv4 } from 'uuid'
import type { RobloxClassName, UIElement } from './types'
import { color3, udim, udim2Offset } from './utils'

const DEFAULTS: Omit<UIElement, 'id' | 'className' | 'name' | 'parentId' | 'children'> = {
  locked: false,
  visible: true,
  collapsed: false,
  position: udim2Offset(0, 0),
  size: udim2Offset(200, 100),
  anchorPoint: { x: 0, y: 0 },
  rotation: 0,
  zIndex: 1,
  backgroundColor3: color3(30, 30, 30),
  backgroundTransparency: 0,
  borderColor3: color3(0, 0, 0),
  borderSizePixel: 0,
  clipsDescendants: false,
  layoutOrder: 0,
  automaticSize: 'None',
  text: 'Label',
  textColor3: color3(255, 255, 255),
  textSize: 14,
  textScaled: false,
  textWrapped: false,
  font: 'Gotham',
  richText: false,
  image: '',
  imageColor3: color3(255, 255, 255),
  imageTransparency: 0,
  canvasSize: udim2Offset(400, 400),
  scrollBarThickness: 12,
  dropShadow: {
    enabled: false,
    offsetX: 0,
    offsetY: 6,
    blur: 16,
    spread: 0,
    color: color3(0, 0, 0),
    transparency: 0.55,
  },
  glow: {
    enabled: false,
    color: color3(0, 170, 255),
    size: 20,
    transparency: 0.35,
  },
  borderEffect: {
    enabled: false,
    style: 'Solid',
    width: 2,
    color: color3(255, 255, 255),
    transparency: 0,
  },
  texture: {
    enabled: false,
    pattern: 'none',
    imageUrl: '',
    scale: 1,
    opacity: 0.45,
    tint: color3(255, 255, 255),
  },
}

const CLASS_OVERRIDES: Partial<Record<RobloxClassName, Partial<UIElement>>> = {
  ScreenGui: {
    size: udim(1, 0, 1, 0),
    position: udim2Offset(0, 0),
    backgroundTransparency: 1,
    zIndex: 0,
  },
  Folder: {
    backgroundTransparency: 1,
  },
  Frame: {
    backgroundColor3: color3(40, 40, 40),
  },
  TextLabel: {
    text: 'TextLabel',
    backgroundTransparency: 1,
    size: udim2Offset(160, 40),
  },
  TextButton: {
    text: 'Button',
    backgroundColor3: color3(0, 120, 215),
    size: udim2Offset(160, 44),
  },
  ImageLabel: {
    text: '',
    backgroundTransparency: 1,
    size: udim2Offset(100, 100),
    image: 'rbxassetid://0',
  },
  ImageButton: {
    text: '',
    backgroundColor3: color3(50, 50, 50),
    size: udim2Offset(100, 100),
    image: 'rbxassetid://0',
  },
  ScrollingFrame: {
    backgroundColor3: color3(25, 25, 25),
    size: udim2Offset(300, 200),
    clipsDescendants: true,
    canvasSize: udim2Offset(300, 400),
  },
  ViewportFrame: {
    backgroundColor3: color3(20, 20, 20),
    size: udim2Offset(200, 200),
  },
  UIStroke: {
    backgroundTransparency: 1,
    uiStroke: {
      color: color3(255, 255, 255),
      thickness: 1,
      transparency: 0,
      applyStrokeMode: 'Contextual',
      lineJoinMode: 'Round',
    },
  },
  UICorner: {
    backgroundTransparency: 1,
    uiCorner: { cornerRadius: udim(0, 8, 0, 8) },
  },
  UIGradient: {
    backgroundTransparency: 1,
    uiGradient: {
      color: color3(255, 255, 255),
      transparency: 0,
      rotation: 0,
      offset: { x: 0, y: 0 },
      colorSequence: [
        { offset: 0, color: color3(0, 120, 215) },
        { offset: 1, color: color3(0, 60, 130) },
      ],
      transparencySequence: [
        { offset: 0, transparency: 0 },
        { offset: 1, transparency: 0 },
      ],
    },
  },
  UIPadding: {
    backgroundTransparency: 1,
    uiPadding: { paddingTop: 8, paddingBottom: 8, paddingLeft: 8, paddingRight: 8 },
  },
  UIAspectRatioConstraint: {
    backgroundTransparency: 1,
    uiAspectRatio: { aspectRatio: 1, aspectType: 'FitWithinMaxSize', dominanceAxis: 'Width' },
  },
  UIListLayout: {
    backgroundTransparency: 1,
    uiListLayout: {
      fillDirection: 'Vertical',
      horizontalAlignment: 'Center',
      verticalAlignment: 'Top',
      padding: udim2Offset(0, 4),
      sortOrder: 'LayoutOrder',
    },
  },
  UIGridLayout: {
    backgroundTransparency: 1,
    uiGridLayout: {
      cellSize: udim2Offset(80, 80),
      cellPadding: udim2Offset(4, 4),
      fillDirection: 'Horizontal',
      horizontalAlignment: 'Left',
      verticalAlignment: 'Top',
      sortOrder: 'LayoutOrder',
      startCorner: 'TopLeft',
    },
  },
  UIPageLayout: {
    backgroundTransparency: 1,
    uiPageLayout: {
      fillDirection: 'Horizontal',
      horizontalAlignment: 'Center',
      verticalAlignment: 'Center',
      padding: udim2Offset(0, 0),
      sortOrder: 'LayoutOrder',
      circular: false,
      gamepadInputEnabled: true,
      scrollWheelInputEnabled: true,
      touchInputEnabled: true,
      tweenTime: 0.3,
      easingStyle: 'Quad',
      easingDirection: 'Out',
    },
  },
}

let nameCounter: Record<string, number> = {}

export function resetNameCounter(): void {
  nameCounter = {}
}

export function createElement(
  className: RobloxClassName,
  overrides?: Partial<UIElement>,
): UIElement {
  const baseName = className
  nameCounter[baseName] = (nameCounter[baseName] ?? 0) + 1
  const suffix = nameCounter[baseName] > 1 ? nameCounter[baseName] : ''

  const { id: _ignoredId, children: _ignoredChildren, ...restOverrides } = overrides ?? {}

  return {
    id: uuidv4(),
    className,
    name: `${baseName}${suffix}`,
    parentId: null,
    children: [],
    ...DEFAULTS,
    ...CLASS_OVERRIDES[className],
    ...restOverrides,
  }
}

export function createEmptyProject(name = 'Untitled Project') {
  const screenGui = createElement('ScreenGui', { name: 'ScreenGui' })
  return {
    id: uuidv4(),
    name,
    elements: { [screenGui.id]: screenGui },
    rootIds: [screenGui.id],
    devicePreview: 'desktop' as const,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
