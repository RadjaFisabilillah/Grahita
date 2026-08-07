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
  const status = searchParams.get("status") || ""
  const type = searchParams.get("type") || ""

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ]
  }
  if (status) where.status = status
  if (type) where.type = type

  const fermentations = await db.fermentation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true, name: true } },
      _count: { select: { tasks: true } },
    },
  })

  return NextResponse.json({ fermentations })
}
