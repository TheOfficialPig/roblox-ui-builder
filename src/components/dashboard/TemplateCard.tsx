'use client'

import type { TemplateId } from '@/lib/templates'

const CATEGORY_STYLE: Record<string, { bg: string; accent: string; glyph: string }> = {
  Menus: { bg: 'from-violet-950/80 to-studio-panel', accent: 'bg-violet-500', glyph: '☰' },
  Gameplay: { bg: 'from-emerald-950/60 to-studio-panel', accent: 'bg-emerald-500', glyph: '▦' },
  UI: { bg: 'from-sky-950/60 to-studio-panel', accent: 'bg-sky-500', glyph: '◫' },
  HUD: { bg: 'from-amber-950/50 to-studio-panel', accent: 'bg-amber-500', glyph: '▬' },
}

export function TemplateCard({
  name,
  description,
  category,
  templateId,
  onClick,
}: {
  name: string
  description: string
  category: string
  templateId: TemplateId
  onClick: () => void
}) {
  const style = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.Menus

  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-studio-border bg-studio-panel text-left transition hover:border-studio-accent/40 hover:shadow-lg hover:shadow-studio-accent/5"
    >
      {/* Mini preview */}
      <div
        className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${style.bg} border-b border-studio-border`}
      >
        <TemplatePreview id={templateId} accentClass={style.accent} />
        <span className="absolute left-3 top-3 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/70">
          Free
        </span>
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${style.accent}`} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-studio-muted">
            {category}
          </span>
        </div>
        <div className="font-medium text-white group-hover:text-studio-accent">{name}</div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-studio-muted">{description}</p>
      </div>
    </button>
  )
}

function TemplatePreview({ id, accentClass }: { id: TemplateId; accentClass: string }) {
  // Simple CSS silhouettes — reads as a UI mock, not a generic icon
  if (id === 'health-bar' || id === 'currency-hud') {
    return (
      <div className="w-32 space-y-2">
        <div className={`h-2 rounded-full ${accentClass} opacity-80`} style={{ width: '70%' }} />
        <div className="h-6 w-24 rounded-lg border border-white/10 bg-white/5" />
      </div>
    )
  }
  if (id === 'loading-screen') {
    return (
      <div className="flex w-28 flex-col items-center gap-3">
        <div className="h-2 w-16 rounded bg-white/20" />
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className={`h-full w-3/5 rounded-full ${accentClass}`} />
        </div>
      </div>
    )
  }
  if (id === 'dialog-box' || id === 'notifications') {
    return (
      <div className="w-40 rounded-lg border border-white/15 bg-black/30 p-2">
        <div className={`mb-2 h-1 w-8 rounded ${accentClass}`} />
        <div className="h-1.5 w-full rounded bg-white/15" />
        <div className="mt-1 h-1.5 w-[80%] rounded bg-white/10" />
      </div>
    )
  }
  // Default panel layout
  return (
    <div className="w-36 rounded-lg border border-white/15 bg-black/25 p-2 shadow-lg">
      <div className="mb-2 flex items-center gap-1.5 border-b border-white/10 pb-2">
        <div className={`h-1 flex-1 rounded ${accentClass}`} />
      </div>
      <div className="space-y-1.5">
        <div className={`h-5 rounded ${accentClass} opacity-90`} />
        <div className="h-4 rounded bg-white/10" />
        <div className="h-4 w-[80%] rounded bg-white/10" />
      </div>
    </div>
  )
}
