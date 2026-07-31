import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <Skeleton className="h-9 w-40 rounded bg-muted animate-pulse" />
        <Skeleton className="h-5 w-64 rounded bg-muted animate-pulse" />
      </section>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <Skeleton className="h-6 w-16 rounded bg-muted animate-pulse" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-48 rounded bg-muted animate-pulse" />
              <Skeleton className="h-3 w-32 rounded bg-muted animate-pulse" />
            </div>
          </div>
          <Skeleton className="h-px w-full bg-muted animate-pulse" />
          <Skeleton className="h-9 w-24 rounded bg-muted animate-pulse" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <Skeleton className="h-6 w-24 rounded bg-muted animate-pulse" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-40 rounded bg-muted animate-pulse" />
              <Skeleton className="h-3 w-48 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <Skeleton className="h-6 w-32 rounded bg-muted animate-pulse" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 rounded bg-muted animate-pulse" />
                <Skeleton className="h-3 w-40 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>
          <Skeleton className="h-px w-full bg-muted animate-pulse" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 rounded bg-muted animate-pulse" />
                <Skeleton className="h-3 w-40 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
