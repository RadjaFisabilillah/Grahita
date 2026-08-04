"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Home } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center bg-background">
      <div className="w-24 h-24 rounded-full bg-forest/10 dark:bg-secondary/10 flex items-center justify-center mb-6">
        <WifiOff className="h-12 w-12 text-forest dark:text-secondary" />
      </div>

      <h1 className="font-headline text-3xl font-bold text-foreground mb-2">
        Anda Sedang Offline
      </h1>

      <p className="font-body text-base text-muted-foreground mb-3 max-w-sm mx-auto">
        Sepertinya koneksi internet Anda terputus. Beberapa fitur mungkin tidak tersedia saat ini.
      </p>

      <p className="font-body text-sm text-muted-foreground/70 mb-8 max-w-xs mx-auto">
        Data fermentasi yang sudah pernah dibuka sebelumnya masih bisa diakses. Silakan periksa koneksi Anda.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-forest dark:bg-secondary text-white dark:text-secondary-foreground font-headline font-semibold text-sm px-6 py-3 rounded-2xl shadow-level-1 hover:opacity-90 active:scale-95 transition-all"
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

      <div className="mt-12 pt-8 border-t border-border w-full max-w-xs">
        <p className="font-body text-xs text-muted-foreground/60">
          Grahita · Monitoring Fermentasi
        </p>
      </div>
    </div>
  )
}
