import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/lib/auth'
import type { ProjectDocument } from '@/lib/core/types'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.project.findFirst({ where: { id, userId } })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const source = existing.data as unknown as ProjectDocument
  const copy: ProjectDocument = {
    ...source,
    id: crypto.randomUUID(),
    name: `${existing.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const project = await prisma.project.create({
    data: {
      id: copy.id,
      name: copy.name,
      description: copy.description,
      data: copy as unknown as Prisma.InputJsonValue,
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      starred: true,
      thumbnail: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({
    project: {
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    },
  })
}
