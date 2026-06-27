'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Undo2,
  Redo2,
  Save,
  Download,
  Copy,
  Clipboard,
  Trash2,
  CopyPlus,
  Grid3x3,
  Magnet,
  Smartphone,
  Tablet,
  Monitor,
  Group,
  Layers,
} from 'lucide-react'
import { DEVICE_PRESETS } from '@/lib/core/types'
import type { DevicePreview } from '@/lib/core/types'
import { useCanRedo, useCanUndo, useEditorStore } from '@/lib/store/editor-store'
import { saveProjectApi } from '@/lib/api/projects-client'
import { cn } from '@/lib/utils/cn'
import { ExportModal } from './ExportModal'

export function Toolbar() {
  const project = useEditorStore((s) => s.project)
  const setProjectName = useEditorStore((s) => s.setProjectName)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const copySelected = useEditorStore((s) => s.copySelected)
  const paste = useEditorStore((s) => s.paste)
  const duplicateSelected = useEditorStore((s) => s.duplicateSelected)
  const deleteSelected = useEditorStore((s) => s.deleteSelected)
  const groupSelected = useEditorStore((s) => s.groupSelected)
  const gridEnabled = useEditorStore((s) => s.gridEnabled)
  const snapEnabled = useEditorStore((s) => s.snapEnabled)
  const setGridEnabled = useEditorStore((s) => s.setGridEnabled)
  const setSnapEnabled = useEditorStore((s) => s.setSnapEnabled)
  const setDevicePreview = useEditorStore((s) => s.setDevicePreview)
  const markClean = useEditorStore((s) => s.markClean)
  const isDirty = useEditorStore((s) => s.isDirty)

  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
  const [showExport, setShowExport] = useState(false)
  const [saving, setSaving] = useState(false)

  const saveProject = async () => {
    setSaving(true)
    try {
      await saveProjectApi(project)
      markClean()
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const deviceButtons: Array<{ id: DevicePreview; icon: typeof Monitor }> = [
    { id: 'phone', icon: Smartphone },
    { id: 'tablet', icon: Tablet },
    { id: 'desktop', icon: Monitor },
  ]

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-1 border-b border-studio-border bg-studio-panel px-3">
        <Link
          href="/dashboard"
          className="mr-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-studio-muted transition hover:bg-studio-hover hover:text-white"
        >
          <Layers className="h-3.5 w-3.5 text-studio-accent" />
          Dashboard
        </Link>

        <div className="mx-1 h-5 w-px bg-studio-border" />

        <input
          type="text"
          value={project.name}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-44 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-white transition hover:border-studio-border focus:border-studio-accent focus:outline-none"
        />

        {isDirty && <span className="h-1.5 w-1.5 rounded-full bg-studio-accent" title="Unsaved changes" />}

        <div className="mx-2 h-5 w-px bg-studio-border" />

        <ToolButton onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Redo2 className="h-4 w-4" />
        </ToolButton>

        <div className="mx-2 h-5 w-px bg-studio-border" />

        <ToolButton onClick={copySelected} title="Copy (Ctrl+C)">
          <Copy className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={paste} title="Paste (Ctrl+V)">
          <Clipboard className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={duplicateSelected} title="Duplicate (Ctrl+D)">
          <CopyPlus className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={deleteSelected} title="Delete">
          <Trash2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={groupSelected} title="Group">
          <Group className="h-4 w-4" />
        </ToolButton>

        <div className="mx-2 h-5 w-px bg-studio-border" />

        <ToolButton
          onClick={() => setGridEnabled(!gridEnabled)}
          active={gridEnabled}
          title="Toggle Grid"
        >
          <Grid3x3 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          onClick={() => setSnapEnabled(!snapEnabled)}
          active={snapEnabled}
          title="Toggle Snap"
        >
          <Magnet className="h-4 w-4" />
        </ToolButton>

        <div className="mx-2 h-5 w-px bg-studio-border" />

        {deviceButtons.map(({ id, icon: Icon }) => (
          <ToolButton
            key={id}
            onClick={() => setDevicePreview(id)}
            active={project.devicePreview === id}
            title={DEVICE_PRESETS[id].label}
          >
            <Icon className="h-4 w-4" />
          </ToolButton>
        ))}

        <div className="flex-1" />

        <ToolButton onClick={saveProject} title="Save" disabled={saving}>
          <Save className="h-4 w-4" />
          <span className="text-xs">{saving ? 'Saving...' : 'Save'}</span>
        </ToolButton>
        <button
          type="button"
          onClick={() => setShowExport(true)}
          className="ml-1.5 flex items-center gap-1.5 rounded-lg bg-studio-accent px-3.5 py-1.5 text-xs font-medium text-white shadow-lg shadow-studio-accent/20 transition hover:bg-studio-accent-hover"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </header>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </>
  )
}

function ToolButton({
  children,
  onClick,
  disabled,
  active,
  title,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'flex items-center gap-1 rounded-lg px-2 py-1.5 text-studio-muted transition',
        active ? 'bg-studio-selected text-white' : 'hover:bg-studio-hover hover:text-white',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      {children}
    </button>
  )
}
