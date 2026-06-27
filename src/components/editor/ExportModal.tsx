'use client'

import { useState } from 'react'
import { X, FileCode, Image, FileJson, Loader2 } from 'lucide-react'
import type { ExportFormat } from '@/lib/core/types'
import { useEditorStore } from '@/lib/store/editor-store'
import { exportToLua } from '@/lib/export/lua'
import {
  downloadJson,
  downloadLua,
  downloadPngZip,
  buildPngExportManifest,
  exportToJsonString,
} from '@/lib/export/index'
import { cn } from '@/lib/utils/cn'

const EXPORT_OPTIONS: Array<{
  id: ExportFormat
  label: string
  description: string
  icon: typeof FileCode
}> = [
  {
    id: 'lua',
    label: 'Roblox Lua Script',
    description: 'Production-ready Lua that recreates your UI in Roblox Studio',
    icon: FileCode,
  },
  {
    id: 'png',
    label: 'PNG Layers',
    description: 'Each visible layer exported as a transparent PNG',
    icon: Image,
  },
  {
    id: 'json',
    label: 'Roblox JSON Project',
    description: 'Full project JSON for future Studio plugin compatibility',
    icon: FileJson,
  },
]

export function ExportModal({ onClose }: { onClose: () => void }) {
  const project = useEditorStore((s) => s.project)
  const [selected, setSelected] = useState<ExportFormat>('lua')
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, name: '' })
  const [preview, setPreview] = useState<string | null>(null)

  const manifest = buildPngExportManifest(project)

  const handlePreview = () => {
    if (selected === 'lua') {
      setPreview(exportToLua(project))
    } else if (selected === 'json') {
      setPreview(exportToJsonString(project))
    } else {
      setPreview(
        manifest
          .map((e) => (e.isFolder ? `${e.name}/` : e.path))
          .join('\n') || 'No exportable layers',
      )
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      if (selected === 'lua') {
        downloadLua(project)
      } else if (selected === 'json') {
        downloadJson(project)
      } else {
        await downloadPngZip(project, (current, total, name) => {
          setProgress({ current, total, name })
        })
      }
      onClose()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-lg border border-[#3c3c3c] bg-[#252526] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#3c3c3c] px-4 py-3">
          <h2 className="text-sm font-semibold text-white">Export Project</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-[#2a2d2e] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 grid gap-2">
            {EXPORT_OPTIONS.map(({ id, label, description, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSelected(id)
                  setPreview(null)
                }}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-3 text-left transition',
                  selected === id
                    ? 'border-[#0078d4] bg-[#094771]/30'
                    : 'border-[#3c3c3c] hover:border-[#555]',
                )}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#0078d4]" />
                <div>
                  <div className="text-sm font-medium text-white">{label}</div>
                  <div className="text-xs text-gray-400">{description}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">Preview</span>
              <button
                type="button"
                onClick={handlePreview}
                className="text-xs text-[#0078d4] hover:underline"
              >
                Generate preview
              </button>
            </div>
            <pre className="max-h-48 overflow-auto rounded border border-[#3c3c3c] bg-[#1e1e1e] p-3 text-xs text-gray-300">
              {preview ?? 'Click "Generate preview" to see export output'}
            </pre>
          </div>

          {exporting && selected === 'png' && (
            <div className="mb-4 flex items-center gap-2 text-xs text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting {progress.name} ({progress.current}/{progress.total})
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#3c3c3c] px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-1.5 text-sm text-gray-300 hover:bg-[#2a2d2e]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded bg-[#0078d4] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#1a86d9] disabled:opacity-50"
          >
            {exporting && <Loader2 className="h-4 w-4 animate-spin" />}
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
