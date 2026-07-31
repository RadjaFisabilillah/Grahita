"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { WalkthroughType } from "./walkthrough-modal"
import { WalkthroughStep } from "./walkthrough-step"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ArrowLeft, Check } from "lucide-react"

interface EcoEnzymStep {
  title: string
  description: string
}

const ECO_ENZYM_STEPS: EcoEnzymStep[] = [
  {
    title: "Siapkan Bahan",
    description: "Siapkan galon 15 liter, limbah buah (sisa potongan atau kulit buah), dan molase. Pastikan galon bersih dan kering.",
  },
  {
    title: "Perbandingan Bahan",
    description: "Gunakan perbandingan 10:1:1 — 10 bagian air (dalam liter), 1 bagian buah (dalam kilogram), dan 1 bagian molase (dalam liter).",
  },
  {
    title: "Masukkan Air",
    description: "Tuangkan air ke dalam galon sesuai dengan jumlah yang ingin Anda buat berdasarkan perbandingan tadi.",
  },
  {
    title: "Siapkan Buah",
    description: "Potong atau lumatkan buah yang akan digunakan. Jika menggunakan buah yang dipotong dan membuang udara secara manual (membuka tutup), buka tutup galon 2 hari sekali. Jika buah dilumatkan, buka tutup galon setiap sehari sekali.",
  },
  {
    title: "Tambahkan Molase",
    description: "Masukkan molase ke dalam galon. Molase berfungsi sebagai sumber energi untuk mikroorganisme yang akan tumbuh dan memproses buah menjadi Eco Enzym.",
  },
  {
    title: "Aduk dan Tutup",
    description: "Aduk seluruh isi galon secara merata hingga molase larut. Tutup galon dengan rapat menggunakan penutup yang sudah disiapkan.",
  },
  {
    title: "Pengecekan Berkala (Otomatis)",
    description: "Jika menggunakan penutup dengan pembuangan udara otomatis, Anda cukup mengecek galon setiap 3 hari sekali untuk memastikan proses fermentasi berjalan lancar.",
  },
  {
    title: "Pengecekan Berkala (Manual)",
    description: "Jika menggunakan tutup galon tanpa saluran udara, Anda perlu rutin membuka tutup untuk melepaskan gas hasil fermentasi agar tidak menumpuk dan menyebabkan galon pecah.",
  },
]

const POC_STEPS: EcoEnzymStep[] = [
  {
    title: "Siapkan Peralatan",
    description: "Siapkan galon, buah atau urin sapi, molase, dan EM4 sebagai starter mikroorganisme. Pastikan semua peralatan bersih.",
  },
  {
    title: "Masukkan Bahan",
    description: "Masukkan urin sapi, molase, dan EM4 ke dalam galon sesuai takaran yang Anda inginkan. Molase dan EM4 membantu mempercepat fermentasi.",
  },
  {
    title: "Aduk Merata",
    description: "Aduk isi galon secara merata hingga semua bahan tercampur dengan baik. Pastikan tidak ada endapan yang menggumpal di dasar.",
  },
  {
    title: "Pasang Selang",
    description: "Pasang selang pada lubang penutup galon. Selang ini akan digunakan untuk menghubungkan galon dengan aerator.",
  },
  {
    title: "Hubungkan Aerator",
    description: "Hubungkan penutup galon yang sudah dipasangi selang dengan aerator. Aerator akan memasok oksigen dari dasar galon untuk membantu proses fermentasi aerob.",
  },
  {
    title: "Nyalakan Aerator",
    description: "Tutup galon dengan rapat dan nyalakan aerator setiap 2 hari sekali selama beberapa jam untuk memastikan pasokan oksigen tetap cukup.",
  },
]

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
  const steps = type === "ECO_ENZYM" ? ECO_ENZYM_STEPS : POC_STEPS
  const totalSteps = steps.length
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  // Notify parent about last-step state
  useEffect(() => {
    onLastStep(currentStep === totalSteps - 1)
  }, [currentStep, totalSteps, onLastStep])

  const goToStep = useCallback(
    (index: number) => {
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

  // Color tokens for reward vs normal state
  const headerText = isReward
    ? "text-[#003125]/80 dark:text-white/80"
    : "text-muted-foreground"
  const headerHover = isReward
    ? "hover:text-[#003125] dark:hover:text-white"
    : "hover:text-foreground"
  const dotActive = isReward
    ? "bg-[#003125] dark:bg-[#eaf06a]"
    : "bg-forest dark:bg-secondary"
  const dotCompleted = isReward
    ? "bg-[#003125]/50 dark:bg-[#eaf06a]/50"
    : "bg-forest/50 dark:bg-secondary/50"
  const dotRemaining = isReward
    ? "bg-[#003125]/20 dark:bg-white/20"
    : "bg-muted"
  const dividerColor = isReward
    ? "border-[#003125]/15 dark:border-white/15"
    : "border-border/40"
  const prevBtnHover = isReward
    ? "hover:bg-[#003125]/10 dark:hover:bg-white/10"
    : "hover:bg-black/5 dark:hover:bg-white/10"
  const prevBtnText = isReward
    ? "text-[#003125]/80 dark:text-white/80"
    : "text-muted-foreground"

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className={cn(
            "flex items-center gap-1.5 text-sm font-body transition-colors",
            headerText,
            headerHover
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>
        <span className={cn("font-body text-sm", headerText)}>
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-4">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentStep
                ? "w-6 " + dotActive
                : index < currentStep
                  ? "w-2 " + dotCompleted
                  : "w-2 " + dotRemaining
            )}
            aria-label={`Langkah ${index + 1}`}
          />
        ))}
      </div>

      {/* Step content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          key={currentStep}
          className={cn(
            "animate-in fade-in duration-300 h-full",
            direction > 0 ? "slide-in-from-right" : "slide-in-from-left"
          )}
        >
          <WalkthroughStep
            stepNumber={currentStep + 1}
            title={steps[currentStep].title}
            description={steps[currentStep].description}
            totalSteps={totalSteps}
            isLastStep={isLastStep}
            isReward={isReward}
          />
        </div>
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
              ? "bg-forest dark:bg-[#eaf06a] text-white dark:text-forest"
              : "bg-forest dark:bg-secondary text-white dark:text-secondary-foreground"
          )}
        >
          {isLastStep ? (
            <>
              <Check className="h-4 w-4" />
              Selesai
            </>
          ) : (
            <>
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
