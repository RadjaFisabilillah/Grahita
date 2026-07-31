"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Dialog({ open, onClose, children }: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-3xl bg-card border border-border p-6 shadow-level-2", className)}>
      {children}
    </div>
  )
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-headline text-lg font-semibold text-foreground">{children}</h2>
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="font-body text-sm text-muted-foreground mt-1">{children}</p>
}

export function DialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex items-center justify-end gap-2 mt-6", className)}>{children}</div>
}
