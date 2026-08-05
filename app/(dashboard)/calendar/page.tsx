import { requireAuth } from "@/lib/session"
import { db } from "@/lib/db"
import { CalendarView } from "@/components/features/calendar-view"
import { Metadata } from "next"
import { serializeDates } from "@/lib/date-serializer"

export const metadata: Metadata = {
  title: "Kalender",
  description: "Lihat jadwal tugas fermentasi POC dan Eco Enzym Anda dalam tampilan kalender.",
}

export default async function CalendarPage() {
  const session = await requireAuth()

  const rawTasks = await db.task.findMany({
    where: {
      OR: [
        { fermentation: { userId: session.user.id } },
        { fermentation: { shares: { some: { userId: session.user.id } } } },
      ],
    },
    include: { fermentation: true },
    orderBy: { scheduledDate: "asc" },
  })

  const tasks = rawTasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    scheduledDate: t.scheduledDate.toISOString(),
    completed: t.completed,
    isCritical: t.isCritical,
    fermentation: {
      id: t.fermentation.id,
      name: t.fermentation.name,
      type: t.fermentation.type,
      status: t.fermentation.status,
    },
  }))

  return <CalendarView tasks={tasks} />
}
