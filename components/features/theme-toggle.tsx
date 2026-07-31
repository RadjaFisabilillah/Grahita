"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Moon className="h-5 w-5 text-muted-foreground" />
        <div>
          <Label htmlFor="dark-mode" className="font-body text-sm">Mode Gelap</Label>
          <p className="font-body text-xs text-muted-foreground">Ubah tema aplikasi</p>
        </div>
      </div>
      <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={toggleTheme} />
    </div>
  )
}
