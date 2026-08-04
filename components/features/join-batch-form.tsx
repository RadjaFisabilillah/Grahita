"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { apiFetch, handleApiError } from "@/lib/api-client"
import { Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function JoinBatchForm() {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setIsLoading(true)
    try {
      const res = await apiFetch("/api/fermentations/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareCode: code.trim().toUpperCase() }),
      })
      if (!res.ok) {
        const data = await res.json()
        handleApiError(data, "Gagal bergabung")
        return
      }
      const data = await res.json()
      toast({
        title: "Berhasil bergabung",
        description: "Anda sekarang dapat mengakses fermentasi bersama.",
      })
      setOpen(false)
      setCode("")
      router.refresh()
      if (data.fermentationId) {
        router.push(`/fermentation/${data.fermentationId}`)
      }
    } catch {
      toast({
        title: "Gagal bergabung",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1">
        <Plus className="h-4 w-4" />
        Gabung Batch
      </Button>

      <Dialog open={open} onOpenChange={(open) => {
        setOpen(open)
        if (!open) setCode("")
      }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Gabung ke Batch Fermentasi</DialogTitle>
            <DialogDescription>
              Masukkan kode berbagi yang diberikan pemilik fermentasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="share-code" className="font-headline text-xs uppercase text-muted-foreground">
                Kode Berbagi
              </label>
              <Input
                id="share-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC12345"
                maxLength={8}
                autoComplete="off"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full font-headline" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Gabung Batch"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
