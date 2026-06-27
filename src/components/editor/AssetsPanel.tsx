'use client'

import { useState } from 'react'
import { Image, Plus, Trash2 } from 'lucide-react'
import { useEditorStore } from '@/lib/store/editor-store'

export function AssetsPanel() {
  const assets = useEditorStore((s) => s.project.assets)
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const addAsset = useEditorStore((s) => s.addAsset)
  const removeAsset = useEditorStore((s) => s.removeAsset)
  const applyAssetToSelected = useEditorStore((s) => s.applyAssetToSelected)
  const [name, setName] = useState('Icon')
  const [assetId, setAssetId] = useState('')

  const canApply = selectedIds.some((id) => {
    const el = useEditorStore.getState().project.elements[id]
    return el && ['ImageLabel', 'ImageButton'].includes(el.className)
  })

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-studio-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-studio-muted">
          Assets
        </span>
      </div>

      <div className="border-b border-studio-border p-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 w-full rounded border border-studio-border bg-studio-input px-2 py-1 text-xs text-white"
          placeholder="Asset name"
        />
        <input
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="mb-2 w-full rounded border border-studio-border bg-studio-input px-2 py-1 text-xs text-white"
          placeholder="rbxassetid://123456 or ID"
        />
        <button
          type="button"
          onClick={() => {
            if (name.trim() && assetId.trim()) {
              addAsset(name.trim(), assetId.trim())
              setAssetId('')
            }
          }}
          className="flex w-full items-center justify-center gap-1 rounded bg-studio-accent py-1.5 text-xs font-medium text-white"
        >
          <Plus className="h-3 w-3" />
          Add asset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {assets.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-studio-muted">
            Save rbxassetid images here, then apply them to ImageLabels and ImageButtons.
          </p>
        ) : (
          assets.map((asset) => (
            <div
              key={asset.id}
              className="group mb-1 flex items-center gap-2 rounded-lg border border-studio-border px-2 py-2 hover:border-studio-accent/30"
            >
              <Image className="h-4 w-4 shrink-0 text-studio-muted" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs text-white">{asset.name}</div>
                <div className="truncate text-[10px] text-studio-muted">{asset.rbxAssetId}</div>
              </div>
              <button
                type="button"
                disabled={!canApply}
                onClick={() => applyAssetToSelected(asset.id)}
                className="rounded bg-studio-accent/20 px-2 py-0.5 text-[10px] text-studio-accent hover:bg-studio-accent hover:text-white disabled:opacity-40"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => removeAsset(asset.id)}
                className="rounded p-1 text-studio-muted opacity-0 hover:text-red-400 group-hover:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
