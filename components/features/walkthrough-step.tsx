"use client"

import { cn } from "@/lib/utils"
import { Lightbulb, type LucideIcon } from "lucide-react"

interface WalkthroughStepProps {
  stepNumber: number
  totalSteps: number
  title: string
  description: string
  icon: LucideIcon
  tip: string
  isReward: boolean
}

export function WalkthroughStep({
  stepNumber,
  totalSteps,
  title,
  description,
  icon: StepIcon,
  tip,
  isReward,
}: WalkthroughStepProps) {
  // Reward-aware color tokens
  const surfaceGradient = isReward
    ? "from-[#003125]/10 via-[#eaf06a]/20 to-[#eaf06a]/40 dark:from-[#143d32] dark:via-[#1a4d3d] dark:to-[#eaf06a]/20"
    : "from-forest/5 via-lime/10 to-clay/20 dark:from-[#143d32] dark:via-[#1a4d3d] dark:to-[#2f3d2a]"

  const iconBg = isReward
    ? "bg-[#003125]/10 dark:bg-[#eaf06a]/15"
    : "bg-white/60 dark:bg-white/10"

  const iconColor = isReward
    ? "text-[#003125] dark:text-[#eaf06a]"
    : "text-forest dark:text-secondary"

  const badgeBg = isReward
    ? "bg-[#003125] text-white dark:bg-[#eaf06a] dark:text-[#003125]"
    : "bg-forest text-white dark:bg-secondary dark:text-secondary-foreground"

  const titleColor = isReward
    ? "text-[#003125] dark:text-white"
    : "text-foreground"

  const descColor = isReward
    ? "text-[#003125]/80 dark:text-white/80"
    : "text-muted-foreground"

  const tipSurface = isReward
    ? "bg-[#003125]/8 dark:bg-white/10 border-[#003125]/10 dark:border-white/10"
    : "bg-forest/5 dark:bg-white/10 border-forest/10 dark:border-white/10"

  const tipIconColor = isReward
    ? "text-[#003125] dark:text-[#eaf06a]"
    : "text-forest dark:text-secondary"

  return (
    <div className="h-full flex flex-col">
      {/* Visual area */}
      <div
        className={cn(
          "relative w-full aspect-[4/3] max-h-[38vh] rounded-3xl overflow-hidden mb-5 flex items-center justify-center bg-gradient-to-br",
          surfaceGradient
        )}
      >
        {/* Soft radial glow behind icon */}
        <div
          className={cn(
            "absolute inset-0 opacity-60",
            isReward
              ? "bg-[radial-gradient(circle_at_50%_50%,rgba(234,240,106,0.35),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(234,240,106,0.15),transparent_70%)]"
              : "bg-[radial-gradient(circle_at_50%_50%,rgba(11,73,58,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(234,240,106,0.08),transparent_70%)]"
          )}
        />

        {/* Icon centerpiece */}
        <div
          className={cn(
            "relative z-10 w-24 h-24 rounded-[1.75rem] backdrop-blur-sm flex items-center justify-center shadow-sm",
            iconBg
          )}
        >
          <StepIcon className={cn("h-11 w-11", iconColor)} strokeWidth={1.75} />
        </div>

        {/* Step badge */}
        <div
          className={cn(
            "absolute top-4 left-4 px-3 py-1.5 rounded-full font-body text-xs font-semibold shadow-sm",
            badgeBg
          )}
        >
          Langkah {stepNumber} dari {totalSteps}
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        <h3 className={cn("font-headline text-xl sm:text-2xl font-bold mb-3", titleColor)}>
          {title}
        </h3>
        <p className={cn("font-body text-base leading-relaxed", descColor)}>
          {description}
        </p>

        {/* Pro tip */}
        <div
          className={cn(
            "mt-4 p-4 rounded-2xl border flex items-start gap-3",
            tipSurface
          )}
        >
          <div className={cn("shrink-0 mt-0.5", tipIconColor)}>
            <Lightbulb className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p
              className={cn(
                "font-headline text-xs font-semibold uppercase tracking-wide mb-0.5",
                tipIconColor
              )}
            >
              Tips praktis
            </p>
            <p className={cn("font-body text-sm leading-snug", descColor)}>
              {tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
