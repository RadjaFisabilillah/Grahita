"use client"

import { cn } from "@/lib/utils"

interface WalkthroughStepProps {
  stepNumber: number
  title: string
  description: string
  totalSteps: number
  isLastStep: boolean
  isReward: boolean
}

export function WalkthroughStep({
  stepNumber,
  title,
  description,
  isReward,
}: WalkthroughStepProps) {
  // Reward-aware color tokens
  const placeholderBg = isReward
    ? "bg-[#003125]/10 dark:bg-[#eaf06a]/10"
    : "bg-[#e8efe3] dark:bg-[#143d32]"
  const numberColor = isReward
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

  return (
    <div className="h-full flex flex-col">
      {/* Placeholder image area */}
      <div
        className={cn(
          "relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-5 flex items-center justify-center",
          placeholderBg
        )}
      >
        {/* Placeholder indicator */}
        <div className="text-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3",
            isReward ? "bg-[#003125]/15 dark:bg-[#eaf06a]/20" : "bg-black/5 dark:bg-white/10"
          )}>
            <span className={cn("font-headline text-2xl font-bold", numberColor)}>
              {stepNumber}
            </span>
          </div>
          <p className={cn("font-body text-xs", descColor)}>
            Gambar langkah {stepNumber}
          </p>
        </div>

        {/* Step badge */}
        <div className={cn("absolute top-4 left-4 px-3 py-1.5 rounded-full font-body text-xs font-semibold", badgeBg)}>
          Langkah {stepNumber}
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1">
        <h3 className={cn("font-headline text-xl font-bold mb-3", titleColor)}>
          {title}
        </h3>
        <p className={cn("font-body text-base leading-relaxed", descColor)}>
          {description}
        </p>
      </div>
    </div>
  )
}
