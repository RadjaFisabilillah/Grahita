"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { WalkthroughType } from "./walkthrough-modal"
import { WalkthroughStep } from "./walkthrough-step"
import { getSteps } from "./walkthrough-data"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ArrowLeft, Check, ChevronsLeftRight } from "lucide-react"

interface WalkthroughCarouselProps {
  type: WalkthroughType
  onComplete: () => void
  onBack: () => void
  onLastStep: (isLast: boolean) => void
  isLastStep: boolean
  isReward: boolean
}

export function WalkthroughCarousel({
  type,
  onComplete,
  onBack,
  onLastStep,
  isLastStep,
  isReward,
}: WalkthroughCarouselProps) {
  const steps = type ? getSteps(type) : []
  const totalSteps = steps.length
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const shouldReduceMotion = useReducedMotion()

  // Notify parent about last-step state
  useEffect(() => {
    onLastStep(currentStep === totalSteps - 1)
  }, [currentStep, totalSteps, onLastStep])

  const goToStep = useCallback(
    (index: number) => {
      if (index === currentStep) return
      setDirection(index > currentStep ? 1 : -1)
      setCurrentStep(index)
    },
    [currentStep]
  )

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete()
    }
  }, [currentStep, totalSteps, onComplete])

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  // Touch/swipe handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      const diff = touchStartX.current - e.changedTouches[0].clientX
      const threshold = 50
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentStep < totalSteps - 1) {
          goNext()
        } else if (diff < 0 && currentStep > 0) {
          goPrev()
        }
      }
      touchStartX.current = null
    },
    [currentStep, totalSteps, goNext, goPrev]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev])

  const progress = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0

  // Color tokens for reward vs normal state
  const headerText = isReward
    ? "text-[#003125]/80 dark:text-white/80"
    : "text-muted-foreground"
  const headerHover = isReward
    ? "hover:text-[#003125] dark:hover:text-white"
    : "hover:text-foreground"

  const progressFill = isReward
    ? "bg-[#003125] dark:bg-[#eaf06a]"
    : "bg-forest dark:bg-secondary"

  const prevBtnHover = isReward
    ? "hover:bg-[#003125]/10 dark:hover:bg-white/10"
    : "hover:bg-black/5 dark:hover:bg-white/10"
  const prevBtnText = isReward
    ? "text-[#003125]/80 dark:text-white/80"
    : "text-muted-foreground"

  const dividerColor = isReward
    ? "border-[#003125]/15 dark:border-white/15"
    : "border-border/40"

  const stepData = steps[currentStep]

  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className={cn(
            "flex items-center gap-1.5 text-sm font-body transition-colors",
            headerText,
            headerHover
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke pilihan
        </button>
        <span className={cn("font-body text-sm", headerText)}>
          {currentStep + 1} dari {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="progress-bar-track">
          <div
            className={cn("progress-bar-fill", progressFill)}
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className={cn("font-body text-xs", headerText)}>
            Progress panduan
          </span>
          <span className={cn("font-headline text-xs font-semibold", headerText)}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Step content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" custom={direction}>
          {stepData && (
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: shouldReduceMotion ? 0 : 0.25 },
              }}
              className="h-full"
            >
              <WalkthroughStep
                stepNumber={currentStep + 1}
                totalSteps={totalSteps}
                title={stepData.title}
                description={stepData.description}
                icon={stepData.icon}
                tip={stepData.tip}
                isReward={isReward}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className={cn("flex items-center justify-between mt-4 pt-4 border-t", dividerColor)}>
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className={cn(
            "flex items-center gap-1 px-4 py-2.5 rounded-2xl font-headline font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
            prevBtnText,
            prevBtnHover
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </button>

        <button
          onClick={goNext}
          className={cn(
            "flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-headline font-semibold text-sm shadow-level-1 hover:opacity-90 active:scale-95 transition-all",
            isLastStep
              ? "bg-[#eaf06a] text-[#003125] shadow-[0_4px_14px_rgba(234,240,106,0.35)]"
              : "bg-forest dark:bg-secondary text-white dark:text-secondary-foreground"
          )}
        >
          {isLastStep ? (
            <>
              <Check className="h-4 w-4" />
              Selesai — Siap!
            </>
          ) : (
            <>
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Swipe hint */}
      <div className={cn("flex items-center justify-center gap-1.5 mt-3", headerText)}>
        <ChevronsLeftRight className="h-4 w-4" />
        <span className="font-body text-xs">Geser untuk berpindah langkah</span>
      </div>
    </div>
  )
}
