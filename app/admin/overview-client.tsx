"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiFetch, handleApiError } from "@/lib/api-client"
import { Loader2, Users, FlaskConical, Activity, ListChecks, CheckCircle2, ChevronRight } from "lucide-react"

interface Stats {
  totalUsers: number
  totalFermentations: number
  activeFermentations: number
  tasksToday: number
  tasksCompleted: number
}

interface RecentUser {
  id: string
  email: string
  name: string | null
  role: "USER" | "ADMIN"
  createdAt: string
}

interface RecentFermentation {
  id: string
  name: string
  type: "POC" | "ECO_ENZYM"
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "ABORTED"
  createdAt: string
  user: { email: string; name: string | null }
}

interface OverviewData {
  stats: Stats
  recentUsers: RecentUser[]
  recentFermentations: RecentFermentation[]
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Aktif",
  PAUSED: "Jeda",
  COMPLETED: "Selesai",
  ABORTED: "Dibatalkan",
}

export function OverviewClient() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await apiFetch("/api/admin/stats")
        const json = await res.json()
        if (res.ok && active) setData(json)
        else if (!res.ok) handleApiError(json, "Gagal memuat statistik")
      } catch {
        // apiFetch handles 401 redirect
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) return null

  const statCards = [
    { label: "Total Pengguna", value: data.stats.totalUsers, icon: Users },
    { label: "Total Fermentasi", value: data.stats.totalFermentations, icon: FlaskConical },
    { label: "Fermentasi Aktif", value: data.stats.activeFermentations, icon: Activity },
    { label: "Tugas Hari Ini", value: data.stats.tasksToday, icon: ListChecks },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl font-bold text-foreground">Overview</h1>
        <p className="font-body text-sm text-muted-foreground">Ringkasan aktivitas aplikasi Grahita</p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <Card key={card.label} className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <card.icon className="h-4 w-4" />
                <span className="font-body text-xs">{card.label}</span>
              </div>
              <p className="font-headline text-3xl font-bold text-foreground mt-2">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-base">Pengguna Terbaru</CardTitle>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1 font-body text-xs text-forest hover:underline"
            >
              Lihat semua <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-forest/10 dark:bg-secondary/20 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 text-forest dark:text-secondary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium truncate">{u.name || "Tanpa nama"}</p>
                  <p className="font-body text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <Badge variant={u.role === "ADMIN" ? "default" : "outline"} className="shrink-0">
                  {u.role === "ADMIN" ? "Admin" : "User"}
                </Badge>
              </div>
            ))}
            {data.recentUsers.length === 0 && (
              <p className="font-body text-sm text-muted-foreground">Belum ada pengguna.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-base">Fermentasi Terbaru</CardTitle>
            <Link
              href="/admin/fermentations"
              className="inline-flex items-center gap-1 font-body text-xs text-forest hover:underline"
            >
              Lihat semua <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentFermentations.map((f) => (
              <div key={f.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-forest/10 dark:bg-secondary/20 flex items-center justify-center shrink-0">
                  <FlaskConical className="h-4 w-4 text-forest dark:text-secondary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium truncate">{f.name}</p>
                  <p className="font-body text-xs text-muted-foreground truncate">
                    {f.type === "POC" ? "POC" : "Eco Enzym"} · {f.user.name || f.user.email}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {STATUS_LABEL[f.status]}
                </Badge>
              </div>
            ))}
            {data.recentFermentations.length === 0 && (
              <p className="font-body text-sm text-muted-foreground">Belum ada fermentasi.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completed tasks highlight */}
      <Card className="rounded-2xl bg-forest text-white">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-lime text-forest flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="font-headline text-2xl font-bold">{data.stats.tasksCompleted}</p>
            <p className="font-body text-sm text-white/80">Tugas telah diselesaikan</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
