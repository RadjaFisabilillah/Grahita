import { NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/session"
import { db } from "@/lib/db"
import { startOfDay, endOfDay } from "date-fns"

export async function GET() {
  const session = await requireAdminApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  const [totalUsers, totalFermentations, activeFermentations, tasksToday, tasksCompleted] =
    await Promise.all([
      db.user.count(),
      db.fermentation.count(),
      db.fermentation.count({ where: { status: "ACTIVE" } }),
      db.task.count({
        where: { completed: false, scheduledDate: { gte: todayStart, lte: todayEnd } },
      }),
      db.task.count({ where: { completed: true } }),
    ])

  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  const recentFermentations = await db.fermentation.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      type: true,
      status: true,
      createdAt: true,
      user: { select: { email: true, name: true } },
    },
  })

  return NextResponse.json({
    stats: {
      totalUsers,
      totalFermentations,
      activeFermentations,
      tasksToday,
      tasksCompleted,
    },
    recentUsers,
    recentFermentations,
  })
}
