import { db } from "@/lib/db"
import { requireAuth } from "@/lib/session"
import { notFound } from "next/navigation"
import { FermentationDetail } from "@/components/features/fermentation-detail"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Detail Fermentasi",
  description: "Lihat detail progres fermentasi, tugas jadwal, dan riwayat fermentasi Anda.",
}

export default async function FermentationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await requireAuth()
  const { id } = await params

  const raw = await db.fermentation.findUnique({
    where: { id, userId: session.user.id },
    include: { tasks: { orderBy: { scheduledDate: "asc" } } },
  })

  if (!raw) {
    notFound()
  }

  const fermentation = {
    ...raw,
    startDate: raw.startDate.toISOString(),
    endDate: raw.endDate.toISOString(),
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
    tasks: raw.tasks.map((t) => ({
      ...t,
      scheduledDate: t.scheduledDate.toISOString(),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
  }

  return <FermentationDetail fermentation={fermentation} />
}
