import { Skeleton } from "@/components/ui/skeleton"

export default function FermentationDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <Skeleton className="h-5 w-24 rounded bg-muted animate-pulse" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-14 h-14 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded bg-muted animate-pulse" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded bg-muted animate-pulse" />
                <Skeleton className="h-5 w-20 rounded-full bg-muted animate-pulse" />
              </div>
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full bg-muted animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 rounded-xl bg-muted animate-pulse" />
          <Skeleton className="h-20 rounded-xl bg-muted animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20 rounded bg-muted animate-pulse" />
            <Skeleton className="h-4 w-24 rounded bg-muted animate-pulse" />
          </div>
          <Skeleton className="h-3 w-full rounded-full bg-muted animate-pulse" />
        </div>

        <Skeleton className="h-20 rounded-xl bg-muted animate-pulse" />

        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded bg-muted animate-pulse" />
          <Skeleton className="h-9 w-24 rounded bg-muted animate-pulse" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <Skeleton className="h-7 w-40 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
              <Skeleton className="w-5 h-5 rounded-full bg-muted animate-pulse mt-0.5" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48 rounded bg-muted animate-pulse" />
                <Skeleton className="h-3 w-32 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
