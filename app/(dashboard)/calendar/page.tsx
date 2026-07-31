import { requireAuth } from "@/lib/session"
import { db } from "@/lib/db"
import { CalendarView } from "@/components/features/calendar-view"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kalender",
  description: "Lihat jadwal tugas fermentasi POC dan Eco Enzym Anda dalam tampilan kalender.",
}

export default async function CalendarPage() {
  const session = await requireAuth()

  const rawTasks = await db.task.findMany({
    where: {
      fermentation: { userId: session.user.id },
    },
    include: { fermentation: true },
    orderBy: { scheduledDate: "asc" },
  })

  const tasks = rawTasks.map((t) => ({
    ...t,
    scheduledDate: t.scheduledDate.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    fermentation: {
      name: t.fermentation.name,
      type: t.fermentation.type,
    },
  }))

  return <CalendarView tasks={tasks} />
}
