import { requireAuth } from "@/lib/session"
import { db } from "@/lib/db"
import { FermentationCard } from "@/components/features/fermentation-card"
import { ActionRequiredCard } from "@/components/features/action-required-card"
import { WalkthroughTrigger } from "@/components/features/walkthrough-trigger"
import { JoinBatchForm } from "@/components/features/join-batch-form"
import { FlaskConical, Plus } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"
import { serializeDates } from "@/lib/date-serializer"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Pantau proses fermentasi POC dan Eco Enzym Anda. Lihat tugas yang perlu dikerjakan dan status fermentasi aktif.",
}

export default async function DashboardPage() {
  const session = await requireAuth()

  const rawFermentations = await db.fermentation.findMany({
    where: { userId: session.user.id },
    include: { tasks: true },
    orderBy: { createdAt: "desc" },
  })

  const shared = await db.fermentationShare.findMany({
    where: { userId: session.user.id },
    include: {
      fermentation: {
        include: { tasks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const ownFermentations = rawFermentations.map((f) => serializeDates(f))
  const sharedFermentations = shared.map((s) => serializeDates(s.fermentation))
  const allFermentations = [...ownFermentations, ...sharedFermentations]

  const activeCount = allFermentations.filter((f) => f.status === "ACTIVE").length

  const urgentTask = await db.task.findFirst({
    where: {
      completed: false,
      OR: [
        { fermentation: { userId: session.user.id } },
        { fermentation: { shares: { some: { userId: session.user.id } } } },
      ],
    },
    include: { fermentation: true },
    orderBy: { scheduledDate: "asc" },
  })

  const urgentTaskData = urgentTask
    ? {
        id: urgentTask.id,
        title: urgentTask.title,
        description: urgentTask.description,
        fermentationName: urgentTask.fermentation.name,
      }
    : null

  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <h2 className="font-headline text-[28px] font-bold text-foreground leading-tight">
          Hello, {session.user.name || session.user.email}!
        </h2>
        <p className="font-body text-base text-muted-foreground">
          {activeCount} Fermentasi Aktif
        </p>
      </section>

      <WalkthroughTrigger />

      {urgentTaskData && (
        <section className="space-y-4">
          <h3 className="font-headline text-lg font-semibold text-foreground">
            Action Required
          </h3>
          <ActionRequiredCard task={urgentTaskData} />
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-lg font-semibold text-foreground">
            Active Fermentations
          </h3>
          <JoinBatchForm />
        </div>

        {allFermentations.length === 0 ? (
          <div className="text-center py-16 px-5 rounded-3xl border border-dashed border-border bg-card">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FlaskConical className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-headline text-lg font-semibold text-foreground mb-1">
              Belum Ada Fermentasi
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Mulai pantau proses POC atau Eco Enzym Anda dengan menekan tombol + di bawah.
            </p>
            <Link
              href="/fermentation/new"
              className="inline-flex items-center gap-2 bg-forest dark:bg-secondary text-white dark:text-secondary-foreground font-headline font-semibold text-sm px-5 py-3 rounded-2xl shadow-level-1 hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus className="h-5 w-5" />
              Tambah Fermentasi
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {allFermentations.map((f) => (
              <FermentationCard key={f.id} fermentation={f} isShared={f.userId !== session.user.id} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
