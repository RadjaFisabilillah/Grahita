"use client"

import { useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { WalkthroughChoice } from "./walkthrough-choice"
import { WalkthroughCarousel } from "./walkthrough-carousel"
import { WalkthroughCompletion } from "./walkthrough-completion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export type WalkthroughType = "ECO_ENZYM" | "POC" | null

interface WalkthroughModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalkthroughModal({ isOpen, onClose }: WalkthroughModalProps) {
  const [type, setType] = useState<WalkthroughType>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isLastStep, setIsLastStep] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setType(null)
      setIsComplete(false)
      setIsLastStep(false)
    }
  }, [isOpen])

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return
    const originalClass = document.body.className
    document.body.classList.add("overflow-hidden")
    return () => {
      document.body.classList.remove("overflow-hidden")
      if (originalClass) document.body.className = originalClass
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

  const handleComplete = useCallback(() => {
    setIsComplete(true)
  }, [])

  const handleLastStep = useCallback((last: boolean) => {
    setIsLastStep(last)
  }, [])

  const handleCloseCompletion = useCallback(() => {
    onClose()
  }, [onClose])

  const handleBack = useCallback(() => {
    setType(null)
    setIsComplete(false)
    setIsLastStep(false)
  }, [])

  if (!isOpen || !mounted) return null

  const isReward = isComplete || isLastStep

  const bgClass = cn(
    "fixed top-0 left-0 h-[100dvh] w-screen z-[100] flex items-center justify-center motion-safe:transition-colors motion-safe:duration-700 motion-safe:ease-out",
    isReward
      ? "bg-[#eaf06a] dark:bg-[#143d32]"
      : "bg-[#f5f7f0] dark:bg-[#0b1f1a]"
  )

  const modalContent = (
    <div className={bgClass} role="dialog" aria-modal="true" aria-label="Panduan Pembuatan">
      <div className="relative w-full h-full max-w-2xl mx-auto flex flex-col">
        {/* Close button — hidden during completion */}
        {!isComplete && (
          <button
            onClick={onClose}
            className={cn(
              "absolute top-4 right-4 z-10 p-2 rounded-full transition-colors shadow-sm",
              isReward
                ? "bg-[#003125]/10 dark:bg-white/15 text-[#003125] dark:text-white hover:bg-[#003125]/20 dark:hover:bg-white/25"
                : "bg-black/5 dark:bg-white/10 text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20"
            )}
            aria-label="Tutup panduan"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center p-4 sm:p-6">
          {isComplete ? (
            <WalkthroughCompletion onClose={handleCloseCompletion} />
          ) : type === null ? (
            <WalkthroughChoice onSelect={handleSelect} />
          ) : (
            <WalkthroughCarousel
              type={type}
              onComplete={handleComplete}
              onBack={handleBack}
              onLastStep={handleLastStep}
              isLastStep={isLastStep}
              isReward={isReward}
            />
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
