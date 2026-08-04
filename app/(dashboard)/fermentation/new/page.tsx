"use client"

import { useState, Suspense, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, Calendar } from "lucide-react"
import Link from "next/link"
import { addDays, format } from "date-fns"
import { id } from "date-fns/locale"
import { apiFetch, handleApiError } from "@/lib/api-client"

function getDefaultTotalDays(type: string) {
  return type === "POC" ? 14 : 90
}

function getTodayString() {
  return new Date().toISOString().split("T")[0]
}

function NewFermentationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") || "POC"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedType, setSelectedType] = useState(defaultType)
  const [startDate, setStartDate] = useState(getTodayString())
  const [totalDays, setTotalDays] = useState(getDefaultTotalDays(defaultType).toString())

  const endDatePreview = useMemo(() => {
    try {
      const start = new Date(startDate)
      const days = parseInt(totalDays, 10)
      if (isNaN(days) || days < 1) return null
      return addDays(start, days)
    } catch {
      return null
    }
  }, [startDate, totalDays])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const startDateStr = formData.get("startDate") as string
    const totalDaysNum = parseInt(formData.get("totalDays") as string, 10)
    const start = new Date(startDateStr)
    const end = addDays(start, totalDaysNum)

    const payload: Record<string, unknown> = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      batchCode: (formData.get("batchCode") as string) || null,
      startDate: startDateStr,
      endDate: end.toISOString().split("T")[0],
      totalDays: totalDaysNum,
      notes: (formData.get("notes") as string) || null,
    }

    if (payload.type === "ECO_ENZYM") {
      const ventType = formData.get("ventType") as string
      const fruitForm = formData.get("fruitForm") as string
      if (ventType) payload.ventType = ventType
      if (fruitForm) payload.fruitForm = fruitForm
    }

    try {
      const res = await apiFetch("/api/fermentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Gagal membuat fermentasi")
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setIsLoading(false)
    }
  }

  function handleTypeChange(type: string) {
    setSelectedType(type)
    setTotalDays(getDefaultTotalDays(type).toString())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <span className="font-headline text-sm text-muted-foreground">Kembali</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl text-foreground">Fermentasi Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-headline text-xs uppercase">Nama Fermentasi</Label>
              <Input id="name" name="name" placeholder="Contoh: POC Batch 1" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="font-headline text-xs uppercase">Jenis</Label>
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="type"
                    value="POC"
                    className="peer sr-only"
                    defaultChecked={defaultType === "POC"}
                    onChange={() => handleTypeChange("POC")}
                  />
                  <div className="rounded-xl border-2 border-border p-3 text-center cursor-pointer peer-checked:border-forest dark:peer-checked:border-secondary peer-checked:bg-forest/5 dark:peer-checked:bg-secondary/10 font-body text-sm">
                    POC
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="type"
                    value="ECO_ENZYM"
                    className="peer sr-only"
                    defaultChecked={defaultType === "ECO_ENZYM"}
                    onChange={() => handleTypeChange("ECO_ENZYM")}
                  />
                  <div className="rounded-xl border-2 border-border p-3 text-center cursor-pointer peer-checked:border-forest dark:peer-checked:border-secondary peer-checked:bg-forest/5 dark:peer-checked:bg-secondary/10 font-body text-sm">
                    Eco Enzym
                  </div>
                </label>
              </div>
            </div>

            {selectedType === "ECO_ENZYM" && (
              <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
                <p className="font-headline text-sm font-semibold text-foreground">Konfigurasi Eco Enzym</p>
                <div className="space-y-2">
                  <Label className="font-headline text-xs uppercase">Bentuk Buah</Label>
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input type="radio" name="fruitForm" value="CUT" className="peer sr-only" defaultChecked />
                      <div className="rounded-xl border-2 border-border p-2.5 text-center cursor-pointer peer-checked:border-forest dark:peer-checked:border-secondary peer-checked:bg-forest/5 dark:peer-checked:bg-secondary/10 font-body text-xs">
                        Dipotong
                      </div>
                    </label>
                    <label className="flex-1">
                      <input type="radio" name="fruitForm" value="BLENDED" className="peer sr-only" />
                      <div className="rounded-xl border-2 border-border p-2.5 text-center cursor-pointer peer-checked:border-forest dark:peer-checked:border-secondary peer-checked:bg-forest/5 dark:peer-checked:bg-secondary/10 font-body text-xs">
                        Dihaluskan
                      </div>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-headline text-xs uppercase">Tipe Penutup / Pembuangan Udara</Label>
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input type="radio" name="ventType" value="MANUAL" className="peer sr-only" defaultChecked />
                      <div className="rounded-xl border-2 border-border p-2.5 text-center cursor-pointer peer-checked:border-forest dark:peer-checked:border-secondary peer-checked:bg-forest/5 dark:peer-checked:bg-secondary/10 font-body text-xs">
                        Manual (buka tutup)
                      </div>
                    </label>
                    <label className="flex-1">
                      <input type="radio" name="ventType" value="AUTO" className="peer sr-only" />
                      <div className="rounded-xl border-2 border-border p-2.5 text-center cursor-pointer peer-checked:border-forest dark:peer-checked:border-secondary peer-checked:bg-forest/5 dark:peer-checked:bg-secondary/10 font-body text-xs">
                        Otomatis (saluran)
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="batchCode" className="font-headline text-xs uppercase">Kode Batch (opsional)</Label>
              <Input id="batchCode" name="batchCode" placeholder="B-001" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="font-headline text-xs uppercase">Tanggal Mulai</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-headline text-xs uppercase">Target Selesai</Label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm font-body text-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>
                    {endDatePreview
                      ? format(endDatePreview, "d MMMM yyyy", { locale: id })
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalDays" className="font-headline text-xs uppercase">Total Hari</Label>
              <Input
                id="totalDays"
                name="totalDays"
                type="number"
                min={1}
                value={totalDays}
                onChange={(e) => setTotalDays(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="font-headline text-xs uppercase">Catatan (opsional)</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="flex w-full rounded-xl border border-border bg-transparent px-4 py-2 text-sm font-body placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Catatan tambahan..."
              />
            </div>

            {error && <Badge variant="destructive" className="w-full justify-center">{error}</Badge>}

            <Button type="submit" className="w-full font-headline" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Fermentasi"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NewFermentationPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <NewFermentationForm />
    </Suspense>
  )
}
