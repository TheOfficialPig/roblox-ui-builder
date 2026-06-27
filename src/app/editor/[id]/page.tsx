'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { EditorLayout } from '@/components/editor/EditorLayout'
import { createEmptyProject } from '@/lib/core/defaults'
import { useEditorStore } from '@/lib/store/editor-store'
import { createProjectApi, fetchProject } from '@/lib/api/projects-client'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const loadProject = useEditorStore((s) => s.loadProject)
  const newProject = useEditorStore((s) => s.newProject)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status !== 'authenticated') return

    const id = params.id as string

    async function init() {
      try {
        if (id === 'new') {
          const project = createEmptyProject()
          const created = await createProjectApi(project)
          router.replace(`/editor/${created.id}`)
          return
        }

        const project = await fetchProject(id)
        loadProject(project)
        setReady(true)
      } catch {
        setError('Project not found or failed to load')
        newProject()
        setReady(true)
      }
    }

    init()
  }, [params.id, loadProject, newProject, router, status])

  if (status === 'loading' || !ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1e1e1e] text-gray-400">
        {error ?? 'Loading editor...'}
      </div>
    )
  }

  return <EditorLayout />
}
