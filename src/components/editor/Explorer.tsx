'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Folder,
  Lock,
  Unlock,
  Plus,
} from 'lucide-react'
import type { UIElement } from '@/lib/core/types'
import { CREATABLE_OBJECTS } from '@/lib/core/types'
import { useEditorStore } from '@/lib/store/editor-store'
import { cn } from '@/lib/utils/cn'

const CLASS_ICONS: Record<string, string> = {
  ScreenGui: '🖥',
  Folder: '📁',
  Frame: '⬜',
  TextLabel: 'T',
  TextButton: '🔘',
  ImageLabel: '🖼',
  ImageButton: '🖱',
  ScrollingFrame: '📜',
  ViewportFrame: '🎮',
  UIStroke: '─',
  UICorner: '◢',
  UIGradient: '🌈',
  UIPadding: '⬚',
  UIAspectRatioConstraint: '⬛',
  UIListLayout: '☰',
  UIGridLayout: '▦',
  UIPageLayout: '📄',
}

function TreeNode({ element, depth = 0 }: { element: UIElement; depth?: number }) {
  const elements = useEditorStore((s) => s.project.elements)
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const select = useEditorStore((s) => s.select)
  const toggleCollapse = useEditorStore((s) => s.toggleCollapse)
  const toggleVisibility = useEditorStore((s) => s.toggleVisibility)
  const toggleLock = useEditorStore((s) => s.toggleLock)
  const updateElement = useEditorStore((s) => s.updateElement)
  const pushHistory = useEditorStore((s) => s.pushHistory)

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(element.name)
  const isSelected = selectedIds.includes(element.id)
  const hasChildren = element.children.length > 0

  const commitRename = () => {
    if (editName.trim() && editName !== element.name) {
      updateElement(element.id, { name: editName.trim() })
      pushHistory()
    }
    setIsEditing(false)
  }

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 rounded-md px-1 py-0.5 text-xs transition hover:bg-studio-hover',
          isSelected && 'bg-studio-selected',
        )}
        style={{ paddingLeft: depth * 12 + 4 }}
      >
        <button
          type="button"
          className="flex h-4 w-4 shrink-0 items-center justify-center text-studio-muted"
          onClick={() => toggleCollapse(element.id)}
        >
          {hasChildren ? (
            element.collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )
          ) : (
            <span className="w-3" />
          )}
        </button>

        <span className="w-4 shrink-0 text-center text-[10px] text-studio-muted">
          {CLASS_ICONS[element.className] ?? '•'}
        </span>

        {isEditing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') setIsEditing(false)
            }}
            className="min-w-0 flex-1 rounded border border-studio-accent bg-studio-input px-1 text-xs text-white focus:outline-none"
          />
        ) : (
          <button
            type="button"
            className="min-w-0 flex-1 truncate text-left text-studio-text"
            onClick={(e) => select([element.id], e.shiftKey)}
            onDoubleClick={() => {
              setEditName(element.name)
              setIsEditing(true)
            }}
          >
            {element.name}
          </button>
        )}

        <div className="flex shrink-0 items-center opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => toggleVisibility(element.id)}
            className="rounded p-0.5 text-studio-muted hover:text-white"
          >
            {element.visible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </button>
          <button
            type="button"
            onClick={() => toggleLock(element.id)}
            className="rounded p-0.5 text-studio-muted hover:text-white"
          >
            {element.locked ? (
              <Lock className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>

      {!element.collapsed &&
        element.children.map((childId) => {
          const child = elements[childId]
          if (!child) return null
          return <TreeNode key={childId} element={child} depth={depth + 1} />
        })}
    </div>
  )
}

export function ExplorerPanel() {
  const rootIds = useEditorStore((s) => s.project.rootIds)
  const elements = useEditorStore((s) => s.project.elements)
  const addElement = useEditorStore((s) => s.addElement)
  const [showAddMenu, setShowAddMenu] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-studio-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-studio-muted">
          Explorer
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="rounded p-1 text-studio-muted hover:bg-studio-hover hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
          {showAddMenu && (
            <div className="absolute right-0 top-full z-50 mt-1 max-h-64 w-48 overflow-y-auto rounded-md border border-studio-border bg-studio-panel py-1 shadow-xl">
              {CREATABLE_OBJECTS.map((obj) => (
                <button
                  key={obj.className}
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-studio-muted hover:bg-studio-selected"
                  onClick={() => {
                    addElement(obj.className)
                    setShowAddMenu(false)
                  }}
                >
                  <span>{CLASS_ICONS[obj.className]}</span>
                  {obj.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {rootIds.map((id) => {
          const el = elements[id]
          if (!el) return null
          return <TreeNode key={id} element={el} />
        })}
      </div>
    </div>
  )
}

export function LayersPanel() {
  const elements = useEditorStore((s) => s.project.elements)
  const rootIds = useEditorStore((s) => s.project.rootIds)
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const select = useEditorStore((s) => s.select)

  const allGuiElements = Object.values(elements).filter(
    (el) => el.className !== 'Folder' && !el.isLayerGroup,
  )

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-studio-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-studio-muted">
          Layers
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {[...allGuiElements]
          .sort((a, b) => b.zIndex - a.zIndex)
          .map((el) => (
            <button
              key={el.id}
              type="button"
              onClick={(e) => select([el.id], e.shiftKey)}
              className={cn(
                'flex w-full items-center gap-2 rounded px-2 py-1 text-xs hover:bg-studio-hover',
                selectedIds.includes(el.id) && 'bg-studio-selected',
              )}
            >
              <span className="text-studio-muted">{el.zIndex}</span>
              <span className="truncate text-studio-text">{el.name}</span>
              <span className="ml-auto text-[10px] text-studio-muted">{el.className}</span>
            </button>
          ))}
      </div>
    </div>
  )
}

export function AssetsPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-studio-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-studio-muted">
          Assets
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <Folder className="mb-2 h-8 w-8 text-studio-muted" />
        <p className="text-xs text-studio-muted">
          Asset library coming soon.
          <br />
          Upload images for ImageLabels and ImageButtons.
        </p>
      </div>
    </div>
  )
}
