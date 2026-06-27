import { v4 as uuidv4 } from 'uuid'
import type { SavedComponent, UIElement } from './types'

export function extractSubtree(
  elements: Record<string, UIElement>,
  rootIds: string[],
): { elements: Record<string, UIElement>; rootIds: string[] } {
  const collected: Record<string, UIElement> = {}
  const newRootIds: string[] = []

  function walk(id: string, newParentId: string | null) {
    const el = elements[id]
    if (!el) return
    const copy = JSON.parse(JSON.stringify(el)) as UIElement
    copy.parentId = newParentId
    collected[id] = copy
    for (const childId of el.children) walk(childId, id)
  }

  for (const rootId of rootIds) {
    walk(rootId, null)
    newRootIds.push(rootId)
  }

  return { elements: collected, rootIds: newRootIds }
}

export function cloneSubtreeWithNewIds(
  subtree: { elements: Record<string, UIElement>; rootIds: string[] },
  offsetX = 0,
  offsetY = 0,
): { elements: Record<string, UIElement>; rootIds: string[] } {
  const idMap = new Map<string, string>()
  for (const id of Object.keys(subtree.elements)) {
    idMap.set(id, uuidv4())
  }

  const elements: Record<string, UIElement> = {}
  for (const [oldId, el] of Object.entries(subtree.elements)) {
    const newId = idMap.get(oldId)!
    const copy = JSON.parse(JSON.stringify(el)) as UIElement
    copy.id = newId
    copy.children = el.children.map((c) => idMap.get(c)!).filter(Boolean)
    copy.parentId = el.parentId ? idMap.get(el.parentId) ?? null : null
    if (subtree.rootIds.includes(oldId) && offsetX !== 0) {
      copy.position = {
        ...copy.position,
        xOffset: copy.position.xOffset + offsetX,
        yOffset: copy.position.yOffset + offsetY,
      }
    }
    elements[newId] = copy
  }

  return {
    elements,
    rootIds: subtree.rootIds.map((id) => idMap.get(id)!),
  }
}

export function insertComponentIntoProject(
  projectElements: Record<string, UIElement>,
  component: SavedComponent,
  parentId: string,
  offsetX = 0,
  offsetY = 0,
): string[] {
  const cloned = cloneSubtreeWithNewIds(
    { elements: component.elements, rootIds: component.rootIds },
    offsetX,
    offsetY,
  )

  const parent = projectElements[parentId]
  if (!parent) return []

  for (const el of Object.values(cloned.elements)) {
    projectElements[el.id] = el
  }

  const insertedRootIds: string[] = []
  for (const rootId of cloned.rootIds) {
    const root = projectElements[rootId]
    if (!root) continue
    root.parentId = parentId
    parent.children.push(rootId)
    insertedRootIds.push(rootId)
  }

  return insertedRootIds
}

export function createComponentFromSelection(
  elements: Record<string, UIElement>,
  selectedIds: string[],
  name: string,
): SavedComponent | null {
  if (selectedIds.length === 0) return null

  const topLevel = selectedIds.filter((id) => {
    const el = elements[id]
    if (!el?.parentId) return true
    return !selectedIds.includes(el.parentId)
  })

  const subtree = extractSubtree(elements, topLevel)

  return {
    id: uuidv4(),
    name,
    elements: subtree.elements,
    rootIds: subtree.rootIds,
    createdAt: new Date().toISOString(),
  }
}
