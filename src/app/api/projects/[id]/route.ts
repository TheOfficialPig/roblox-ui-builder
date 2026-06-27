import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSessionUserId } from '@/lib/auth'
import type { ProjectDocument } from '@/lib/core/types'

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  data: z.any().optional(),
  starred: z.boolean().optional(),
  description: z.string().nullable().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const row = await prisma.project.findFirst({
    where: { id, userId },
  })

  if (!row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const project = row.data as unknown as ProjectDocument
  project.name = row.name
  project.updatedAt = row.updatedAt.toISOString()

  return NextResponse.json({ project })
}

export async function PUT(
  request: Request,
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

  try {
    const body = updateSchema.parse(await request.json())
    const doc = body.data as ProjectDocument | undefined

    await prisma.project.update({
      where: { id },
      data: {
        name: body.name ?? doc?.name ?? existing.name,
        description: body.description ?? doc?.description ?? existing.description,
        starred: body.starred ?? existing.starred,
        data: (doc ?? existing.data) as Prisma.InputJsonValue,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('Update project error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
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

  await prisma.project.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
