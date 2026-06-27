import type { ExportManifestEntry, ProjectDocument, UIElement } from '../core/types'
import { isGuiObject } from '../core/utils'
import { exportToLua } from './lua'

export interface JsonExportPayload {
  format: 'roblox-ui-builder'
  version: 1
  exportedAt: string
  project: {
    id: string
    name: string
    description?: string
    devicePreview: string
    metadata: {
      generator: string
      generatorVersion: string
      compatiblePluginVersion: string
    }
  }
  hierarchy: JsonNode[]
  elements: Record<string, JsonElement>
}

export interface JsonNode {
  id: string
  children: JsonNode[]
}

export interface JsonElement extends Omit<UIElement, 'children'> {
  exportable: boolean
}

function buildHierarchy(
  elementId: string,
  elements: Record<string, UIElement>,
): JsonNode | null {
  const element = elements[elementId]
  if (!element) return null

  return {
    id: elementId,
    children: element.children
      .map((id) => buildHierarchy(id, elements))
      .filter((n): n is JsonNode => n !== null),
  }
}

export function exportToJson(project: ProjectDocument): JsonExportPayload {
  const jsonElements: Record<string, JsonElement> = {}

  for (const [id, element] of Object.entries(project.elements)) {
    jsonElements[id] = {
      ...element,
      exportable: !element.isLayerGroup,
    }
  }

  return {
    format: 'roblox-ui-builder',
    version: 1,
    exportedAt: new Date().toISOString(),
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      devicePreview: project.devicePreview,
      metadata: {
        generator: 'Roblox UI Builder',
        generatorVersion: '0.1.0',
        compatiblePluginVersion: '1.0.0',
      },
    },
    hierarchy: project.rootIds
      .map((id) => buildHierarchy(id, project.elements))
      .filter((n): n is JsonNode => n !== null),
    elements: jsonElements,
  }
}

export function exportToJsonString(project: ProjectDocument, pretty = true): string {
  return JSON.stringify(exportToJson(project), null, pretty ? 2 : 0)
}

function buildPngManifest(
  elementId: string,
  elements: Record<string, UIElement>,
  parentPath: string,
): ExportManifestEntry[] {
  const element = elements[elementId]
  if (!element || !element.visible) return []

  const safeName = element.name.replace(/[^a-zA-Z0-9_-]/g, '_')
  const isFolder = element.className === 'Folder' || element.isLayerGroup

  if (isFolder) {
    const folderPath = parentPath ? `${parentPath}/${safeName}` : safeName
    const children = element.children.flatMap((id) =>
      buildPngManifest(id, elements, folderPath),
    )
    if (children.length === 0) return []
    return [{ name: safeName, path: folderPath, elementId, isFolder: true, children }]
  }

  if (isGuiObject(element)) {
    const path = parentPath ? `${parentPath}/${safeName}.png` : `${safeName}.png`
    return [{ name: safeName, path, elementId, isFolder: false }]
  }

  return element.children.flatMap((id) => buildPngManifest(id, elements, parentPath))
}

export function buildPngExportManifest(project: ProjectDocument): ExportManifestEntry[] {
  return project.rootIds.flatMap((id) => buildPngManifest(id, project.elements, ''))
}

export async function captureElementAsPng(
  elementId: string,
  options?: { pixelRatio?: number },
): Promise<Blob | null> {
  const el = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement | null
  if (!el) return null

  const { toPng } = await import('html-to-image')
  const dataUrl = await toPng(el, {
    pixelRatio: options?.pixelRatio ?? 2,
    backgroundColor: undefined,
    cacheBust: true,
  })

  const response = await fetch(dataUrl)
  return response.blob()
}

export async function exportPngLayers(
  project: ProjectDocument,
  onProgress?: (current: number, total: number, name: string) => void,
): Promise<Map<string, Blob>> {
  const manifest = buildPngExportManifest(project)
  const flatEntries: ExportManifestEntry[] = []

  function flatten(entries: ExportManifestEntry[]) {
    for (const entry of entries) {
      if (!entry.isFolder) flatEntries.push(entry)
      if (entry.children) flatten(entry.children)
    }
  }
  flatten(manifest)

  const results = new Map<string, Blob>()
  let i = 0

  for (const entry of flatEntries) {
    onProgress?.(i + 1, flatEntries.length, entry.name)
    const blob = await captureElementAsPng(entry.elementId)
    if (blob) results.set(entry.path, blob)
    i++
  }

  return results
}

export async function downloadPngZip(
  project: ProjectDocument,
  onProgress?: (current: number, total: number, name: string) => void,
): Promise<void> {
  const blobs = await exportPngLayers(project, onProgress)

  if (blobs.size === 0) {
    throw new Error('No exportable layers found')
  }

  if (blobs.size === 1) {
    const [path, blob] = [...blobs.entries()][0]
    downloadBlob(blob, path.split('/').pop() ?? 'export.png')
    return
  }

  for (const [path, blob] of blobs) {
    downloadBlob(blob, path.replace(/\//g, '_'))
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  downloadBlob(blob, filename)
}

export function downloadJson(project: ProjectDocument): void {
  downloadText(exportToJsonString(project), `${project.name.replace(/\s+/g, '_')}.json`)
}

export function downloadLua(project: ProjectDocument): void {
  downloadText(exportToLua(project), `${project.name.replace(/\s+/g, '_')}.lua`)
}
