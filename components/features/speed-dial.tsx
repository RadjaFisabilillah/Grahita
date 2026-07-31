"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, FlaskConical, Droplets, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function SpeedDial() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, close])

  function navigate(type: string) {
    close()
    router.push(`/fermentation/new?type=${type}`)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm motion-safe:animate-fade-in motion-reduce:animate-none"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3">
        {open && (
          <div
            className="flex flex-col gap-3 motion-safe:animate-fade-in motion-reduce:animate-none"
            role="menu"
            aria-label="Tambah fermentasi"
          >
            <button
              onClick={() => navigate("POC")}
              className="flex items-center gap-3 bg-lime dark:bg-secondary text-forest dark:text-secondary-foreground font-headline font-semibold text-sm px-5 py-3 rounded-2xl shadow-level-2 hover:bg-lime-dim dark:hover:bg-lime-dim active:scale-95 motion-safe:transition-all motion-reduce:transition-none"
              role="menuitem"
              aria-label="Tambah fermentasi POC"
            >
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
              Tambah POC
            </button>
            <button
              onClick={() => navigate("ECO_ENZYM")}
              className="flex items-center gap-3 bg-lime dark:bg-secondary text-forest dark:text-secondary-foreground font-headline font-semibold text-sm px-5 py-3 rounded-2xl shadow-level-2 hover:bg-lime-dim dark:hover:bg-lime-dim active:scale-95 motion-safe:transition-all motion-reduce:transition-none"
              role="menuitem"
              aria-label="Tambah fermentasi Eco Enzym"
            >
              <Droplets className="h-5 w-5" aria-hidden="true" />
              Tambah Eco Enzym
            </button>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Tambah fermentasi"}
          className={cn(
            "w-14 h-14 rounded-full shadow-level-2 flex items-center justify-center motion-safe:transition-all motion-safe:duration-300 motion-reduce:transition-none active:scale-95",
            open
              ? "bg-forest dark:bg-secondary text-white dark:text-secondary-foreground rotate-45"
              : "bg-lime text-forest"
          )}
        >
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Plus className="h-7 w-7" aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  )
}
