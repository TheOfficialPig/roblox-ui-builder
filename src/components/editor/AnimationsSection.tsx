'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { UIElement } from '@/lib/core/types'
import { useEditorStore } from '@/lib/store/editor-store'
import { CheckboxInput, NumberInput, PropRow, PropSection, SelectInput } from './PropInputs'

export function AnimationsSection({ element }: { element: UIElement }) {
  const animations = useEditorStore((s) =>
    s.project.animations.filter((a) => a.elementId === element.id),
  )
  const addAnimation = useEditorStore((s) => s.addAnimation)
  const updateAnimation = useEditorStore((s) => s.updateAnimation)
  const removeAnimation = useEditorStore((s) => s.removeAnimation)

  return (
    <PropSection title="Animations" defaultOpen={animations.length > 0}>
      <button
        type="button"
        onClick={() => addAnimation(element.id)}
        className="mb-2 flex w-full items-center justify-center gap-1 rounded border border-dashed border-studio-border py-1.5 text-xs text-studio-muted hover:border-studio-accent hover:text-white"
      >
        <Plus className="h-3 w-3" />
        Add animation
      </button>
      {animations.map((anim) => (
        <div key={anim.id} className="mb-2 rounded border border-studio-border bg-studio-bg/40 p-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-white">{anim.name}</span>
            <button type="button" onClick={() => removeAnimation(anim.id)} className="text-studio-muted hover:text-red-400">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <PropRow label="Property">
            <SelectInput
              value={anim.property}
            options={[
              { value: 'Position', label: 'Position' },
              { value: 'Size', label: 'Size' },
              { value: 'BackgroundTransparency', label: 'Transparency' },
              { value: 'Rotation', label: 'Rotation' },
            ]}
              onChange={(property) =>
                updateAnimation(anim.id, { property: property as typeof anim.property })
              }
            />
          </PropRow>
          <PropRow label="Duration">
            <NumberInput
              value={anim.duration}
              step={0.05}
              min={0}
              onChange={(duration) => updateAnimation(anim.id, { duration })}
            />
          </PropRow>
          {anim.property === 'BackgroundTransparency' && (
            <PropRow label="Target Alpha">
              <NumberInput
                value={anim.targetTransparency ?? 0}
                step={0.05}
                min={0}
                max={1}
                onChange={(targetTransparency) => updateAnimation(anim.id, { targetTransparency })}
              />
            </PropRow>
          )}
          <PropRow label="Auto Play">
            <CheckboxInput
              value={anim.autoPlay}
              onChange={(autoPlay) => updateAnimation(anim.id, { autoPlay })}
            />
          </PropRow>
          <PropRow label="Loop">
            <CheckboxInput
              value={anim.loop}
              onChange={(loop) => updateAnimation(anim.id, { loop })}
            />
          </PropRow>
        </div>
      ))}
    </PropSection>
  )
}
