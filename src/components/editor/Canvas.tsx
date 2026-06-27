'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { UIElement } from '@/lib/core/types'
import { DEVICE_PRESETS } from '@/lib/core/types'
import {
  applyResize,
  colorToCss,
  getElementBounds,
  getElementRectInParent,
  isGuiObject,
  isLayoutObject,
  isModifierObject,
  isResizable,
  rectToRobloxProps,
  resolvePosition,
  robloxFontToCss,
  snapDimension,
  type ResizeHandle,
} from '@/lib/core/utils'
import {
  cornerRadiusToCss,
  resolveAttachedModifiers,
} from '@/lib/core/modifiers'
import {
  buildElementVisualStyle,
  buildGradientStyle,
  getTextureOverlayStyle,
  mergeBackgrounds,
  resolveBorderEffect,
} from '@/lib/core/effects'
import { useEditorStore } from '@/lib/store/editor-store'
import { snapPosition } from '@/lib/canvas/snapping'
import { cn } from '@/lib/utils/cn'

const HANDLE_SIZE = 8
const MIN_SIZE = 8

const HANDLE_CONFIG: Array<{
  id: ResizeHandle
  cursor: string
  style: React.CSSProperties
}> = [
  { id: 'nw', cursor: 'nwse-resize', style: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 } },
  { id: 'n', cursor: 'ns-resize', style: { top: -HANDLE_SIZE / 2, left: '50%', marginLeft: -HANDLE_SIZE / 2 } },
  { id: 'ne', cursor: 'nesw-resize', style: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 } },
  { id: 'e', cursor: 'ew-resize', style: { top: '50%', right: -HANDLE_SIZE / 2, marginTop: -HANDLE_SIZE / 2 } },
  { id: 'se', cursor: 'nwse-resize', style: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 } },
  { id: 's', cursor: 'ns-resize', style: { bottom: -HANDLE_SIZE / 2, left: '50%', marginLeft: -HANDLE_SIZE / 2 } },
  { id: 'sw', cursor: 'nesw-resize', style: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 } },
  { id: 'w', cursor: 'ew-resize', style: { top: '50%', left: -HANDLE_SIZE / 2, marginTop: -HANDLE_SIZE / 2 } },
]

interface CanvasElementProps {
  element: UIElement
  parentWidth: number
  parentHeight: number
  parentX: number
  parentY: number
}

function renderChildElements(
  childIds: string[],
  elements: Record<string, UIElement>,
  parentWidth: number,
  parentHeight: number,
  parentX: number,
  parentY: number,
): React.ReactNode {
  return childIds.map((childId) => {
    const child = elements[childId]
    if (!child || !child.visible) return null

    if (isModifierObject(child.className)) return null

    if (child.className === 'Folder' || child.isLayerGroup) {
      return (
        <span key={childId} style={{ display: 'contents' }}>
          {renderChildElements(child.children, elements, parentWidth, parentHeight, parentX, parentY)}
        </span>
      )
    }

    if (isLayoutObject(child.className)) {
      return (
        <span key={childId} style={{ display: 'contents' }}>
          {renderChildElements(child.children, elements, parentWidth, parentHeight, parentX, parentY)}
        </span>
      )
    }

    return (
      <CanvasElement
        key={childId}
        element={child}
        parentWidth={parentWidth}
        parentHeight={parentHeight}
        parentX={parentX}
        parentY={parentY}
      />
    )
  })
}

export function CanvasElement({
  element,
  parentWidth,
  parentHeight,
  parentX,
  parentY,
}: CanvasElementProps) {
  const select = useEditorStore((s) => s.select)
  const elements = useEditorStore((s) => s.project.elements)

  const isFolder = element.className === 'Folder' || element.isLayerGroup

  if (!element.visible || isFolder) {
    return (
      <>
        {renderChildElements(element.children, elements, parentWidth, parentHeight, parentX, parentY)}
      </>
    )
  }

  // Layout objects don't draw — but their children still need to render
  if (isLayoutObject(element.className)) {
    return (
      <>
        {renderChildElements(element.children, elements, parentWidth, parentHeight, parentX, parentY)}
      </>
    )
  }

  if (!isGuiObject(element) && element.className !== 'ScreenGui') return null

  const resolved = resolvePosition(
    element.position,
    element.size,
    element.anchorPoint,
    parentWidth,
    parentHeight,
  )

  const absX = parentX + resolved.x
  const absY = parentY + resolved.y

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (element.locked) return
    select([element.id], e.shiftKey)
  }

  const modifiers = resolveAttachedModifiers(element, elements)
  const cornerRadius = modifiers.uiCorner
    ? cornerRadiusToCss(modifiers.uiCorner, resolved.width, resolved.height)
    : 0

  const effectStyle = buildElementVisualStyle(element)
  const borderFx = resolveBorderEffect(element)
  const textureOverlay = getTextureOverlayStyle(element)
  const gradient = modifiers.uiGradient
    ? buildGradientStyle({ ...element, uiGradient: modifiers.uiGradient })
    : buildGradientStyle(element)

  const strokeShadow =
    modifiers.uiStroke && modifiers.uiStroke.applyStrokeMode !== 'Contextual'
      ? `0 0 0 ${modifiers.uiStroke.thickness}px ${colorToCss(
          modifiers.uiStroke.color,
          1 - modifiers.uiStroke.transparency,
        )}`
      : undefined

  const combinedShadow = [effectStyle.boxShadow, strokeShadow].filter(Boolean).join(', ') || undefined

  const style: React.CSSProperties = mergeBackgrounds(
    {
      position: 'absolute',
      left: resolved.x,
      top: resolved.y,
      width: resolved.width,
      height: resolved.height,
      zIndex: element.zIndex,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      backgroundColor: colorToCss(
        element.backgroundColor3,
        1 - element.backgroundTransparency,
      ),
      borderColor: borderFx.enabled
        ? effectStyle.borderColor
        : colorToCss(element.borderColor3),
      borderWidth: borderFx.enabled ? effectStyle.borderWidth : element.borderSizePixel,
      borderStyle: borderFx.enabled
        ? effectStyle.borderStyle
        : element.borderSizePixel > 0
          ? 'solid'
          : undefined,
      borderRadius: cornerRadius,
      overflow:
        element.clipsDescendants || (modifiers.uiCorner && cornerRadius !== 0)
          ? 'hidden'
          : 'visible',
      color: colorToCss(element.textColor3),
      fontSize: element.textScaled ? undefined : element.textSize,
      fontFamily: robloxFontToCss(element.font),
      fontWeight: element.font.includes('Bold') || element.font.includes('Black') ? 700 : 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      userSelect: 'none',
      boxSizing: 'border-box',
      boxShadow: combinedShadow,
    },
    gradient,
  )

  if (modifiers.uiStroke?.applyStrokeMode === 'Contextual') {
    style.WebkitTextStroke = `${modifiers.uiStroke.thickness}px ${colorToCss(
      modifiers.uiStroke.color,
      1 - modifiers.uiStroke.transparency,
    )}`
  }

  const isTextElement = ['TextLabel', 'TextButton'].includes(element.className)
  const isImageElement = ['ImageLabel', 'ImageButton'].includes(element.className)
  const padding = modifiers.uiPadding ?? element.uiPadding

  return (
    <div
      data-element-id={element.id}
      data-exportable="true"
      className="canvas-element"
      style={style}
      onMouseDown={handleMouseDown}
    >
      {textureOverlay && <div aria-hidden style={textureOverlay} />}
      {isTextElement && (
        <span
          style={{
            padding: padding
              ? `${padding.paddingTop}px ${padding.paddingRight}px ${padding.paddingBottom}px ${padding.paddingLeft}px`
              : '4px 8px',
            width: '100%',
            wordBreak: element.textWrapped ? 'break-word' : undefined,
            fontSize: element.textScaled
              ? Math.min(resolved.height * 0.4, resolved.width * 0.15)
              : element.textSize,
          }}
        >
          {element.text}
        </span>
      )}
      {isImageElement && element.image && (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage:
              element.image.startsWith('http') || element.image.startsWith('rbxasset')
                ? `url(${element.image})`
                : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1 - element.imageTransparency,
            borderRadius: 'inherit',
          }}
        />
      )}
      {renderChildElements(
        element.children,
        elements,
        resolved.width,
        resolved.height,
        absX,
        absY,
      )}
    </div>
  )
}

interface SelectionOverlayProps {
  element: UIElement
  deviceWidth: number
  deviceHeight: number
  onResizeStart: (handle: ResizeHandle, e: React.MouseEvent) => void
}

function SelectionOverlay({
  element,
  deviceWidth,
  deviceHeight,
  onResizeStart,
}: SelectionOverlayProps) {
  const elements = useEditorStore((s) => s.project.elements)
  const bounds = getElementBounds(element, elements, deviceWidth, deviceHeight)

  const rotation = element.rotation || 0
  const cx = bounds.width / 2
  const cy = bounds.height / 2

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        zIndex: 9998,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      <div className="absolute inset-0 border border-studio-accent shadow-[0_0_0_1px_rgba(124,92,252,0.15)]" />
      {HANDLE_CONFIG.map(({ id, cursor, style }) => (
        <div
          key={id}
          className="resize-handle pointer-events-auto absolute rounded-sm border border-studio-accent bg-white shadow-sm"
          style={{
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            cursor,
            ...style,
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onResizeStart(id, e)
          }}
        />
      ))}
    </div>
  )
}

interface DragState {
  ids: string[]
  startX: number
  startY: number
  origins: Record<string, { x: number; y: number; width: number; height: number }>
}

interface ResizeState {
  id: string
  handle: ResizeHandle
  startX: number
  startY: number
  origin: { x: number; y: number; width: number; height: number }
  anchorPoint: { x: number; y: number }
}

export function DesignCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const project = useEditorStore((s) => s.project)
  const viewport = useEditorStore((s) => s.viewport)
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const snapGuides = useEditorStore((s) => s.snapGuides)
  const gridEnabled = useEditorStore((s) => s.gridEnabled)
  const gridSize = useEditorStore((s) => s.gridSize)
  const clearSelection = useEditorStore((s) => s.clearSelection)
  const setViewport = useEditorStore((s) => s.setViewport)
  const setMousePosition = useEditorStore((s) => s.setMousePosition)
  const setIsPanning = useEditorStore((s) => s.setIsPanning)
  const updateElement = useEditorStore((s) => s.updateElement)
  const pushHistory = useEditorStore((s) => s.pushHistory)
  const setSnapGuides = useEditorStore((s) => s.setSnapGuides)
  const snapEnabled = useEditorStore((s) => s.snapEnabled)

  const device = DEVICE_PRESETS[project.devicePreview]
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)
  const [isSpaceHeld, setIsSpaceHeld] = useState(false)
  const panStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

  const selectedElement =
    selectedIds.length === 1 ? project.elements[selectedIds[0]] : null
  const showResizeHandles =
    selectedElement && isResizable(selectedElement)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) setIsSpaceHeld(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpaceHeld(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        setViewport({ zoom: Math.min(4, Math.max(0.1, viewport.zoom * delta)) })
      } else {
        setViewport({ panX: viewport.panX - e.deltaX, panY: viewport.panY - e.deltaY })
      }
    },
    [viewport, setViewport],
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const handleResizeStart = useCallback(
    (handle: ResizeHandle, e: React.MouseEvent) => {
      const id = selectedIds[0]
      const el = project.elements[id]
      if (!el) return

      const rect = getElementRectInParent(el, project.elements, device.width, device.height)
      setResizeState({
        id,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        origin: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        anchorPoint: { ...el.anchorPoint },
      })
    },
    [selectedIds, project.elements, device.width, device.height],
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && isSpaceHeld)) {
      setIsPanning(true)
      panStart.current = { x: e.clientX, y: e.clientY, panX: viewport.panX, panY: viewport.panY }
      return
    }
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvasBg) {
      clearSelection()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const canvasX = (e.clientX - rect.left - viewport.panX) / viewport.zoom
    const canvasY = (e.clientY - rect.top - viewport.panY) / viewport.zoom
    setMousePosition(Math.round(canvasX), Math.round(canvasY))

    if (panStart.current) {
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      setViewport({ panX: panStart.current.panX + dx, panY: panStart.current.panY + dy })
    }
  }

  const handleMouseUp = () => {
    if (panStart.current) {
      panStart.current = null
      setIsPanning(false)
    }
  }

  const startDrag = useCallback(
    (e: MouseEvent) => {
      if (selectedIds.length === 0) return
      const target = e.target as HTMLElement
      if (target.closest('.resize-handle')) return

      const origins: Record<string, { x: number; y: number; width: number; height: number }> = {}
      for (const id of selectedIds) {
        const el = project.elements[id]
        if (!el) continue
        const rect = getElementRectInParent(el, project.elements, device.width, device.height)
        origins[id] = { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      }
      setDragState({ ids: selectedIds, startX: e.clientX, startY: e.clientY, origins })
    },
    [selectedIds, project.elements],
  )

  useEffect(() => {
    if (!dragState && !resizeState) return

    const onWindowMove = (e: MouseEvent) => {
      if (resizeState) {
        const dx = (e.clientX - resizeState.startX) / viewport.zoom
        const dy = (e.clientY - resizeState.startY) / viewport.zoom

        let next = applyResize(resizeState.handle, resizeState.origin, dx, dy, MIN_SIZE)

        if (gridEnabled) {
          next = {
            x: snapDimension(next.x, gridSize, true),
            y: snapDimension(next.y, gridSize, true),
            width: Math.max(MIN_SIZE, snapDimension(next.width, gridSize, true)),
            height: Math.max(MIN_SIZE, snapDimension(next.height, gridSize, true)),
          }
        }

        updateElement(
          resizeState.id,
          rectToRobloxProps(
            next.x,
            next.y,
            next.width,
            next.height,
            resizeState.anchorPoint,
          ),
        )
      }

      if (dragState) {
        const dx = (e.clientX - dragState.startX) / viewport.zoom
        const dy = (e.clientY - dragState.startY) / viewport.zoom

        const firstId = dragState.ids[0]
        const firstEl = project.elements[firstId]
        if (!firstEl) return

        const bounds = getElementBounds(firstEl, project.elements, device.width, device.height)
        const snapped = snapPosition(
          dragState.origins[firstId].x + dx,
          dragState.origins[firstId].y + dy,
          bounds.width,
          bounds.height,
          dragState.ids,
          project.elements,
          device.width,
          device.height,
          gridSize,
          snapEnabled,
          gridEnabled,
        )

        setSnapGuides(snapped.guides)

        const snapDx = snapped.x - dragState.origins[firstId].x
        const snapDy = snapped.y - dragState.origins[firstId].y

        for (const id of dragState.ids) {
          const el = project.elements[id]
          if (!el || el.locked) continue
          const origin = dragState.origins[id]
          const newX = origin.x + snapDx
          const newY = origin.y + snapDy
          updateElement(
            id,
            rectToRobloxProps(newX, newY, origin.width, origin.height, el.anchorPoint),
          )
        }
      }
    }

    const onWindowUp = () => {
      if (resizeState) {
        pushHistory()
        setResizeState(null)
      }
      if (dragState) {
        pushHistory()
        setDragState(null)
        setSnapGuides([])
      }
    }

    window.addEventListener('mousemove', onWindowMove)
    window.addEventListener('mouseup', onWindowUp)
    return () => {
      window.removeEventListener('mousemove', onWindowMove)
      window.removeEventListener('mouseup', onWindowUp)
    }
  }, [
    dragState,
    resizeState,
    viewport.zoom,
    project.elements,
    device.width,
    device.height,
    gridEnabled,
    gridSize,
    snapEnabled,
    updateElement,
    pushHistory,
    setSnapGuides,
  ])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragState && !resizeState && e.buttons === 1) {
        const target = e.target as HTMLElement
        if (target.closest('.resize-handle')) return
        if (target.closest('.canvas-element') && selectedIds.length > 0) {
          startDrag(e)
        }
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [dragState, resizeState, selectedIds, startDrag])

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-canvas-bg"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isSpaceHeld ? 'grab' : resizeState ? 'crosshair' : 'default' }}
    >
      <div
        data-canvas-bg="true"
        className="absolute"
        style={{
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <div
          data-canvas-bg="true"
          className={cn(
            'relative rounded-xl border border-studio-border bg-[#08080c] shadow-2xl shadow-black/40',
            gridEnabled && 'canvas-grid',
          )}
          style={{
            width: device.width,
            height: device.height,
            backgroundSize: gridEnabled ? `${gridSize}px ${gridSize}px` : undefined,
          }}
        >
          {project.rootIds.map((rootId) => {
            const root = project.elements[rootId]
            if (!root) return null
            return (
              <CanvasElement
                key={rootId}
                element={root}
                parentWidth={device.width}
                parentHeight={device.height}
                parentX={0}
                parentY={0}
              />
            )
          })}

          {showResizeHandles && selectedElement && (
            <SelectionOverlay
              element={selectedElement}
              deviceWidth={device.width}
              deviceHeight={device.height}
              onResizeStart={handleResizeStart}
            />
          )}

          {snapGuides.map((guide, i) =>
            guide.orientation === 'horizontal' ? (
              <div key={`h-${i}`} className="snap-guide-h" style={{ top: guide.position }} />
            ) : (
              <div key={`v-${i}`} className="snap-guide-v" style={{ left: guide.position }} />
            ),
          )}
        </div>
      </div>
    </div>
  )
}
