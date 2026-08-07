"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { LayoutDashboard, Users, FlaskConical, ListChecks, ArrowLeft, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/fermentations", label: "Fermentasi", icon: FlaskConical },
  { href: "/admin/tasks", label: "Tugas", icon: ListChecks },
]

export function AdminShell({
  userName,
  children,
}: {
  userName: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-forest text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center overflow-hidden bg-white/10">
              <Image
                src="/icon-512x512.png"
                alt="Grahita"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-lg font-bold tracking-tight">Grahita</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-lime text-forest px-2 py-0.5 text-[10px] font-headline font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-3 w-3" /> Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block font-body text-sm text-white/80">{userName}</span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 font-body text-xs text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Aplikasi
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-56 shrink-0 border-r border-border/60 py-6 pr-4">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm transition-colors",
                    active
                      ? "bg-forest text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-5 py-6">{children}</main>
      </div>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/90 backdrop-blur-md border-t border-border/60">
        <div className="flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-2.5 font-body text-[10px]",
                  active ? "text-forest" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
