"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

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
    <div className="min-h-[60dvh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="font-headline text-2xl font-bold text-foreground mb-2">
        Terjadi Kesalahan
      </h2>
      <p className="font-body text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
        Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi atau kembali ke dashboard.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-forest dark:bg-secondary text-white dark:text-secondary-foreground font-headline font-semibold text-sm px-5 py-3 rounded-2xl shadow-level-1 hover:opacity-90 active:scale-95 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
        <Button variant="outline" asChild className="rounded-2xl">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
