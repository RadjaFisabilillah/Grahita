"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "@/components/features/progress-ring"
import { Fermentation } from "@/types"
import { differenceInDays, parseISO } from "date-fns"
import { Timer, FlaskConical, Droplets } from "lucide-react"

export function FermentationCard({
  fermentation,
  isShared,
}: {
  fermentation: Fermentation
  isShared?: boolean
}) {
  const start = parseISO(fermentation.startDate)
  const end = parseISO(fermentation.endDate)
  const now = new Date()
  const elapsed = differenceInDays(now, start)
  const total = fermentation.totalDays
  const progress = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
  const daysLeft = Math.max(0, differenceInDays(end, now))

  const statusConfig = {
    ACTIVE: { label: "Healthy", variant: "default" as const, accent: "bg-lime dark:bg-secondary" },
    PAUSED: { label: "Standby", variant: "muted" as const, accent: "bg-clay dark:bg-muted" },
    COMPLETED: { label: "Completed", variant: "secondary" as const, accent: "bg-lime/50 dark:bg-secondary/50" },
    ABORTED: { label: "Cancelled", variant: "destructive" as const, accent: "bg-destructive" },
  }
  const config = statusConfig[fermentation.status]

  return (
    <Link href={`/fermentation/${fermentation.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-level-2 transition-shadow cursor-pointer active:scale-[0.99] border-border/60 shadow-level-1">
        <div className="relative">
          <div className={`absolute top-0 left-0 bottom-0 w-1 ${config.accent}`} />
          <CardContent className="p-5 pl-6">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 flex-1 mr-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={config.variant} className="text-[10px]">
                    {config.label}
                  </Badge>
                  {isShared && (
                    <Badge variant="outline" className="text-[10px] bg-clay/20 text-clay-foreground border-clay/30">
                      Shared
                    </Badge>
                  )}
                </div>
                <h4 className="font-headline text-base font-semibold text-foreground truncate">
                  {fermentation.name}
                </h4>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  {fermentation.type === "POC" ? (
                    <span className="inline-flex items-center gap-1">
                      <FlaskConical className="h-3 w-3" /> POC
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Droplets className="h-3 w-3" /> Eco Enzym
                    </span>
                  )}
                  {fermentation.batchCode && ` · ${fermentation.batchCode}`}
                </p>
              </div>
              <ProgressRing progress={progress} size={56} strokeWidth={5} />
            </div>

            <div className="bg-muted/50 rounded-xl p-3 flex items-center justify-between mt-4 border border-border/30">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-forest-light dark:text-secondary" />
                <span className="font-body text-xs text-muted-foreground font-medium">
                  Estimated Completion
                </span>
              </div>
              <span className="font-headline text-sm font-semibold text-foreground">
                {fermentation.status === "COMPLETED"
                  ? "Done"
                  : fermentation.status === "ABORTED"
                  ? "Cancelled"
                  : fermentation.status === "PAUSED"
                  ? "Paused"
                  : `${daysLeft} Days Left`}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
