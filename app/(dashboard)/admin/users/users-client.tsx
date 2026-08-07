"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Loader2, User, Trash2, KeyRound, AlertTriangle } from "lucide-react"

interface AdminUser {
  id: string
  email: string
  name: string | null
  role: "USER" | "ADMIN"
  createdAt: string
  _count: { fermentations: number }
}

export function UsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [resetPassword, setResetPassword] = useState("")
  const [busy, setBusy] = useState(false)

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await apiFetch("/api/admin/users")
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users)
      } else {
        handleApiError(data, "Gagal memuat pengguna")
      }
    } catch {
      // apiFetch handles 401 redirect
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!resetTarget || resetPassword.length < 6) return
    setBusy(true)
    try {
      const res = await apiFetch(`/api/admin/users/${resetTarget.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setResetTarget(null)
        setResetPassword("")
      } else {
        handleApiError(data, "Gagal mereset password")
      }
    } catch {
      // apiFetch handles 401 redirect
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setBusy(true)
    try {
      const res = await apiFetch(`/api/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (res.ok) {
        setDeleteTarget(null)
        await loadUsers()
      } else {
        handleApiError(data, "Gagal menghapus pengguna")
      }
    } catch {
      // apiFetch handles 401 redirect
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl font-bold text-foreground">Kelola Pengguna</h1>
        <p className="font-body text-sm text-muted-foreground">{users.length} akun terdaftar</p>
      </header>

      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest/10 dark:bg-secondary/20 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-forest dark:text-secondary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-body text-sm font-medium truncate">{u.name || "Tanpa nama"}</p>
                    <Badge
                      variant={u.role === "ADMIN" ? "default" : "outline"}
                      className="shrink-0"
                    >
                      {u.role === "ADMIN" ? "Admin" : "User"}
                    </Badge>
                  </div>
                  <p className="font-body text-xs text-muted-foreground truncate">{u.email}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {u._count.fermentations} fermentasi · terdaftar{" "}
                    {new Date(u.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setResetTarget(u)
                    setResetPassword("")
                  }}
                  className="gap-1.5"
                >
                  <KeyRound className="h-3.5 w-3.5" /> Reset Password
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive gap-1.5"
                  onClick={() => setDeleteTarget(u)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && (
          <p className="text-center font-body text-sm text-muted-foreground py-10">
            Belum ada pengguna.
          </p>
        )}
      </div>

      {/* Reset password dialog */}
      <Dialog open={!!resetTarget} onOpenChange={(open) => !open && setResetTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Atur password baru untuk <strong>{resetTarget?.email}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-password" className="font-headline text-xs uppercase tracking-wider">
                Password Baru
              </Label>
              <Input
                id="reset-password"
                type="text"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setResetTarget(null)} disabled={busy}>
                Batal
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Hapus akun?
            </DialogTitle>
            <DialogDescription>
              Akun <strong>{deleteTarget?.email}</strong> beserta seluruh fermentasi dan datanya
              akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
