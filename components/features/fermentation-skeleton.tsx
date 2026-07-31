"use client"

import { Card, CardContent } from "@/components/ui/card"

export function FermentationSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60 shadow-level-1">
      <div className="relative">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-muted" />
        <CardContent className="p-5 pl-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 mr-3 space-y-2">
              <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
              <div className="h-5 w-40 rounded bg-muted animate-pulse" />
              <div className="h-3 w-24 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-14 w-14 rounded-full bg-muted animate-pulse" />
          </div>
          <div className="bg-muted/50 rounded-xl p-3 mt-4 border border-border/30">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
              <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
