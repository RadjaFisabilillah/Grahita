"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
      <div className="bg-destructive/10 dark:bg-destructive/15 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="font-headline text-xl font-semibold text-foreground mb-2">
        Gagal Memuat Data
      </h2>
      <p className="font-body text-sm text-muted-foreground max-w-xs mb-6">
        Tidak dapat terhubung ke database. Periksa koneksi internet Anda dan coba lagi.
      </p>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Coba Lagi
      </Button>
    </div>
  )
}
