import { NextRequest, NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/session"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const session = await requireAdminApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")?.trim() || ""
  const completed = searchParams.get("completed") || ""
  const type = searchParams.get("type") || ""

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { fermentation: { name: { contains: search, mode: "insensitive" } } },
      { fermentation: { user: { email: { contains: search, mode: "insensitive" } } } },
    ]
  }
  if (completed === "true") where.completed = true
  if (completed === "false") where.completed = false
  if (type) where.fermentation = { type }

  const tasks = await db.task.findMany({
    where,
    orderBy: { scheduledDate: "asc" },
    include: {
      fermentation: {
        select: {
          id: true,
          name: true,
          type: true,
          user: { select: { id: true, email: true, name: true } },
        },
      },
    },
  })

  return NextResponse.json({ tasks })
}
