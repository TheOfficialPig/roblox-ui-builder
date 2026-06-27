'use client'

import type { TemplateCategory, TemplateId } from '@/lib/templates'
import { CATEGORY_LABELS } from '@/lib/templates'

const CATEGORY_STYLE: Record<TemplateCategory, { bg: string; accent: string }> = {
  modern: { bg: 'from-blue-950/70 to-studio-panel', accent: 'bg-blue-500' },
  retro: { bg: 'from-amber-950/70 to-studio-panel', accent: 'bg-amber-500' },
  pixel: { bg: 'from-emerald-950/70 to-studio-panel', accent: 'bg-emerald-400' },
  lowpoly: { bg: 'from-slate-300/20 to-studio-panel', accent: 'bg-sky-400' },
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
  category: TemplateCategory
  templateId: TemplateId
  onClick: () => void
}) {
  const style = CATEGORY_STYLE[category]

  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-studio-border bg-studio-panel text-left transition hover:border-studio-accent/40 hover:shadow-lg hover:shadow-studio-accent/5"
    >
      <div
        className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${style.bg} border-b border-studio-border p-4`}
      >
        <PhonePreview category={category} templateId={templateId} accentClass={style.accent} />
        <span className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80">
          {CATEGORY_LABELS[category]}
        </span>
      </div>
      <div className="p-4">
        <div className="font-medium text-white group-hover:text-studio-accent">{name}</div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-studio-muted">{description}</p>
      </div>
    </button>
  )
}

/** Mini phone-frame preview */
function PhonePreview({
  category,
  templateId,
  accentClass,
}: {
  category: TemplateCategory
  templateId: TemplateId
  accentClass: string
}) {
  const isHud = templateId.includes('hud')
  const isMenu = templateId.includes('menu') || templateId.includes('pause') || templateId.includes('gameover')

  return (
    <div className="relative h-full w-[96px] rounded-lg border-2 border-white/20 bg-black/40 shadow-lg">
      <div className="absolute inset-x-3 top-1.5 h-1 rounded-full bg-white/15" />
      <div className="absolute inset-2 top-4 flex flex-col gap-1">
        {isHud ? (
          <>
            <div className={`h-1.5 w-full rounded-sm ${accentClass} opacity-80`} />
            <div className="mt-1 h-4 w-2/3 rounded-sm bg-white/10" />
          </>
        ) : isMenu ? (
          <>
            <div className="mx-auto mb-1 h-1.5 w-8 rounded bg-white/25" />
            <div className={`h-4 w-full rounded-sm ${accentClass}`} />
            <div className="h-3 w-full rounded-sm bg-white/15" />
            <div className="h-3 w-full rounded-sm bg-white/10" />
          </>
        ) : templateId.includes('inventory') ? (
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-sm bg-white/15" />
            ))}
          </div>
        ) : (
          <>
            <div className={`h-1 w-full rounded ${accentClass}`} />
            <div className="h-3 w-full rounded-sm bg-white/15" />
            <div className="h-3 w-[85%] rounded-sm bg-white/10" />
            <div className="h-3 w-full rounded-sm bg-white/10" />
          </>
        )}
      </div>
      <div
        className="absolute inset-0 rounded-lg opacity-30"
        style={{
          background:
            category === 'lowpoly'
              ? 'linear-gradient(180deg, #c8d4e8 0%, #a8b8d0 100%)'
              : category === 'retro'
                ? 'linear-gradient(180deg, #302018 0%, #1a100c 100%)'
                : category === 'pixel'
                  ? 'linear-gradient(180deg, #182030 0%, #0c1018 100%)'
                  : 'linear-gradient(180deg, #141828 0%, #0a0c14 100%)',
        }}
      />
    </div>
  )
}
