"use client"

import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { Check, Home, FlaskConical, Leaf } from "lucide-react"
import { WalkthroughType } from "./walkthrough-modal"
import { getWalkthroughMeta } from "./walkthrough-data"
import { cn } from "@/lib/utils"

interface WalkthroughCompletionProps {
  type: WalkthroughType
  onClose: () => void
}

interface Particle {
  id: number
  size: number
  color: string
  left: number
  top: number
  x: number
  y: number
  rotate: number
  delay: number
  duration: number
  shape: "circle" | "square"
}

function SparkleConfetti() {
  const particles: Particle[] = Array.from({ length: 22 }, (_, i) => {
    const colors = ["#eaf06a", "#0b493a", "#ffffff", "#cdc2b1"]
    return {
      id: i,
      size: 5 + (i % 4) * 4,
      color: colors[i % colors.length],
      left: 8 + (i * 17) % 84,
      top: 12 + (i * 11) % 58,
      x: -40 + (i % 7) * 14,
      y: -100 - (i % 5) * 35,
      rotate: i * 45,
      delay: i * 45,
      duration: 900 + (i % 5) * 180,
      shape: i % 3 === 0 ? "square" : "circle",
    }
  })

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={
            {
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "9999px" : "2px",
              left: `${p.left}%`,
              top: `${p.top}%`,
              opacity: 0.95,
              animationDelay: `${p.delay}ms`,
              animationDuration: `${p.duration}ms`,
              "--confetti-x": `${p.x}px`,
              "--confetti-y": `${p.y}px`,
              "--confetti-rotate": `${p.rotate}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function WalkthroughCompletion({ type, onClose }: WalkthroughCompletionProps) {
  const [showCheck, setShowCheck] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const meta = type ? getWalkthroughMeta(type) : null

  useEffect(() => {
    const checkTimer = setTimeout(() => setShowCheck(true), shouldReduceMotion ? 0 : 150)
    const contentTimer = setTimeout(() => setShowContent(true), shouldReduceMotion ? 0 : 400)
    return () => {
      clearTimeout(checkTimer)
      clearTimeout(contentTimer)
    }
  }, [shouldReduceMotion])

  return (
    <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
      <SparkleConfetti />

      <motion.div
        initial={false}
        animate={
          showContent
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 16, scale: shouldReduceMotion ? 1 : 0.96 }
        }
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Badge */}
        {meta && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#003125]/10 dark:bg-white/15 text-[#003125] dark:text-white font-body text-xs font-semibold mb-5">
            {type === "ECO_ENZYM" ? (
              <Leaf className="h-3.5 w-3.5" />
            ) : (
              <FlaskConical className="h-3.5 w-3.5" />
            )}
            Panduan {meta.shortLabel} selesai
          </div>
        )}

        {/* Checkmark */}
        <motion.div
          initial={false}
          animate={
            showCheck
              ? { scale: 1, opacity: 1 }
              : { scale: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 }
          }
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 18,
            duration: shouldReduceMotion ? 0 : undefined,
          }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(11,73,58,0.25)] dark:shadow-[0_0_50px_rgba(234,240,106,0.35)]"
          style={{ backgroundColor: "#003125" }}
        >
          <Check className="h-12 w-12 text-white" strokeWidth={3} />
        </motion.div>

        {/* Headline */}
        <h2 className="font-headline text-4xl sm:text-5xl font-bold mb-3" style={{ color: "#003125" }}>
          Selamat!
        </h2>

        {/* Subheadline */}
        <p
          className="font-body text-base sm:text-lg mb-8 mx-auto leading-relaxed"
          style={{ color: "rgba(0,49,37,0.9)" }}
        >
          {meta ? (
            <>
              Anda telah menyelesaikan panduan{" "}
              <span className="font-semibold">{meta.label}</span>. Sekarang waktunya
              mencoba sendiri dan membuat fermentasi pertama.
            </>
          ) : (
            "Anda telah menyelesaikan panduan. Sekarang waktunya mencoba sendiri!"
          )}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/fermentation/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-headline font-semibold text-sm bg-[#003125] text-white shadow-level-1 hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto"
          >
            <FlaskConical className="h-5 w-5" />
            Mulai Fermentasi Pertama
          </Link>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-headline font-semibold text-sm bg-[#003125]/10 text-[#003125] hover:bg-[#003125]/20 active:scale-95 transition-all w-full sm:w-auto"
          >
            <Home className="h-5 w-5" />
            Kembali ke Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}
