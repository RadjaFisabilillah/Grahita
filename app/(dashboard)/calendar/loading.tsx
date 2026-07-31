import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarLoading() {
  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <Skeleton className="h-9 w-48 rounded bg-muted animate-pulse" />
        <Skeleton className="h-5 w-64 rounded bg-muted animate-pulse" />
      </section>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-8 rounded bg-muted animate-pulse" />
          <Skeleton className="h-6 w-32 rounded bg-muted animate-pulse" />
          <Skeleton className="h-8 w-8 rounded bg-muted animate-pulse" />
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-6 rounded bg-muted animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-7 w-40 rounded bg-muted animate-pulse" />
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <Skeleton className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 rounded bg-muted animate-pulse" />
              <Skeleton className="h-3 w-32 rounded bg-muted animate-pulse" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 rounded bg-muted animate-pulse" />
              <Skeleton className="h-3 w-32 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
