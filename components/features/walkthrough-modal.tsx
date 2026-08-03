"use client"

import { useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { WalkthroughChoice } from "./walkthrough-choice"
import { WalkthroughCarousel } from "./walkthrough-carousel"
import { markWalkthroughComplete } from "./walkthrough-data"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export type WalkthroughType = "ECO_ENZYM" | "POC" | null

interface WalkthroughModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalkthroughModal({ isOpen, onClose }: WalkthroughModalProps) {
  const [type, setType] = useState<WalkthroughType>(null)
  const [isLastStep, setIsLastStep] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setType(null)
      setIsLastStep(false)
    }
  }, [isOpen])

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const handleSelect = useCallback((selected: WalkthroughType) => {
    setType(selected)
  }, [])

  const handleSkip = useCallback(() => {
    onClose()
  }, [onClose])

  const handleComplete = useCallback(() => {
    if (type) markWalkthroughComplete(type)
    onClose()
  }, [type, onClose])

  const handleLastStep = useCallback((last: boolean) => {
    setIsLastStep(last)
  }, [])

  const handleBack = useCallback(() => {
    setType(null)
    setIsLastStep(false)
  }, [])

  if (!isOpen || !mounted) return null

  const bgClass = cn(
    "fixed top-0 left-0 h-[100dvh] w-screen z-[100] flex items-center justify-center",
    "motion-safe:transition-colors motion-safe:ease-out motion-safe:duration-500",
    isLastStep
      ? "bg-[#eaf06a] dark:bg-[#143d32]"
      : "bg-[#f5f7f0] dark:bg-[#0b1f1a]"
  )

  const radialTexture = isLastStep
    ? "bg-[radial-gradient(circle_at_30%_20%,rgba(0,49,37,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.25),transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(234,240,106,0.1),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_40%)]"
    : ""

  const modalContent = (
    <div
      className={bgClass}
      role="dialog"
      aria-modal="true"
      aria-label="Panduan Pembuatan"
    >
      {radialTexture && (
        <div className={cn("absolute inset-0 pointer-events-none", radialTexture)} />
      )}

      <div className="relative w-full h-full max-w-2xl mx-auto flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 z-10 p-2 rounded-full transition-colors shadow-sm",
            isLastStep
              ? "bg-[#003125]/10 dark:bg-white/15 text-[#003125] dark:text-white hover:bg-[#003125]/20 dark:hover:bg-white/25"
              : "bg-black/5 dark:bg-white/10 text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20"
          )}
          aria-label="Tutup panduan"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center p-4 sm:p-6">
          {type === null ? (
            <WalkthroughChoice onSelect={handleSelect} onSkip={handleSkip} />
          ) : (
            <WalkthroughCarousel
              type={type}
              onComplete={handleComplete}
              onBack={handleBack}
              onLastStep={handleLastStep}
              isLastStep={isLastStep}
              isReward={isLastStep}
            />
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
