"use client"

import { useState } from "react"
import { WalkthroughModal } from "./walkthrough-modal"
import { BookOpen, ArrowRight } from "lucide-react"

export function WalkthroughTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left group"
      >
        <div className="relative p-5 rounded-3xl border border-border bg-gradient-to-br from-forest/5 to-lime/10 dark:from-secondary/10 dark:to-secondary/5 shadow-sm hover:shadow-level-1 hover:border-lime/40 active:scale-[0.98] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-forest dark:bg-secondary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white dark:text-secondary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-headline text-base font-semibold text-foreground mb-0.5">
                Panduan Pembuatan
              </h3>
              <p className="font-body text-xs text-muted-foreground line-clamp-1">
                Pelajari cara membuat Eco Enzym dan POC langkah demi langkah
              </p>
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
