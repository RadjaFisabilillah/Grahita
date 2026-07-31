import { Skeleton } from "@/components/ui/skeleton"

export default function NewFermentationLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <Skeleton className="h-5 w-24 rounded bg-muted animate-pulse" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <Skeleton className="h-7 w-48 rounded bg-muted animate-pulse" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded bg-muted animate-pulse" />
          <Skeleton className="h-11 w-full rounded-xl bg-muted animate-pulse" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1 rounded-xl bg-muted animate-pulse" />
            <Skeleton className="h-12 flex-1 rounded-xl bg-muted animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-40 rounded bg-muted animate-pulse" />
          <Skeleton className="h-11 w-full rounded-xl bg-muted animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded bg-muted animate-pulse" />
            <Skeleton className="h-11 w-full rounded-xl bg-muted animate-pulse" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded bg-muted animate-pulse" />
            <Skeleton className="h-11 w-full rounded-xl bg-muted animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded bg-muted animate-pulse" />
          <Skeleton className="h-11 w-full rounded-xl bg-muted animate-pulse" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded bg-muted animate-pulse" />
          <Skeleton className="h-24 w-full rounded-xl bg-muted animate-pulse" />
        </div>

        <Skeleton className="h-11 w-full rounded-2xl bg-muted animate-pulse" />
      </div>
    </div>
  )
}
