"use client"

import { motion } from "framer-motion"
import { FlaskConical, Leaf, ArrowRight, Clock, CheckCircle2 } from "lucide-react"
import { WalkthroughType } from "./walkthrough-modal"
import { cn } from "@/lib/utils"

interface WalkthroughChoiceProps {
  onSelect: (type: WalkthroughType) => void
  onSkip?: () => void
}

export function WalkthroughChoice({ onSelect, onSkip }: WalkthroughChoiceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-foreground">
          Mau membuat apa hari ini?
        </h2>
        <p className="font-body text-sm sm:text-base text-muted-foreground max-w-sm mx-auto">
          Pilih panduan yang sesuai dengan fermentasi Anda. Cukup 3–4 menit, langsung praktik.
        </p>
      </div>

      <div className="space-y-4">
        {/* Eco Enzym Card */}
        <ChoiceCard
          type="ECO_ENZYM"
          onSelect={onSelect}
          icon={Leaf}
          title="Eco Enzym"
          description="Pelajari cara membuat enzim organik dari limbah buah untuk pupuk cair dan pembersih alami."
          accent="lime"
          meta={{ steps: 8, duration: "~4 menit", result: "Eco Enzym siap pakai" }}
        />

        {/* POC Card */}
        <ChoiceCard
          type="POC"
          onSelect={onSelect}
          icon={FlaskConical}
          title="POC (Pupuk Organik Cair)"
          description="Pelajari cara membuat pupuk organik cair menggunakan urin sapi dan mikroorganisme aktif."
          accent="clay"
          meta={{ steps: 6, duration: "~3 menit", result: "Pupuk organik cair matang" }}
        />
      </div>

      {/* Skip link */}
      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Lewati panduan
          </button>
        </div>
      )}
    </motion.div>
  )
}

interface ChoiceCardProps {
  type: WalkthroughType
  onSelect: (type: WalkthroughType) => void
  icon: React.ElementType
  title: string
  description: string
  accent: "lime" | "clay"
  meta: { steps: number; duration: string; result: string }
}

function ChoiceCard({
  type,
  onSelect,
  icon: Icon,
  title,
  description,
  accent,
  meta,
}: ChoiceCardProps) {
  const isLime = accent === "lime"

  return (
    <button
      onClick={() => onSelect(type)}
      className="w-full text-left group"
    >
      <div
        className={cn(
          "relative p-5 sm:p-6 rounded-3xl border shadow-sm hover:shadow-level-1 active:scale-[0.98] transition-all duration-200 overflow-hidden",
          "bg-white border-border dark:bg-[#143d32] dark:border-white/10",
          isLime ? "hover:border-lime/60" : "hover:border-clay/80"
        )}
      >
        {/* Subtle accent wash */}
        <div
          className={cn(
            "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity",
            isLime ? "bg-lime" : "bg-clay"
          )}
        />

        <div className="relative flex items-start gap-4">
          <div
            className={cn(
              "shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
              isLime
                ? "bg-lime/15 text-forest group-hover:bg-lime/25"
                : "bg-clay/40 text-forest group-hover:bg-clay/60"
            )}
          >
            <Icon className="h-7 w-7" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-headline text-lg font-semibold text-foreground">
                {title}
              </h3>
              <span
                className={cn(
                  "hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-body text-[10px] font-semibold uppercase tracking-wide",
                  isLime
                    ? "bg-lime/20 text-forest dark:text-lime"
                    : "bg-clay/40 text-forest dark:text-clay"
                )}
              >
                <Clock className="h-3 w-3" />
                {meta.duration}
              </span>
            </div>

            <p className="font-body text-sm text-muted-foreground dark:text-white/70 line-clamp-2 mb-3">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {meta.steps} langkah
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-body text-xs text-muted-foreground">
                Hasil: {meta.result}
              </span>
            </div>
          </div>

          <div className="shrink-0 self-center">
            <ArrowRight
              className={cn(
                "h-5 w-5 transition-all",
                isLime
                  ? "text-muted-foreground group-hover:text-forest group-hover:translate-x-1"
                  : "text-muted-foreground group-hover:text-forest group-hover:translate-x-1"
              )}
            />
          </div>
        </div>
      </div>
    </button>
  )
}
