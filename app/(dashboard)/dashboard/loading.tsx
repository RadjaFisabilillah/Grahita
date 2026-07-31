import { FermentationSkeleton } from "@/components/features/fermentation-skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <div className="h-9 w-64 rounded bg-muted animate-pulse" />
        <div className="h-5 w-36 rounded bg-muted animate-pulse" />
      </section>
      <section className="space-y-4">
        <div className="h-6 w-36 rounded bg-muted animate-pulse" />
        <FermentationSkeleton />
        <FermentationSkeleton />
        <FermentationSkeleton />
      </section>
    </div>
  )
}
