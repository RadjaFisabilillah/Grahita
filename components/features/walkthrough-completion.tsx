"use client"

import { useState, useEffect } from "react"
import { Check, Home } from "lucide-react"

interface WalkthroughCompletionProps {
  onClose: () => void
}

function SparkleConfetti() {
  const particles = Array.from({ length: 12 }, (_, i) => i)
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((i) => (
        <div
          key={i}
          className="absolute rounded-full motion-safe:animate-confetti"
          style={
            {
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              backgroundColor: i % 3 === 0 ? "#eaf06a" : i % 3 === 1 ? "#0b493a" : "#ffffff",
              left: `${10 + (i * 7) % 80}%`,
              top: `${10 + (i * 13) % 60}%`,
              opacity: 0.9,
              animationDelay: `${i * 80}ms`,
              animationDuration: `${900 + (i % 4) * 200}ms`,
              transform: `rotate(${i * 30}deg)`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function WalkthroughCompletion({ onClose }: WalkthroughCompletionProps) {
  const [showContent, setShowContent] = useState(false)
  const [showCheck, setShowCheck] = useState(false)

  useEffect(() => {
    const checkTimer = setTimeout(() => setShowCheck(true), 200)
    const contentTimer = setTimeout(() => setShowContent(true), 500)
    return () => {
      clearTimeout(checkTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  return (
    <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
      <SparkleConfetti />

      <div
        className={cn(
          "transition-all duration-700 ease-out",
          showContent
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-50"
        )}
      >
        {/* Checkmark with scale animation + glow */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(11,73,58,0.35)] dark:shadow-[0_0_50px_rgba(234,240,106,0.45)] motion-safe:animate-pulse"
          style={{
            backgroundColor: "#003125",
            transform: showCheck ? "scale(1)" : "scale(0)",
            transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <Check className="h-12 w-12 text-white" strokeWidth={3} />
        </div>

        <h2
          className="font-headline text-4xl md:text-5xl font-bold mb-3"
          style={{
            color: "#003125",
            textShadow: "0 2px 8px rgba(234,240,106,0.4)",
          }}
        >
          Selamat!
        </h2>
        <p
          className="font-body text-base md:text-lg mb-10 max-w-sm mx-auto"
          style={{ color: "rgba(0,49,37,0.9)" }}
        >
          Anda telah menyelesaikan panduan pembuatan. Sekarang saatnya mencoba sendiri!
        </p>

        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-headline font-semibold text-sm bg-[#003125] text-white shadow-level-1 hover:opacity-90 active:scale-95 transition-all"
        >
          <Home className="h-5 w-5" />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )
}

// Helper untuk className merge (avoid importing cn di file ini agar tidak perlu import)
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
