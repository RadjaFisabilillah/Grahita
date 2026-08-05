"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ProgressRing } from "@/components/features/progress-ring"
import { Fermentation } from "@/types"
import { format, parseISO, differenceInDays, isPast } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import { apiFetch, handleApiError } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  FlaskConical,
  Droplets,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Check,
  X,
  Pencil,
  Trash2,
  PencilLine,
  Share2,
  Copy,
} from "lucide-react"

export function FermentationDetail({ fermentation }: { fermentation: Fermentation }) {
  const router = useRouter()
  const [status, setStatus] = useState(fermentation.status)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [shareCode, setShareCode] = useState<string | null>(null)
  const [isShareLoading, setIsShareLoading] = useState(false)

  // Task edit state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTaskTitle, setEditTaskTitle] = useState("")
  const [editTaskDate, setEditTaskDate] = useState("")

  // Form state
  const [editName, setEditName] = useState(fermentation.name)
  const [editStartDate, setEditStartDate] = useState(
    format(parseISO(fermentation.startDate), "yyyy-MM-dd")
  )
  const [editTotalDays, setEditTotalDays] = useState(fermentation.totalDays.toString())
  const [editNotes, setEditNotes] = useState(fermentation.notes || "")

  const start = parseISO(fermentation.startDate)
  const end = parseISO(fermentation.endDate)
  const now = new Date()
  const elapsed = Math.max(0, differenceInDays(now, start))
  const total = fermentation.totalDays
  const progress = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))

  async function updateStatus(newStatus: string) {
    setIsSaving(true)
    try {
      const res = await apiFetch(`/api/fermentations/${fermentation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        handleApiError(data, "Gagal mengubah status")
        return
      }
      setStatus(newStatus as Fermentation["status"])
      router.refresh()
      toast({
        title: "Status diperbarui",
        description: "Status fermentasi berhasil diubah.",
      })
    } catch {
      toast({
        title: "Gagal mengubah status",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function saveChanges() {
    const totalDaysNum = parseInt(editTotalDays, 10)
    if (!editName.trim() || isNaN(totalDaysNum) || totalDaysNum < 1) return

    setIsSaving(true)
    try {
      const res = await apiFetch(`/api/fermentations/${fermentation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          startDate: new Date(editStartDate).toISOString(),
          totalDays: totalDaysNum,
          notes: editNotes.trim() || null,
        }),
      })
      if (res.ok) {
        setIsEditing(false)
        router.refresh()
      } else {
        const data = await res.json()
        handleApiError(data, "Gagal menyimpan perubahan")
      }
    } catch {
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteFermentation() {
    setIsSaving(true)
    try {
      const res = await apiFetch(`/api/fermentations/${fermentation.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        const data = await res.json()
        handleApiError(data, "Gagal menghapus fermentasi")
      }
    } catch {
      toast({
        title: "Gagal menghapus",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  function cancelEdit() {
    setEditName(fermentation.name)
    setEditStartDate(format(parseISO(fermentation.startDate), "yyyy-MM-dd"))
    setEditTotalDays(fermentation.totalDays.toString())
    setEditNotes(fermentation.notes || "")
    setIsEditing(false)
  }

  async function createShareCode() {
    setIsShareLoading(true)
    try {
      const res = await apiFetch(`/api/fermentations/${fermentation.id}/share`, {
        method: "POST",
      })
      if (!res.ok) {
        const data = await res.json()
        handleApiError(data, "Gagal membuat kode")
        return
      }
      const data = await res.json()
      setShareCode(data.shareCode)
    } catch {
      toast({
        title: "Gagal membuat kode",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsShareLoading(false)
    }
  }

  function copyShareCode() {
    if (!shareCode) return
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareCode).then(() => {
        toast({
          title: "Berhasil disalin",
          description: `Kode ${shareCode} telah disalin ke clipboard.`,
        })
      })
    } else {
      // Fallback for older browsers
      const el = document.createElement("textarea")
      el.value = shareCode
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      toast({
        title: "Berhasil disalin",
        description: `Kode ${shareCode} telah disalin ke clipboard.`,
      })
    }
  }

  async function saveTask(taskId: string) {
    if (!editTaskTitle.trim()) return
    setIsSaving(true)
    try {
      const res = await apiFetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTaskTitle.trim(),
          scheduledDate: new Date(editTaskDate).toISOString(),
        }),
      })
      if (res.ok) {
        setEditingTaskId(null)
        router.refresh()
      } else {
        const data = await res.json()
        handleApiError(data, "Gagal menyimpan tugas")
      }
    } catch {
      toast({
        title: "Gagal menyimpan tugas",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteTask(taskId: string) {
    setIsSaving(true)
    try {
      const res = await apiFetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        handleApiError(data, "Gagal menghapus tugas")
      }
    } catch {
      toast({
        title: "Gagal menghapus tugas",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  function startEditTask(task: typeof fermentation.tasks[0]) {
    setEditingTaskId(task.id)
    setEditTaskTitle(task.title)
    setEditTaskDate(format(parseISO(task.scheduledDate), "yyyy-MM-dd"))
  }

  function cancelEditTask() {
    setEditingTaskId(null)
    setEditTaskTitle("")
    setEditTaskDate("")
  }

  const statusMap = {
    ACTIVE: { label: "Aktif", color: "bg-forest dark:bg-secondary text-white dark:text-secondary-foreground" },
    PAUSED: { label: "Dijeda", color: "bg-clay dark:bg-muted text-foreground" },
    COMPLETED: { label: "Selesai", color: "bg-lime dark:bg-secondary text-forest dark:text-secondary-foreground" },
    ABORTED: { label: "Dibatalkan", color: "bg-destructive text-white" },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="font-headline text-sm text-muted-foreground">Kembali</span>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              aria-label="Edit fermentasi"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={createShareCode}
              disabled={isShareLoading}
              aria-label="Bagikan fermentasi"
            >
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleting(true)}
              aria-label="Hapus fermentasi"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!isEditing && <ProgressRing progress={progress} size={56} strokeWidth={5} />}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="edit-name" className="font-headline text-xs uppercase text-muted-foreground mb-1.5 block">
                        Nama Fermentasi
                      </Label>
                      <Input
                        id="edit-name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="font-headline"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="font-headline text-xl text-foreground">{fermentation.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-sm text-muted-foreground">
                        {fermentation.type === "POC" ? (
                          <>
                            <FlaskConical className="inline h-4 w-4 mr-1" /> POC
                          </>
                        ) : (
                          <>
                            <Droplets className="inline h-4 w-4 mr-1" /> Eco Enzym
                          </>
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {!isEditing && <Badge className={statusMap[status].color}>{statusMap[status].label}</Badge>}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start" className="font-headline text-xs uppercase text-muted-foreground mb-1.5 block">
                    Tanggal Mulai
                  </Label>
                  <Input
                    id="edit-start"
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-days" className="font-headline text-xs uppercase text-muted-foreground mb-1.5 block">
                    Estimasi Hari
                  </Label>
                  <Input
                    id="edit-days"
                    type="number"
                    min={1}
                    value={editTotalDays}
                    onChange={(e) => setEditTotalDays(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-notes" className="font-headline text-xs uppercase text-muted-foreground mb-1.5 block">
                  Catatan
                </Label>
                <Textarea
                  id="edit-notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={saveChanges}
                  disabled={isSaving || !editName.trim() || isNaN(parseInt(editTotalDays, 10))}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Simpan
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEdit} disabled={isSaving}>
                  <X className="h-4 w-4 mr-1" />
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-muted p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-headline text-xs uppercase">Mulai</span>
                  </div>
                  <p className="font-body text-sm font-medium">{format(start, "d MMMM yyyy", { locale: id })} </p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-headline text-xs uppercase">Target Selesai</span>
                  </div>
                  <p className="font-body text-sm font-medium">{format(end, "d MMMM yyyy", { locale: id })} </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-headline text-xs uppercase text-muted-foreground">
                  <span>Progress</span>
                  <span>{elapsed} / {total} hari</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-forest dark:bg-secondary transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {fermentation.notes && (
                <div className="rounded-xl bg-muted p-3">
                  <span className="font-headline text-xs uppercase text-muted-foreground">Catatan</span>
                  <p className="font-body text-sm mt-1">{fermentation.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {status === "ACTIVE" && (
                  <Button variant="secondary" size="sm" onClick={() => updateStatus("COMPLETED")} disabled={isSaving}>
                    <Check className="h-4 w-4 mr-1" /> Selesai
                  </Button>
                )}
                {(status === "ACTIVE" || status === "PAUSED") && (
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => updateStatus("ABORTED")} disabled={isSaving}>
                    <X className="h-4 w-4 mr-1" /> Batalkan
                  </Button>
                )}
              </div>

              {/* Share code display */}
              {shareCode && (
                <div className="mt-3 rounded-xl bg-muted/50 border border-border p-3">
                  <p className="font-headline text-xs uppercase text-muted-foreground mb-2">Kode Berbagi</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-background rounded-xl px-4 py-2.5 font-headline text-lg font-bold text-forest dark:text-secondary tracking-wider text-center">
                      {shareCode}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={copyShareCode}
                      aria-label="Salin kode"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-2">
                    Bagikan kode ini agar orang lain dapat mengakses dan mengedit batch fermentasi ini.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive mt-2 w-full"
                    onClick={async () => {
                      if (!confirm("Cabut kode berbagi? Kode yang sudah dibagikan tidak bisa digunakan lagi, tapi anggota yang sudah bergabung tetap memiliki akses.")) return
                      setIsShareLoading(true)
                      try {
                        const res = await apiFetch(`/api/fermentations/${fermentation.id}/share`, {
                          method: "DELETE",
                        })
                        if (res.ok) {
                          setShareCode(null)
                          toast({
                            title: "Kode dicabut",
                            description: "Kode berbagi telah dinonaktifkan.",
                          })
                        } else {
                          const data = await res.json()
                          handleApiError(data, "Gagal mencabut kode")
                        }
                      } catch {
                        toast({
                          title: "Gagal mencabut kode",
                          description: "Terjadi kesalahan. Silakan coba lagi.",
                          variant: "destructive",
                        })
                      } finally {
                        setIsShareLoading(false)
                      }
                    }}
                    disabled={isShareLoading}
                  >
                    Cabut Kode
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg text-foreground">Tugas & Jadwal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {fermentation.tasks.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-4">
              Belum ada tugas.
            </p>
          ) : (
            fermentation.tasks.map((task) => {
              const isOverdue = !task.completed && isPast(parseISO(task.scheduledDate))
              const isEditingTask = editingTaskId === task.id
              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                    task.completed ? "bg-muted/50" : "bg-muted"
                  }`}
                >
                  <button
                    className="mt-0.5"
                    onClick={async () => {
                      try {
                        const res = await apiFetch(`/api/tasks/${task.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ completed: !task.completed }),
                        })
                        if (!res.ok) {
                          const data = await res.json()
                          handleApiError(data, "Gagal mengubah tugas")
                          return
                        }
                        router.refresh()
                      } catch {
                        toast({
                          title: "Gagal mengubah tugas",
                          description: "Terjadi kesalahan. Silakan coba lagi.",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-lime dark:text-secondary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    {isEditingTask ? (
                      <div className="space-y-2">
                        <Input
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                          className="font-body text-sm h-9"
                          placeholder="Judul tugas"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            value={editTaskDate}
                            onChange={(e) => setEditTaskDate(e.target.value)}
                            className="font-body text-sm h-9 w-auto"
                          />
                          <Button size="sm" className="h-9 px-3" onClick={() => saveTask(task.id)} disabled={isSaving}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 px-3" onClick={cancelEditTask} disabled={isSaving}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`font-body text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </p>
                            <p className="font-body text-xs text-muted-foreground mt-0.5">
                              {format(parseISO(task.scheduledDate), "d MMMM yyyy", { locale: id })}
                              {isOverdue && (
                                <span className="text-destructive ml-1 inline-flex items-center">
                                  <AlertCircle className="h-3 w-3 mr-0.5" /> Terlambat
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => startEditTask(task)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 transition-colors"
                              aria-label="Edit tugas"
                            >
                              <PencilLine className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm("Hapus tugas ini?")) {
                                  await deleteTask(task.id)
                                }
                              }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              aria-label="Hapus tugas"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={(open) => setIsDeleting(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Fermentasi</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus fermentasi <strong>{fermentation.name}</strong>? Semua tugas dan data terkait akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={deleteFermentation}
              disabled={isSaving}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
