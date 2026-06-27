import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type {
  CanvasViewport,
  DevicePreview,
  ProjectAsset,
  ProjectDocument,
  ProjectTheme,
  RobloxClassName,
  SavedComponent,
  UIAnimation,
  UIElement,
} from '../core/types'
import { DEVICE_PRESETS } from '../core/types'
import { resizeProjectElements } from '../core/device-resize'
import { createComponentFromSelection, insertComponentIntoProject } from '../core/components'
import { BUILTIN_COMPONENTS } from '../core/builtin-components'
import { applyLookPreset } from '../core/look-presets'
import { applyThemeToElement } from '../core/theme'
import { createElement, createEmptyProject, normalizeProject } from '../core/defaults'
import { getParentDimensions, isGuiObject, udim2Offset } from '../core/utils'
import { v4 as uuidv4 } from 'uuid'

const MAX_HISTORY = 50

interface ClipboardData {
  elements: UIElement[]
  rootIds: string[]
}

interface EditorState {
  project: ProjectDocument
  selectedIds: string[]
  viewport: CanvasViewport
  gridEnabled: boolean
  snapEnabled: boolean
  gridSize: number
  showGuides: boolean
  leftPanelTab: 'explorer' | 'layers' | 'assets' | 'components'
  isDragging: boolean
  isPanning: boolean
  mousePosition: { x: number; y: number }
  snapGuides: Array<{ orientation: 'horizontal' | 'vertical'; position: number }>
  clipboard: ClipboardData | null
  history: ProjectDocument[]
  historyIndex: number
  isDirty: boolean
}

interface EditorActions {
  loadProject: (project: ProjectDocument) => void
  newProject: (name?: string) => void
  setProjectName: (name: string) => void
  select: (ids: string[], additive?: boolean) => void
  clearSelection: () => void
  addElement: (className: RobloxClassName, parentId?: string | null) => string
  updateElement: (id: string, updates: Partial<UIElement>) => void
  deleteSelected: () => void
  duplicateSelected: () => void
  copySelected: () => void
  paste: () => void
  setParent: (childId: string, newParentId: string | null, index?: number) => void
  reorderChild: (parentId: string, fromIndex: number, toIndex: number) => void
  toggleLock: (id: string) => void
  toggleVisibility: (id: string) => void
  toggleCollapse: (id: string) => void
  groupSelected: () => void
  setDevicePreview: (device: DevicePreview) => void
  setViewport: (viewport: Partial<CanvasViewport>) => void
  setGridEnabled: (enabled: boolean) => void
  setSnapEnabled: (enabled: boolean) => void
  setGridSize: (size: number) => void
  setLeftPanelTab: (tab: EditorState['leftPanelTab']) => void
  setMousePosition: (x: number, y: number) => void
  setSnapGuides: (guides: EditorState['snapGuides']) => void
  setIsDragging: (dragging: boolean) => void
  setIsPanning: (panning: boolean) => void
  undo: () => void
  redo: () => void
  pushHistory: () => void
  markClean: () => void
  loadTemplate: (project: ProjectDocument) => void
  setTheme: (theme: ProjectTheme) => void
  applyThemeToSelected: (role?: 'surface' | 'raised' | 'primary' | 'secondary' | 'accent') => void
  applyLookToSelected: (presetId: string) => void
  saveSelectionAsComponent: (name: string) => void
  insertComponent: (componentId: string, parentId?: string | null) => void
  deleteComponent: (componentId: string) => void
  addAsset: (name: string, rbxAssetId: string) => void
  removeAsset: (assetId: string) => void
  applyAssetToSelected: (assetId: string) => void
  addAnimation: (elementId: string) => string
  updateAnimation: (id: string, updates: Partial<UIAnimation>) => void
  removeAnimation: (id: string) => void
}

function cloneProject(project: ProjectDocument): ProjectDocument {
  return JSON.parse(JSON.stringify(project))
}

function removeElementTree(
  elements: Record<string, UIElement>,
  id: string,
): Record<string, UIElement> {
  const element = elements[id]
  if (!element) return elements

  const next = { ...elements }
  for (const childId of element.children) {
    Object.assign(next, removeElementTree(next, childId))
  }
  delete next[id]
  return next
}

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set, get) => ({
    project: createEmptyProject(),
    selectedIds: [],
    viewport: { zoom: 1, panX: 0, panY: 0 },
    gridEnabled: true,
    snapEnabled: true,
    gridSize: 8,
    showGuides: true,
    leftPanelTab: 'explorer',
    isDragging: false,
    isPanning: false,
    mousePosition: { x: 0, y: 0 },
    snapGuides: [],
    clipboard: null,
    history: [],
    historyIndex: -1,
    isDirty: false,

    loadProject: (project) =>
      set((state) => {
        const normalized = normalizeProject(cloneProject(project))
        state.project = normalized
        state.selectedIds = []
        state.history = [cloneProject(normalized)]
        state.historyIndex = 0
        state.isDirty = false
        const device = DEVICE_PRESETS[normalized.devicePreview]
        const zoom = Math.min(1.25, 720 / device.width)
        state.viewport = { zoom, panX: 60, panY: 32 }
      }),

    newProject: (name) =>
      set((state) => {
        const project = createEmptyProject(name)
        state.project = project
        state.selectedIds = []
        state.history = [cloneProject(project)]
        state.historyIndex = 0
        state.isDirty = false
      }),

    setProjectName: (name) =>
      set((state) => {
        state.project.name = name
        state.project.updatedAt = new Date().toISOString()
        state.isDirty = true
      }),

    select: (ids, additive = false) =>
      set((state) => {
        if (additive) {
          const combined = new Set([...state.selectedIds, ...ids])
          state.selectedIds = [...combined]
        } else {
          state.selectedIds = ids
        }
      }),

    clearSelection: () => set((state) => { state.selectedIds = [] }),

    pushHistory: () =>
      set((state) => {
        const snapshot = cloneProject(state.project)
        state.history = state.history.slice(0, state.historyIndex + 1)
        state.history.push(snapshot)
        if (state.history.length > MAX_HISTORY) state.history.shift()
        else state.historyIndex++
        state.isDirty = true
      }),

    addElement: (className, parentId) => {
      const element = createElement(className)
      const { selectedIds, project } = get()
      const targetParentId = parentId ?? selectedIds[0] ?? project.rootIds[0] ?? null
      const device = DEVICE_PRESETS[project.devicePreview]

      if (isGuiObject(element) && element.className !== 'ScreenGui' && targetParentId) {
        const { parentWidth, parentHeight } = getParentDimensions(
          { ...element, parentId: targetParentId },
          project.elements,
          device.width,
          device.height,
        )
        const w = element.size.xOffset || 160
        const h = element.size.yOffset || 80
        element.position = udim2Offset(
          Math.max(0, Math.round((parentWidth - w) / 2)),
          Math.max(0, Math.round((parentHeight - h) / 2)),
        )
      }

      set((state) => {
        state.project.elements[element.id] = element
        state.project.updatedAt = new Date().toISOString()

        if (targetParentId && state.project.elements[targetParentId]) {
          element.parentId = targetParentId
          state.project.elements[targetParentId].children.push(element.id)
        } else if (className === 'ScreenGui') {
          element.parentId = null
          state.project.rootIds.push(element.id)
        }

        state.selectedIds = [element.id]
      })

      get().pushHistory()
      return element.id
    },

    updateElement: (id, updates) => {
      set((state) => {
        const el = state.project.elements[id]
        if (!el || el.locked) return
        Object.assign(el, updates)
        state.project.updatedAt = new Date().toISOString()
      })
    },

    deleteSelected: () => {
      const { selectedIds, project } = get()
      if (selectedIds.length === 0) return

      set((state) => {
        for (const id of selectedIds) {
          const element = state.project.elements[id]
          if (!element || element.className === 'ScreenGui') continue

          if (element.parentId) {
            const parent = state.project.elements[element.parentId]
            if (parent) {
              parent.children = parent.children.filter((c) => c !== id)
            }
          } else {
            state.project.rootIds = state.project.rootIds.filter((r) => r !== id)
          }

          state.project.elements = removeElementTree(state.project.elements, id)
        }
        state.selectedIds = []
        state.project.updatedAt = new Date().toISOString()
      })

      get().pushHistory()
    },

    duplicateSelected: () => {
      const { selectedIds, project } = get()
      if (selectedIds.length === 0) return

      const newIds: string[] = []

      set((state) => {
        for (const id of selectedIds) {
          const original = state.project.elements[id]
          if (!original) continue

          const clone = createElement(original.className, {
            ...JSON.parse(JSON.stringify(original)),
            id: undefined,
            name: `${original.name}_Copy`,
            children: [],
            position: udim2Offset(
              original.position.xOffset + 16,
              original.position.yOffset + 16,
            ),
          })

          state.project.elements[clone.id] = clone
          newIds.push(clone.id)

          if (original.parentId && state.project.elements[original.parentId]) {
            clone.parentId = original.parentId
            state.project.elements[original.parentId].children.push(clone.id)
          }
        }
        state.selectedIds = newIds
        state.project.updatedAt = new Date().toISOString()
      })

      get().pushHistory()
    },

    copySelected: () => {
      const { selectedIds, project } = get()
      if (selectedIds.length === 0) return

      const elements = selectedIds
        .map((id) => project.elements[id])
        .filter(Boolean)
        .map((el) => JSON.parse(JSON.stringify(el)) as UIElement)

      set((state) => {
        state.clipboard = { elements, rootIds: selectedIds }
      })
    },

    paste: () => {
      const { clipboard } = get()
      if (!clipboard) return

      const newIds: string[] = []

      set((state) => {
        for (const el of clipboard.elements) {
          const clone = createElement(el.className, {
            ...el,
            id: undefined,
            name: `${el.name}_Copy`,
            children: [],
            position: udim2Offset(el.position.xOffset + 16, el.position.yOffset + 16),
          })
          state.project.elements[clone.id] = clone
          newIds.push(clone.id)

          if (el.parentId && state.project.elements[el.parentId]) {
            clone.parentId = el.parentId
            state.project.elements[el.parentId].children.push(clone.id)
          }
        }
        state.selectedIds = newIds
        state.project.updatedAt = new Date().toISOString()
      })

      get().pushHistory()
    },

    setParent: (childId, newParentId, index) => {
      set((state) => {
        const child = state.project.elements[childId]
        if (!child) return

        if (child.parentId) {
          const oldParent = state.project.elements[child.parentId]
          if (oldParent) {
            oldParent.children = oldParent.children.filter((c) => c !== childId)
          }
        } else {
          state.project.rootIds = state.project.rootIds.filter((r) => r !== childId)
        }

        child.parentId = newParentId

        if (newParentId && state.project.elements[newParentId]) {
          const parent = state.project.elements[newParentId]
          if (index !== undefined) parent.children.splice(index, 0, childId)
          else parent.children.push(childId)
        } else if (child.className === 'ScreenGui') {
          state.project.rootIds.push(childId)
        }

        state.project.updatedAt = new Date().toISOString()
      })
      get().pushHistory()
    },

    reorderChild: (parentId, fromIndex, toIndex) => {
      set((state) => {
        const parent = state.project.elements[parentId]
        if (!parent) return
        const [item] = parent.children.splice(fromIndex, 1)
        parent.children.splice(toIndex, 0, item)
        state.project.updatedAt = new Date().toISOString()
      })
      get().pushHistory()
    },

    toggleLock: (id) => {
      set((state) => {
        const el = state.project.elements[id]
        if (el) el.locked = !el.locked
      })
      get().pushHistory()
    },

    toggleVisibility: (id) => {
      set((state) => {
        const el = state.project.elements[id]
        if (el) el.visible = !el.visible
      })
      get().pushHistory()
    },

    toggleCollapse: (id) => {
      set((state) => {
        const el = state.project.elements[id]
        if (el) el.collapsed = !el.collapsed
      })
    },

    groupSelected: () => {
      const { selectedIds, project } = get()
      if (selectedIds.length < 2) return

      const folder = createElement('Folder', { name: 'Group', isLayerGroup: true })

      set((state) => {
        state.project.elements[folder.id] = folder
        const firstSelected = state.project.elements[selectedIds[0]]
        folder.parentId = firstSelected?.parentId ?? null

        if (folder.parentId) {
          const parent = state.project.elements[folder.parentId]
          if (parent) parent.children.push(folder.id)
        }

        for (const id of selectedIds) {
          const el = state.project.elements[id]
          if (!el) continue
          if (el.parentId) {
            const parent = state.project.elements[el.parentId]
            if (parent) parent.children = parent.children.filter((c) => c !== id)
          }
          el.parentId = folder.id
          folder.children.push(id)
        }

        state.selectedIds = [folder.id]
        state.project.updatedAt = new Date().toISOString()
      })

      get().pushHistory()
    },

    setDevicePreview: (device) => {
      const from = get().project.devicePreview
      if (from === device) return

      set((state) => {
        const newPreset = DEVICE_PRESETS[device]
        resizeProjectElements(state.project.elements, from, device)
        state.project.devicePreview = device
        state.project.updatedAt = new Date().toISOString()
        state.isDirty = true
        const zoom = Math.min(1.25, 720 / newPreset.width)
        state.viewport = { zoom, panX: 60, panY: 32 }
      })
      get().pushHistory()
    },

    setViewport: (viewport) =>
      set((state) => {
        Object.assign(state.viewport, viewport)
      }),

    setGridEnabled: (enabled) => set((state) => { state.gridEnabled = enabled }),
    setSnapEnabled: (enabled) => set((state) => { state.snapEnabled = enabled }),
    setGridSize: (size) => set((state) => { state.gridSize = size }),
    setLeftPanelTab: (tab) => set((state) => { state.leftPanelTab = tab }),
    setMousePosition: (x, y) => set((state) => { state.mousePosition = { x, y } }),
    setSnapGuides: (guides) => set((state) => { state.snapGuides = guides }),
    setIsDragging: (dragging) => set((state) => { state.isDragging = dragging }),
    setIsPanning: (panning) => set((state) => { state.isPanning = panning }),

    undo: () =>
      set((state) => {
        if (state.historyIndex <= 0) return
        state.historyIndex--
        state.project = cloneProject(state.history[state.historyIndex])
        state.selectedIds = []
        state.isDirty = true
      }),

    redo: () =>
      set((state) => {
        if (state.historyIndex >= state.history.length - 1) return
        state.historyIndex++
        state.project = cloneProject(state.history[state.historyIndex])
        state.selectedIds = []
        state.isDirty = true
      }),

    markClean: () => set((state) => { state.isDirty = false }),

    loadTemplate: (project) => {
      get().loadProject(project)
      get().pushHistory()
    },

    setTheme: (theme) =>
      set((state) => {
        state.project.theme = theme
        state.project.updatedAt = new Date().toISOString()
        state.isDirty = true
      }),

    applyThemeToSelected: (role = 'surface') => {
      const { selectedIds, project } = get()
      if (selectedIds.length === 0) return
      set((state) => {
        for (const id of selectedIds) {
          const el = state.project.elements[id]
          if (!el) continue
          Object.assign(el, applyThemeToElement(el, state.project.theme, role))
        }
        state.project.updatedAt = new Date().toISOString()
      })
      get().pushHistory()
    },

    applyLookToSelected: (presetId) => {
      const { selectedIds } = get()
      if (selectedIds.length === 0) return
      set((state) => {
        for (const id of selectedIds) {
          const el = state.project.elements[id]
          if (!el) continue
          Object.assign(el, applyLookPreset(el, presetId))
        }
        state.project.updatedAt = new Date().toISOString()
      })
      get().pushHistory()
    },

    saveSelectionAsComponent: (name) => {
      const { selectedIds, project } = get()
      const component = createComponentFromSelection(project.elements, selectedIds, name)
      if (!component) return
      set((state) => {
        state.project.components.push(component)
        state.project.updatedAt = new Date().toISOString()
      })
      get().pushHistory()
    },

    insertComponent: (componentId, parentId) => {
      const { project, selectedIds } = get()
      const component =
        project.components.find((c) => c.id === componentId) ??
        BUILTIN_COMPONENTS.find((c) => c.id === componentId)
      if (!component) return
      const targetParentId = parentId ?? selectedIds[0] ?? project.rootIds[0]
      if (!targetParentId) return

      set((state) => {
        const inserted = insertComponentIntoProject(
          state.project.elements,
          component,
          targetParentId,
          16,
          16,
        )
        state.selectedIds = inserted
        state.project.updatedAt = new Date().toISOString()
      })
      get().pushHistory()
    },

    deleteComponent: (componentId) =>
      set((state) => {
        state.project.components = state.project.components.filter((c) => c.id !== componentId)
        state.project.updatedAt = new Date().toISOString()
      }),

    addAsset: (name, rbxAssetId) =>
      set((state) => {
        state.project.assets.push({
          id: uuidv4(),
          name,
          rbxAssetId: rbxAssetId.startsWith('rbxasset') ? rbxAssetId : `rbxassetid://${rbxAssetId.replace(/\D/g, '')}`,
        })
        state.project.updatedAt = new Date().toISOString()
      }),

    removeAsset: (assetId) =>
      set((state) => {
        state.project.assets = state.project.assets.filter((a) => a.id !== assetId)
        state.project.updatedAt = new Date().toISOString()
      }),

    applyAssetToSelected: (assetId) => {
      const asset = get().project.assets.find((a) => a.id === assetId)
      if (!asset) return
      const { selectedIds } = get()
      set((state) => {
        for (const id of selectedIds) {
          const el = state.project.elements[id]
          if (!el || !['ImageLabel', 'ImageButton'].includes(el.className)) continue
          el.image = asset.rbxAssetId
        }
        state.project.updatedAt = new Date().toISOString()
      })
      get().pushHistory()
    },

    addAnimation: (elementId) => {
      const anim: UIAnimation = {
        id: uuidv4(),
        elementId,
        name: 'Fade In',
        enabled: true,
        property: 'BackgroundTransparency',
        targetTransparency: 0,
        duration: 0.4,
        delay: 0,
        easingStyle: 'Quad',
        easingDirection: 'Out',
        loop: false,
        autoPlay: true,
      }
      set((state) => {
        state.project.animations.push(anim)
        state.project.updatedAt = new Date().toISOString()
      })
      get().pushHistory()
      return anim.id
    },

    updateAnimation: (id, updates) =>
      set((state) => {
        const anim = state.project.animations.find((a) => a.id === id)
        if (anim) Object.assign(anim, updates)
        state.project.updatedAt = new Date().toISOString()
      }),

    removeAnimation: (id) =>
      set((state) => {
        state.project.animations = state.project.animations.filter((a) => a.id !== id)
        state.project.updatedAt = new Date().toISOString()
      }),
  })),
)

export function useCanUndo() {
  return useEditorStore((s) => s.historyIndex > 0)
}

export function useCanRedo() {
  return useEditorStore((s) => s.historyIndex < s.history.length - 1)
}
