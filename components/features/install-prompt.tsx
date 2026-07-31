"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, Share2, SquarePlus } from "lucide-react"

const DISMISS_KEY = "grahita-install-dismissed"
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function isDismissed(): boolean {
  if (typeof window === "undefined") return false
  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  const dismissedAt = parseInt(raw, 10)
  return Date.now() - dismissedAt < DISMISS_DURATION_MS
}

function dismiss() {
  if (typeof window === "undefined") return
  localStorage.setItem(DISMISS_KEY, Date.now().toString())
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isDismissedState, setIsDismissedState] = useState(false)

  useEffect(() => {
    if (isDismissed()) {
      setIsDismissedState(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }
    window.addEventListener("beforeinstallprompt", handler)

    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Show iOS hint after a short delay on first visit
    if (isIOSDevice && !isDismissed()) {
      const timer = setTimeout(() => setIsVisible(true), 3000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener("beforeinstallprompt", handler)
      }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setIsVisible(false)
    dismiss()
    setIsDismissedState(true)
  }

  if (isDismissedState) return null
  if (!isVisible) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-8 md:left-auto md:right-8 md:w-80 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest dark:bg-secondary flex items-center justify-center shrink-0">
            <Download className="h-5 w-5 text-white dark:text-secondary-foreground" />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <p className="font-headline text-sm font-semibold text-foreground">Install Grahita</p>
            {isIOS ? (
              <div className="mt-1 space-y-1">
                <p className="font-body text-xs text-muted-foreground">
                  Untuk akses lebih cepat, tambahkan ke Home Screen:
                </p>
                <ol className="font-body text-xs text-muted-foreground list-decimal list-inside space-y-0.5">
                  <li>
                    <span className="inline-flex items-center gap-1">
                      Tap tombol <Share2 className="h-3 w-3 inline" /> Share
                    </span>
                  </li>
                  <li>
                    <span className="inline-flex items-center gap-1">
                      Pilih <SquarePlus className="h-3 w-3 inline" /> "Add to Home Screen"
                    </span>
                  </li>
                </ol>
              </div>
            ) : (
              <p className="font-body text-xs text-muted-foreground mt-1">
                Tambahkan ke layar utama untuk akses cepat seperti aplikasi native.
              </p>
            )}
          </div>
        </div>

        {!isIOS && (
          <div className="mt-3 flex justify-end">
            <Button size="sm" onClick={install}>
              <Download className="h-4 w-4 mr-1" /> Install
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
