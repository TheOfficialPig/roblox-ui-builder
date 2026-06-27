import type { RobloxClassName } from './types'

export type PropertyKey =
  | 'name'
  | 'locked'
  | 'visible'
  | 'position'
  | 'size'
  | 'anchorPoint'
  | 'rotation'
  | 'zIndex'
  | 'layoutOrder'
  | 'automaticSize'
  | 'backgroundColor3'
  | 'backgroundTransparency'
  | 'borderColor3'
  | 'borderSizePixel'
  | 'clipsDescendants'
  | 'text'
  | 'textColor3'
  | 'textSize'
  | 'textScaled'
  | 'textWrapped'
  | 'font'
  | 'richText'
  | 'image'
  | 'imageColor3'
  | 'imageTransparency'
  | 'canvasSize'
  | 'scrollBarThickness'
  | 'uiStrokeColor'
  | 'uiStrokeThickness'
  | 'uiStrokeTransparency'
  | 'uiCornerRadius'
  | 'uiGradientRotation'
  | 'uiPaddingTop'
  | 'uiPaddingBottom'
  | 'uiPaddingLeft'
  | 'uiPaddingRight'
  | 'uiAspectRatio'
  | 'uiAspectType'
  | 'uiListFillDirection'
  | 'uiListHorizontalAlignment'
  | 'uiListVerticalAlignment'
  | 'uiListPadding'
  | 'uiListSortOrder'
  | 'uiGridCellSize'
  | 'uiGridCellPadding'
  | 'uiGridFillDirection'
  | 'uiGridHorizontalAlignment'
  | 'uiGridVerticalAlignment'
  | 'uiGridSortOrder'
  | 'uiGridStartCorner'
  | 'uiPageFillDirection'
  | 'uiPagePadding'
  | 'uiPageCircular'
  | 'uiPageTweenTime'
  | 'attachedCorner'
  | 'attachedStroke'
  | 'effects'

export interface PropertySection {
  id: string
  title: string
  defaultOpen?: boolean
  properties: PropertyKey[]
}

export const PROPERTY_LABELS: Record<PropertyKey, string> = {
  name: 'Name',
  locked: 'Locked',
  visible: 'Visible',
  position: 'Position',
  size: 'Size',
  anchorPoint: 'Anchor Point',
  rotation: 'Rotation',
  zIndex: 'ZIndex',
  layoutOrder: 'Layout Order',
  automaticSize: 'Automatic Size',
  backgroundColor3: 'Background',
  backgroundTransparency: 'Bg Transparency',
  borderColor3: 'Border Color',
  borderSizePixel: 'Border Size',
  clipsDescendants: 'Clip Children',
  text: 'Text',
  textColor3: 'Text Color',
  textSize: 'Text Size',
  textScaled: 'Text Scaled',
  textWrapped: 'Text Wrapped',
  font: 'Font',
  richText: 'Rich Text',
  image: 'Image ID / URL',
  imageColor3: 'Image Color',
  imageTransparency: 'Image Transparency',
  canvasSize: 'Canvas Size',
  scrollBarThickness: 'Scrollbar Thickness',
  uiStrokeColor: 'Color',
  uiStrokeThickness: 'Thickness',
  uiStrokeTransparency: 'Transparency',
  uiCornerRadius: 'Corner Radius',
  uiGradientRotation: 'Rotation',
  uiPaddingTop: 'Padding Top',
  uiPaddingBottom: 'Padding Bottom',
  uiPaddingLeft: 'Padding Left',
  uiPaddingRight: 'Padding Right',
  uiAspectRatio: 'Aspect Ratio',
  uiAspectType: 'Aspect Type',
  uiListFillDirection: 'Fill Direction',
  uiListHorizontalAlignment: 'Horizontal Align',
  uiListVerticalAlignment: 'Vertical Align',
  uiListPadding: 'Padding',
  uiListSortOrder: 'Sort Order',
  uiGridCellSize: 'Cell Size',
  uiGridCellPadding: 'Cell Padding',
  uiGridFillDirection: 'Fill Direction',
  uiGridHorizontalAlignment: 'Horizontal Align',
  uiGridVerticalAlignment: 'Vertical Align',
  uiGridSortOrder: 'Sort Order',
  uiGridStartCorner: 'Start Corner',
  uiPageFillDirection: 'Fill Direction',
  uiPagePadding: 'Padding',
  uiPageCircular: 'Circular',
  uiPageTweenTime: 'Tween Time',
  attachedCorner: 'Corner Radius',
  attachedStroke: 'Stroke',
  effects: 'Effects',
}

const identity = (extra: PropertyKey[] = []): PropertySection => ({
  id: 'identity',
  title: 'Identity',
  defaultOpen: true,
  properties: ['name', 'locked', 'visible', ...extra],
})

const transform: PropertySection = {
  id: 'transform',
  title: 'Transform',
  defaultOpen: true,
  properties: ['position', 'size', 'anchorPoint', 'rotation'],
}

const appearance: PropertySection = {
  id: 'appearance',
  title: 'Appearance',
  defaultOpen: true,
  properties: [
    'backgroundColor3',
    'backgroundTransparency',
    'borderColor3',
    'borderSizePixel',
    'clipsDescendants',
  ],
}

const layout: PropertySection = {
  id: 'layout',
  title: 'Layout',
  properties: ['zIndex', 'layoutOrder', 'automaticSize'],
}

const text: PropertySection = {
  id: 'text',
  title: 'Text',
  defaultOpen: true,
  properties: ['text', 'textColor3', 'textSize', 'textScaled', 'textWrapped', 'font', 'richText'],
}

const image: PropertySection = {
  id: 'image',
  title: 'Image',
  defaultOpen: true,
  properties: ['image', 'imageColor3', 'imageTransparency'],
}

const scroll: PropertySection = {
  id: 'scroll',
  title: 'Scrolling',
  defaultOpen: true,
  properties: ['canvasSize', 'scrollBarThickness'],
}

const modifiers: PropertySection = {
  id: 'modifiers',
  title: 'Modifiers',
  properties: ['attachedCorner', 'attachedStroke'],
}

const effects: PropertySection = {
  id: 'effects',
  title: 'Effects',
  properties: ['effects'],
}

const strokeProps: PropertySection = {
  id: 'stroke',
  title: 'Stroke',
  defaultOpen: true,
  properties: ['uiStrokeColor', 'uiStrokeThickness', 'uiStrokeTransparency'],
}

const cornerProps: PropertySection = {
  id: 'corner',
  title: 'Corner',
  defaultOpen: true,
  properties: ['uiCornerRadius'],
}

const gradientProps: PropertySection = {
  id: 'gradient',
  title: 'Gradient',
  defaultOpen: true,
  properties: ['uiGradientRotation'],
}

const paddingProps: PropertySection = {
  id: 'padding',
  title: 'Padding',
  defaultOpen: true,
  properties: ['uiPaddingTop', 'uiPaddingBottom', 'uiPaddingLeft', 'uiPaddingRight'],
}

const aspectProps: PropertySection = {
  id: 'aspect',
  title: 'Aspect Ratio',
  defaultOpen: true,
  properties: ['uiAspectRatio', 'uiAspectType'],
}

const listLayoutProps: PropertySection = {
  id: 'listLayout',
  title: 'List Layout',
  defaultOpen: true,
  properties: [
    'uiListFillDirection',
    'uiListHorizontalAlignment',
    'uiListVerticalAlignment',
    'uiListPadding',
    'uiListSortOrder',
  ],
}

const gridLayoutProps: PropertySection = {
  id: 'gridLayout',
  title: 'Grid Layout',
  defaultOpen: true,
  properties: [
    'uiGridCellSize',
    'uiGridCellPadding',
    'uiGridFillDirection',
    'uiGridHorizontalAlignment',
    'uiGridVerticalAlignment',
    'uiGridSortOrder',
    'uiGridStartCorner',
  ],
}

const pageLayoutProps: PropertySection = {
  id: 'pageLayout',
  title: 'Page Layout',
  defaultOpen: true,
  properties: [
    'uiPageFillDirection',
    'uiPagePadding',
    'uiPageCircular',
    'uiPageTweenTime',
  ],
}

export const PROPERTY_SCHEMA: Record<RobloxClassName, PropertySection[]> = {
  ScreenGui: [
    identity(['zIndex', 'clipsDescendants']),
    effects,
  ],
  Folder: [identity()],
  Frame: [identity(), transform, appearance, layout, modifiers, effects],
  TextLabel: [identity(), transform, appearance, layout, text, modifiers, effects],
  TextButton: [identity(), transform, appearance, layout, text, modifiers, effects],
  ImageLabel: [identity(), transform, appearance, layout, image, modifiers, effects],
  ImageButton: [identity(), transform, appearance, layout, image, modifiers, effects],
  ScrollingFrame: [identity(), transform, appearance, layout, scroll, modifiers, effects],
  ViewportFrame: [identity(), transform, appearance, layout, modifiers, effects],
  UIStroke: [identity(), strokeProps],
  UICorner: [identity(), cornerProps],
  UIGradient: [identity(), gradientProps],
  UIPadding: [identity(), paddingProps],
  UIAspectRatioConstraint: [identity(), aspectProps],
  UIListLayout: [identity(), listLayoutProps],
  UIGridLayout: [identity(), gridLayoutProps],
  UIPageLayout: [identity(), pageLayoutProps],
}

export function getPropertySections(className: RobloxClassName): PropertySection[] {
  return PROPERTY_SCHEMA[className] ?? [identity()]
}
