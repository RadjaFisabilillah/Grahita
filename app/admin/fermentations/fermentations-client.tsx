"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { apiFetch, handleApiError } from "@/lib/api-client"
import { Loader2, FlaskConical, Trash2, Search, AlertTriangle } from "lucide-react"

interface AdminFermentation {
  id: string
  name: string
  type: "POC" | "ECO_ENZYM"
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "ABORTED"
  startDate: string
  endDate: string
  totalDays: number
  createdAt: string
  user: { id: string; email: string; name: string | null }
  _count: { tasks: number }
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Aktif",
  PAUSED: "Jeda",
  COMPLETED: "Selesai",
  ABORTED: "Dibatalkan",
}

export function FermentationsClient() {
  const [items, setItems] = useState<AdminFermentation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<AdminFermentation | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      if (typeFilter) params.set("type", typeFilter)
      const res = await apiFetch(`/api/admin/fermentations?${params.toString()}`)
      const data = await res.json()
      if (res.ok) setItems(data.fermentations)
      else handleApiError(data, "Gagal memuat fermentasi")
    } catch {
      // apiFetch handles 401 redirect
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, typeFilter])

  async function handleDelete() {
    if (!deleteTarget) return
    setBusy(true)
    try {
      const res = await apiFetch(`/api/admin/fermentations/${deleteTarget.id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (res.ok) {
        setDeleteTarget(null)
        await load()
      } else {
        handleApiError(data, "Gagal menghapus fermentasi")
      }
    } catch {
      // apiFetch handles 401 redirect
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl font-bold text-foreground">Kelola Fermentasi</h1>
        <p className="font-body text-sm text-muted-foreground">Seluruh fermentasi pengguna</p>
      </header>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama fermentasi atau email user..."
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 font-body text-sm"
        >
          <option value="">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="PAUSED">Jeda</option>
          <option value="COMPLETED">Selesai</option>
          <option value="ABORTED">Dibatalkan</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 font-body text-sm"
        >
          <option value="">Semua Jenis</option>
          <option value="POC">POC</option>
          <option value="ECO_ENZYM">Eco Enzym</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center font-body text-sm text-muted-foreground py-10">
            Tidak ada fermentasi yang cocok.
          </p>
        ) : (
          items.map((f) => (
            <Card key={f.id} className="overflow-hidden rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest/10 dark:bg-secondary/20 flex items-center justify-center shrink-0">
                    <FlaskConical className="h-5 w-5 text-forest dark:text-secondary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-body text-sm font-medium truncate">{f.name}</p>
                      <Badge variant="outline" className="shrink-0">
                        {f.type === "POC" ? "POC" : "Eco Enzym"}
                      </Badge>
                    </div>
                    <p className="font-body text-xs text-muted-foreground truncate">
                      {f.user.name || f.user.email}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {f.totalDays} hari · {f._count.tasks} tugas ·{" "}
                      {new Date(f.startDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge variant={f.status === "ACTIVE" ? "default" : "outline"}>
                      {STATUS_LABEL[f.status]}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive gap-1.5"
                      onClick={() => setDeleteTarget(f)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Hapus fermentasi?
            </DialogTitle>
            <DialogDescription>
              Fermentasi <strong>{deleteTarget?.name}</strong> beserta seluruh tugasnya akan dihapus
              permanen. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={busy}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
