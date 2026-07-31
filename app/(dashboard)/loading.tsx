import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <Skeleton className="h-9 w-64 rounded bg-muted animate-pulse" />
        <Skeleton className="h-5 w-36 rounded bg-muted animate-pulse" />
      </section>
      <section className="space-y-4">
        <Skeleton className="h-6 w-36 rounded bg-muted animate-pulse" />
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48 rounded bg-muted animate-pulse" />
              <Skeleton className="h-4 w-32 rounded bg-muted animate-pulse" />
            </div>
            <Skeleton className="h-9 w-16 rounded bg-muted animate-pulse shrink-0" />
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <Skeleton className="h-6 w-36 rounded bg-muted animate-pulse" />
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="w-14 h-14 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40 rounded bg-muted animate-pulse" />
                <Skeleton className="h-4 w-24 rounded bg-muted animate-pulse" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="w-14 h-14 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40 rounded bg-muted animate-pulse" />
                <Skeleton className="h-4 w-24 rounded bg-muted animate-pulse" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
