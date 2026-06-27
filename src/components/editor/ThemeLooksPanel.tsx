'use client'

import { BUILT_IN_THEMES } from '@/lib/core/theme'
import { LOOK_PRESETS } from '@/lib/core/look-presets'
import { useEditorStore } from '@/lib/store/editor-store'

export function ProjectThemeSection() {
  const theme = useEditorStore((s) => s.project.theme)
  const setTheme = useEditorStore((s) => s.setTheme)
  const applyThemeToSelected = useEditorStore((s) => s.applyThemeToSelected)
  const selectedIds = useEditorStore((s) => s.selectedIds)

  return (
    <div className="border-b border-studio-border p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-studio-muted">
        Project Theme
      </h3>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {BUILT_IN_THEMES.map((t) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setTheme(t)}
            className={`rounded-md border px-2 py-1 text-[10px] transition ${
              theme.name === t.name
                ? 'border-studio-accent bg-studio-accent/20 text-white'
                : 'border-studio-border text-studio-muted hover:border-studio-accent/40'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      {selectedIds.length > 0 && (
        <div>
          <p className="mb-1.5 text-[10px] text-studio-muted">Apply theme to selection</p>
          <div className="flex flex-wrap gap-1">
            {(['surface', 'raised', 'primary', 'secondary', 'accent'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => applyThemeToSelected(role)}
                className="rounded border border-studio-border px-2 py-0.5 text-[10px] capitalize text-studio-muted hover:border-studio-accent/40 hover:text-white"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function LookPresetsBar() {
  const applyLookToSelected = useEditorStore((s) => s.applyLookToSelected)
  const selectedIds = useEditorStore((s) => s.selectedIds)

  if (selectedIds.length === 0) return null

  return (
    <div className="border-b border-studio-border p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-studio-muted">
        Quick Looks
      </h3>
      <div className="grid grid-cols-2 gap-1.5">
        {LOOK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyLookToSelected(preset.id)}
            title={preset.description}
            className="rounded-lg border border-studio-border bg-studio-bg/60 px-2 py-2 text-left transition hover:border-studio-accent/40 hover:bg-studio-accent/10"
          >
            <div className="text-[11px] font-medium text-white">{preset.name}</div>
            <div className="mt-0.5 line-clamp-1 text-[10px] text-studio-muted">{preset.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
