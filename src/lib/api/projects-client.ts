import type { ProjectDocument } from '@/lib/core/types'

export interface ProjectListItem {
  id: string
  name: string
  description?: string | null
  starred: boolean
  thumbnail?: string | null
  createdAt: string
  updatedAt: string
}

export async function fetchProjects(): Promise<ProjectListItem[]> {
  const res = await fetch('/api/projects', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load projects')
  const data = (await res.json()) as { projects: ProjectListItem[] }
  return data.projects
}

export async function fetchProject(id: string): Promise<ProjectDocument> {
  const res = await fetch(`/api/projects/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Project not found')
  const data = (await res.json()) as { project: ProjectDocument }
  return data.project
}

export async function createProjectApi(
  project: ProjectDocument,
): Promise<ProjectListItem> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: project.name, data: project }),
  })
  if (!res.ok) throw new Error('Failed to create project')
  const data = (await res.json()) as { project: ProjectListItem }
  return data.project
}

export async function saveProjectApi(project: ProjectDocument): Promise<void> {
  const res = await fetch(`/api/projects/${project.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: project.name,
      data: project,
      starred: false,
    }),
  })
  if (!res.ok) throw new Error('Failed to save project')
}

export async function deleteProjectApi(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete project')
}

export async function duplicateProjectApi(id: string): Promise<ProjectListItem> {
  const res = await fetch(`/api/projects/${id}/duplicate`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to duplicate project')
  const data = (await res.json()) as { project: ProjectListItem }
  return data.project
}

export async function toggleStarApi(id: string, starred: boolean): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ starred }),
  })
  if (!res.ok) throw new Error('Failed to update project')
}
