import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/lib/auth'
import type { ProjectDocument } from '@/lib/core/types'

const createSchema = z.object({
  name: z.string().min(1).max(200),
  data: z.any(),
})

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
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
    projects: projects.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
  })
}

export async function POST(request: Request) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = createSchema.parse(await request.json())
    const doc = body.data as ProjectDocument

    const project = await prisma.project.create({
      data: {
        id: doc.id,
        name: body.name,
        description: doc.description,
        data: doc as unknown as Prisma.InputJsonValue,
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

    return NextResponse.json(
      {
        project: {
          ...project,
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
