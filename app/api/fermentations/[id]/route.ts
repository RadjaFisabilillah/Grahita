import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { db } from "@/lib/db"
import { z } from "zod"

const patchSchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED", "ABORTED"]).optional(),
  name: z.string().min(1).optional(),
  notes: z.string().nullable().optional(),
  batchCode: z.string().nullable().optional(),
  startDate: z.string().datetime().optional(),
  totalDays: z.number().int().min(1).optional(),
  endDate: z.string().datetime().optional(),
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

  const fermentation = await db.fermentation.findUnique({
    where: { id, userId: session.user.id },
  })
  if (!fermentation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const data: Record<string, unknown> = { ...parsed.data }

  // Auto-calculate endDate if startDate or totalDays changed but endDate not explicitly provided
  if ((data.startDate || data.totalDays) && !data.endDate) {
    const start = data.startDate
      ? new Date(data.startDate as string)
      : fermentation.startDate
    const days = data.totalDays
      ? (data.totalDays as number)
      : fermentation.totalDays
    const end = new Date(start)
    end.setDate(end.getDate() + days)
    data.endDate = end.toISOString()
  }

  const updated = await db.fermentation.update({
    where: { id },
    data,
    include: { tasks: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  const { id } = await params

  const fermentation = await db.fermentation.findUnique({
    where: { id, userId: session.user.id },
  })
  if (!fermentation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await db.fermentation.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
