'use client'

import { useEffect } from 'react'
import { DesignCanvas } from './Canvas'
import { Toolbar } from './Toolbar'
import { BottomBar } from './BottomBar'
import { PropertiesPanel } from './PropertiesPanel'
import { ExplorerPanel, LayersPanel } from './Explorer'
import { AssetsPanel } from './AssetsPanel'
import { ComponentsPanel } from './ComponentsPanel'
import { useEditorStore } from '@/lib/store/editor-store'
import { cn } from '@/lib/utils/cn'

function LeftSidebar() {
  const tab = useEditorStore((s) => s.leftPanelTab)
  const setTab = useEditorStore((s) => s.setLeftPanelTab)

  const tabs = [
    { id: 'explorer' as const, label: 'Explorer' },
    { id: 'layers' as const, label: 'Layers' },
    { id: 'components' as const, label: 'Components' },
    { id: 'assets' as const, label: 'Assets' },
  ]

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-studio-border bg-studio-panel">
      <div className="flex border-b border-studio-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 px-2 py-2.5 text-[11px] font-medium transition',
              tab === t.id
                ? 'border-b-2 border-studio-accent text-white'
                : 'text-studio-muted hover:text-studio-text',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === 'explorer' && <ExplorerPanel />}
        {tab === 'layers' && <LayersPanel />}
        {tab === 'components' && <ComponentsPanel />}
        {tab === 'assets' && <AssetsPanel />}
      </div>
    </aside>
  )
}

function useKeyboardShortcuts() {
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const copySelected = useEditorStore((s) => s.copySelected)
  const paste = useEditorStore((s) => s.paste)
  const duplicateSelected = useEditorStore((s) => s.duplicateSelected)
  const deleteSelected = useEditorStore((s) => s.deleteSelected)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      } else if (mod && e.key === 'c') {
        e.preventDefault()
        copySelected()
      } else if (mod && e.key === 'v') {
        e.preventDefault()
        paste()
      } else if (mod && e.key === 'd') {
        e.preventDefault()
        duplicateSelected()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
        e.preventDefault()
        deleteSelected()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, copySelected, paste, duplicateSelected, deleteSelected])
}

export function EditorLayout() {
  useKeyboardShortcuts()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-studio-bg">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <main className="flex-1 overflow-hidden">
          <DesignCanvas />
        </main>
        <aside className="w-72 shrink-0 overflow-hidden border-l border-studio-border bg-studio-panel">
          <PropertiesPanel />
        </aside>
      </div>
      <BottomBar />
    </div>
  )
}
