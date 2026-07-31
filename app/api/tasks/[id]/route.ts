import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { db } from "@/lib/db"
import { z } from "zod"

const patchSchema = z.object({
  completed: z.boolean().optional(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  scheduledDate: z.string().datetime().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  const { id } = await params
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const task = await db.task.findFirst({
    where: { id },
    include: { fermentation: true },
  })
  if (!task || task.fermentation.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await db.task.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  const { id } = await params

  const task = await db.task.findFirst({
    where: { id },
    include: { fermentation: true },
  })
  if (!task || task.fermentation.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await db.task.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
