'use client'

import { DEVICE_PRESETS } from '@/lib/core/types'
import { useEditorStore } from '@/lib/store/editor-store'

export function BottomBar() {
  const viewport = useEditorStore((s) => s.viewport)
  const mousePosition = useEditorStore((s) => s.mousePosition)
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const elements = useEditorStore((s) => s.project.elements)
  const devicePreview = useEditorStore((s) => s.project.devicePreview)
  const setViewport = useEditorStore((s) => s.setViewport)

  const device = DEVICE_PRESETS[devicePreview]
  const selectedName =
    selectedIds.length === 1
      ? elements[selectedIds[0]]?.name
      : selectedIds.length > 1
        ? `${selectedIds.length} selected`
        : 'None'

  return (
    <footer className="flex h-7 shrink-0 items-center gap-4 border-t border-[#3c3c3c] bg-[#007acc] px-3 text-xs text-white">
      <span>
        Zoom: {Math.round(viewport.zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={() => setViewport({ zoom: 1, panX: 100, panY: 50 })}
        className="hover:underline"
      >
        Reset
      </button>
      <span className="text-white/60">|</span>
      <span>
        Canvas: {device.width} × {device.height} ({device.label})
      </span>
      <span className="text-white/60">|</span>
      <span>
        X: {mousePosition.x}, Y: {mousePosition.y}
      </span>
      <span className="text-white/60">|</span>
      <span className="truncate">Selection: {selectedName}</span>
    </footer>
  )
}
