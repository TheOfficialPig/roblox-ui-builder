'use client'

import { useState } from 'react'
import { Box, Plus, Trash2 } from 'lucide-react'
import { BUILTIN_COMPONENTS } from '@/lib/core/builtin-components'
import { useEditorStore } from '@/lib/store/editor-store'

export function ComponentsPanel() {
  const components = useEditorStore((s) => s.project.components)
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const saveSelectionAsComponent = useEditorStore((s) => s.saveSelectionAsComponent)
  const insertComponent = useEditorStore((s) => s.insertComponent)
  const deleteComponent = useEditorStore((s) => s.deleteComponent)
  const [name, setName] = useState('My Component')
  const [showSave, setShowSave] = useState(false)

  const all = [...BUILTIN_COMPONENTS, ...components]

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-studio-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-studio-muted">
          Components
        </span>
        <button
          type="button"
          disabled={selectedIds.length === 0}
          onClick={() => setShowSave(!showSave)}
          className="rounded p-1 text-studio-muted hover:bg-studio-hover hover:text-white disabled:opacity-40"
          title="Save selection as component"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {showSave && (
        <div className="border-b border-studio-border p-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2 w-full rounded border border-studio-border bg-studio-input px-2 py-1 text-xs text-white"
            placeholder="Component name"
          />
          <button
            type="button"
            onClick={() => {
              if (name.trim()) {
                saveSelectionAsComponent(name.trim())
                setShowSave(false)
              }
            }}
            className="w-full rounded bg-studio-accent py-1.5 text-xs font-medium text-white"
          >
            Save selection
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {components.length > 0 && (
          <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wide text-studio-muted">
            Your components
          </p>
        )}
        {components.map((c) => (
          <ComponentRow
            key={c.id}
            name={c.name}
            onInsert={() => insertComponent(c.id)}
            onDelete={() => deleteComponent(c.id)}
            deletable
          />
        ))}

        <p className="mb-2 mt-4 px-1 text-[10px] font-medium uppercase tracking-wide text-studio-muted">
          Starter components
        </p>
        {BUILTIN_COMPONENTS.map((c) => (
          <ComponentRow key={c.id} name={c.name} onInsert={() => insertComponent(c.id)} />
        ))}
      </div>
    </div>
  )
}

function ComponentRow({
  name,
  onInsert,
  onDelete,
  deletable,
}: {
  name: string
  onInsert: () => void
  onDelete?: () => void
  deletable?: boolean
}) {
  return (
    <div className="group mb-1 flex items-center gap-2 rounded-lg border border-studio-border bg-studio-bg/50 px-2 py-2 hover:border-studio-accent/30">
      <Box className="h-4 w-4 shrink-0 text-studio-accent" />
      <span className="min-w-0 flex-1 truncate text-xs text-white">{name}</span>
      <button
        type="button"
        onClick={onInsert}
        className="rounded bg-studio-accent/20 px-2 py-0.5 text-[10px] font-medium text-studio-accent hover:bg-studio-accent hover:text-white"
      >
        Insert
      </button>
      {deletable && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="rounded p-1 text-studio-muted opacity-0 hover:text-red-400 group-hover:opacity-100"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
