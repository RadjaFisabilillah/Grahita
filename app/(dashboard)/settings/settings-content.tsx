"use client"

import { useState } from "react"
import Link from "next/link"
import { logoutAction } from "./logout-action"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/features/theme-toggle"
import { WalkthroughModal } from "@/components/features/walkthrough-modal"
import { PushSubscriptionToggle } from "@/components/features/push-subscription"
import { PushTestButton } from "@/components/features/push-test-button"
import { LogOut, Smartphone, BookOpen, ChevronRight, ShieldCheck } from "lucide-react"

export function SettingsContent({
  user,
}: {
  user: { name?: string | null; email: string; role?: string }
}) {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl font-bold text-foreground">Pengaturan</h1>
        <p className="font-body text-sm text-muted-foreground">Atur preferensi aplikasi</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-base">Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm font-medium">{user.name || user.email}</p>
              <p className="font-body text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          {user.role === "ADMIN" && (
            <>
              <Separator />
              <Link href="/admin">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Dashboard Admin
                </Button>
              </Link>
            </>
          )}
          <Separator />
          <form action={logoutAction}>
            <Button variant="destructive" size="sm" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-base">Panduan</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={() => setWalkthroughOpen(true)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-forest/10 dark:bg-secondary/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-forest dark:text-secondary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-body text-sm font-medium text-foreground">Panduan Penggunaan</p>
              <p className="font-body text-xs text-muted-foreground">Cara membuat Eco Enzym dan POC</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-base">Tampilan</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-base">Notifikasi & PWA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PushSubscriptionToggle />
          <PushTestButton />
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-body text-sm">Install ke Home Screen</p>
                <p className="font-body text-xs text-muted-foreground">Tambahkan ke layar utama HP</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <WalkthroughModal isOpen={walkthroughOpen} onClose={() => setWalkthroughOpen(false)} />
    </div>
  )
}
