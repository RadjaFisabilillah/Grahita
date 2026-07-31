"use client"

import { FlaskConical, Leaf, ArrowRight } from "lucide-react"
import { WalkthroughType } from "./walkthrough-modal"
import { cn } from "@/lib/utils"

interface WalkthroughChoiceProps {
  onSelect: (type: WalkthroughType) => void
}

export function WalkthroughChoice({ onSelect }: WalkthroughChoiceProps) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <h2 className="font-headline text-2xl font-bold text-foreground">
          Panduan Pembuatan
        </h2>
        <p className="font-body text-sm text-muted-foreground">
          Pilih jenis fermentasi yang ingin Anda pelajari
        </p>
      </div>

      <div className="space-y-4">
        {/* Eco Enzym Card */}
        <button
          onClick={() => onSelect("ECO_ENZYM")}
          className="w-full text-left group"
        >
          <div
            className={cn(
              "relative p-6 rounded-3xl border shadow-sm hover:shadow-level-1 hover:border-lime/50 active:scale-[0.98] transition-all duration-200",
              "bg-white border-border dark:bg-[#143d32] dark:border-white/10"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-lime/15 flex items-center justify-center">
                <Leaf className="h-7 w-7 text-forest" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-lg font-semibold text-foreground mb-1">
                  Eco Enzym
                </h3>
                <p className="font-body text-sm text-muted-foreground dark:text-white/70 line-clamp-2">
                  Pelajari cara membuat enzim organik dari limbah buah untuk pupuk cair dan pembersih alami.
                </p>
              </div>
              <div className="shrink-0 self-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground dark:text-white/60 group-hover:text-forest dark:group-hover:text-[#eaf06a] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </button>

        {/* POC Card */}
        <button
          onClick={() => onSelect("POC")}
          className="w-full text-left group"
        >
          <div
            className={cn(
              "relative p-6 rounded-3xl border shadow-sm hover:shadow-level-1 hover:border-lime/50 active:scale-[0.98] transition-all duration-200",
              "bg-white border-border dark:bg-[#143d32] dark:border-white/10"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-clay/30 flex items-center justify-center">
                <FlaskConical className="h-7 w-7 text-forest" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-lg font-semibold text-foreground mb-1">
                  POC (Pupuk Organik Cair)
                </h3>
                <p className="font-body text-sm text-muted-foreground dark:text-white/70 line-clamp-2">
                  Pelajari cara membuat pupuk organik cair menggunakan urin sapi dan mikroorganisme aktif.
                </p>
              </div>
              <div className="shrink-0 self-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground dark:text-white/60 group-hover:text-forest dark:group-hover:text-[#eaf06a] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
