import { NextResponse } from "next/server"
import { requireAuthApi } from "@/lib/session"
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
  const session = await requireAuthApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    // Allow owner or shared users to edit
    const fermentation = await db.fermentation.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          { shares: { some: { userId: session.user.id } } },
        ],
      },
    })
    if (!fermentation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const data: Record<string, unknown> = { ...parsed.data }

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
  } catch {
    return NextResponse.json({ error: "Failed to update fermentation" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuthApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    // Only owner can delete
    const fermentation = await db.fermentation.findUnique({
      where: { id, userId: session.user.id },
    })
    if (!fermentation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await db.fermentation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete fermentation" }, { status: 500 })
  }
}
