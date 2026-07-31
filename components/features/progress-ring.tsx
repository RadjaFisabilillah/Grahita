"use client"

import { useEffect, useState } from "react"

export function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
}: {
  progress: number
  size?: number
  strokeWidth?: number
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100)
    return () => clearTimeout(timer)
  }, [progress])

  const getColor = () => {
    if (progress >= 100) return "#eaf06a"
    if (progress >= 75) return "#316858"
    return "#0b493a"
  }

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-muted/50"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out, stroke 0.5s ease" }}
        />
      </svg>
      <span className="absolute font-headline text-xs font-semibold">{Math.round(progress)}%</span>
    </div>
  )
}
