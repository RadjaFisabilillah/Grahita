"use client"

import { useState, useEffect } from "react"
import { WalkthroughModal } from "./walkthrough-modal"
import { getCompletedWalkthroughs } from "./walkthrough-data"
import { BookOpen, ArrowRight, CheckCircle2, Leaf, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"

export function WalkthroughTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const [completed, setCompleted] = useState<("ECO_ENZYM" | "POC")[]>([])

  useEffect(() => {
    setCompleted(getCompletedWalkthroughs())
  }, [])

  // Refresh completion state when modal closes (user might have finished a walkthrough)
  useEffect(() => {
    if (!isOpen) {
      setCompleted(getCompletedWalkthroughs())
    }
  }, [isOpen])

  const totalGuides = 2
  const completedCount = completed.length
  const hasCompleted = completedCount > 0
  const allCompleted = completedCount === totalGuides

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left group"
      >
        <div
          className={cn(
            "relative p-5 rounded-3xl border shadow-sm hover:shadow-level-1 active:scale-[0.98] transition-all duration-200 overflow-hidden",
            "bg-gradient-to-br from-forest/5 via-lime/10 to-clay/15 dark:from-secondary/10 dark:via-secondary/5 dark:to-[#143d32]",
            "border-border hover:border-lime/40"
          )}
        >
          {/* Subtle decorative glow */}
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-lime/20 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity" />

          <div className="relative flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-forest dark:bg-secondary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white dark:text-secondary-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-headline text-base font-semibold text-foreground">
                  Panduan Pembuatan
                </h3>

                {hasCompleted && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-body text-[10px] font-semibold uppercase tracking-wide",
                      allCompleted
                        ? "bg-lime text-forest"
                        : "bg-forest/10 text-forest dark:bg-white/10 dark:text-white"
                    )}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {completedCount}/{totalGuides} selesai
                  </span>
                )}
              </div>

              <p className="font-body text-xs text-muted-foreground line-clamp-1">
                Pelajari cara membuat Eco Enzym dan POC langkah demi langkah
              </p>

              {hasCompleted && (
                <div className="flex items-center gap-2 mt-2">
                  {completed.includes("ECO_ENZYM") && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-body text-forest dark:text-lime">
                      <Leaf className="h-3 w-3" /> Eco Enzym
                    </span>
                  )}
                  {completed.includes("POC") && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-body text-forest dark:text-lime">
                      <FlaskConical className="h-3 w-3" /> POC
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="shrink-0">
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-forest group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </button>

      <WalkthroughModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
