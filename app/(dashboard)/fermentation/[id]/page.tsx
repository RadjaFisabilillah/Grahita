import { db } from "@/lib/db"
import { requireAuth } from "@/lib/session"
import { notFound } from "next/navigation"
import { FermentationDetail } from "@/components/features/fermentation-detail"
import { Metadata } from "next"
import { serializeDates } from "@/lib/date-serializer"

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

  const raw = await db.fermentation.findFirst({
    where: {
      id,
      OR: [
        { userId: session.user.id },
        { shares: { some: { userId: session.user.id } } },
      ],
    },
    include: { tasks: { orderBy: { scheduledDate: "asc" } } },
  })

  if (!raw) {
    notFound()
  }

  const fermentation = serializeDates(raw)

  return <FermentationDetail fermentation={fermentation} />
}
