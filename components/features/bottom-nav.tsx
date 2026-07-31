"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CalendarDays, Settings } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Kalender", icon: CalendarDays },
  { href: "/settings", label: "Pengaturan", icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full relative transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-headline font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-lime dark:bg-secondary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
