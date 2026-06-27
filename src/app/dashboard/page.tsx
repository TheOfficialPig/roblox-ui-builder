'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Plus,
  Star,
  FolderOpen,
  Copy,
  Trash2,
  Search,
  Layers,
  LayoutTemplate,
} from 'lucide-react'
import { createEmptyProject } from '@/lib/core/defaults'
import { TEMPLATE_CATALOG } from '@/lib/templates'
import type { ProjectDocument } from '@/lib/core/types'
import {
  createProjectApi,
  deleteProjectApi,
  duplicateProjectApi,
  fetchProjects,
  toggleStarApi,
  type ProjectListItem,
} from '@/lib/api/projects-client'
import { cn } from '@/lib/utils/cn'

export default function DashboardPage() {
  const router = useRouter()
  const { status } = useSession()
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [search, setSearch] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status !== 'authenticated') return

    fetchProjects()
      .then(setProjects)
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [status, router])

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  const createProject = async (doc?: ProjectDocument) => {
    try {
      const project = doc ?? createEmptyProject()
      const created = await createProjectApi(project)
      router.push(`/editor/${created.id}`)
    } catch {
      setError('Failed to create project')
    }
  }

  const duplicateProject = async (id: string) => {
    try {
      const copy = await duplicateProjectApi(id)
      setProjects((prev) => [copy, ...prev])
    } catch {
      setError('Failed to duplicate project')
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await deleteProjectApi(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError('Failed to delete project')
    }
  }

  const toggleStar = async (id: string, starred: boolean) => {
    try {
      await toggleStarApi(id, !starred)
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, starred: !starred } : p)),
      )
    } catch {
      setError('Failed to update project')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] text-gray-400">
        Loading projects...
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-auto bg-[#1e1e1e]">
      <header className="flex items-center justify-between border-b border-[#3c3c3c] px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Layers className="h-5 w-5 text-[#0078d4]" />
            <span className="font-semibold">Roblox UI Builder</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 rounded-md border border-[#3c3c3c] px-3 py-1.5 text-sm text-gray-300 hover:bg-[#2a2d2e]"
          >
            <LayoutTemplate className="h-4 w-4" />
            Templates
          </button>
          <button
            type="button"
            onClick={() => createProject()}
            className="flex items-center gap-2 rounded-md bg-[#0078d4] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1a86d9]"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {showTemplates && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-white">Templates</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATE_CATALOG.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => createProject(template.build())}
                  className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4 text-left transition hover:border-[#0078d4] hover:bg-[#2a2d2e]"
                >
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-[#0078d4]">
                    {template.category}
                  </div>
                  <div className="mb-1 font-medium text-white">{template.name}</div>
                  <div className="text-sm text-gray-400">{template.description}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-[#3c3c3c] bg-[#252526] py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-[#0078d4] focus:outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#3c3c3c] py-16 text-center">
            <FolderOpen className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="mb-4 text-gray-400">No projects yet</p>
            <button
              type="button"
              onClick={() => createProject()}
              className="rounded-md bg-[#0078d4] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a86d9]"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group rounded-lg border border-[#3c3c3c] bg-[#252526] transition hover:border-[#0078d4]/50"
              >
                <Link href={`/editor/${project.id}`} className="block p-4">
                  <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-[#1e1e1e]">
                    <Layers className="h-10 w-10 text-gray-600" />
                  </div>
                  <div className="font-medium text-white">{project.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
                <div className="flex items-center gap-1 border-t border-[#3c3c3c] px-2 py-1">
                  <button
                    type="button"
                    onClick={() => toggleStar(project.id, project.starred)}
                    className="rounded p-1.5 text-gray-400 hover:bg-[#2a2d2e] hover:text-yellow-400"
                  >
                    <Star
                      className={cn('h-4 w-4', project.starred && 'fill-yellow-400 text-yellow-400')}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateProject(project.id)}
                    className="rounded p-1.5 text-gray-400 hover:bg-[#2a2d2e] hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProject(project.id)}
                    className="ml-auto rounded p-1.5 text-gray-400 hover:bg-[#2a2d2e] hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
