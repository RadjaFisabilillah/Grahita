import { NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/session"
import { db } from "@/lib/db"

export async function GET() {
  const session = await requireAdminApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: { fermentations: true },
      },
    },
  })

  return NextResponse.json({ users })
}
