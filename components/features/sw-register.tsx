"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check for updates on load
          registration.update()

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (!newWorker) return

            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New service worker is installed and waiting
                setUpdateAvailable(true)
              }
            })
          })
        })
        .catch((err) => {
          console.error("SW registration failed:", err)
        })
    }
  }, [])

  function handleUpdate() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: "SKIP_WAITING" })
        window.location.reload()
      })
    }
  }

  return (
    <>
      {updateAvailable && (
        <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4">
          <div className="bg-forest text-white px-5 py-3 rounded-2xl shadow-level-2 flex items-center gap-3 max-w-sm">
            <div className="flex-1">
              <p className="font-headline text-sm font-semibold">Pembaruan tersedia</p>
              <p className="font-body text-xs text-white/80">Muat ulang untuk mendapatkan versi terbaru.</p>
            </div>
            <Button
              size="sm"
              onClick={handleUpdate}
              className="bg-white text-forest hover:bg-white/90 font-headline text-xs shrink-0"
            >
              Muat Ulang
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
