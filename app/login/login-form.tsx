"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LoginFormProps {
  expired?: boolean
  registered?: boolean
  errorParam?: string
}

export function LoginForm({ expired, registered, errorParam }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(errorParam || "")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email atau password salah")
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <>
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center overflow-hidden bg-forest">
              <Image
                src="/icon-512x512.svg"
                alt="Grahita"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <CardTitle className="font-headline text-2xl">Selamat datang kembali</CardTitle>
          <CardDescription className="font-body">
            Masuk untuk memantau fermentasi Anda
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Expired session banner */}
          {expired && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="font-body text-xs text-amber-700 dark:text-amber-300">
                Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.
              </p>
            </div>
          )}

          {/* Registered success banner */}
          {registered && (
            <div className="p-3 rounded-2xl bg-lime/20 dark:bg-lime/10 border border-lime/30 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-forest mt-0.5 shrink-0" />
              <p className="font-body text-xs text-forest dark:text-lime">
                Akun berhasil dibuat. Silakan masuk dengan email dan password Anda.
              </p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-headline text-xs uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-headline text-xs uppercase tracking-wider">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Badge variant="destructive" className="w-full justify-center">{error}</Badge>
            )}

            <Button type="submit" className="w-full font-headline" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="font-body text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-foreground hover:underline underline-offset-4"
              >
                Daftar
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotModal} onOpenChange={(open) => setShowForgotModal(open)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Lupa Password?</DialogTitle>
            <DialogDescription>
              Hubungi admin untuk reset password akun Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-muted/50 text-center space-y-2">
              <p className="font-body text-sm text-muted-foreground">
                Kirim pesan WhatsApp ke admin dengan menyertakan email akun Anda.
              </p>
              <a
                href="https://wa.me/62895635537407?text=Halo%20admin%2C%20saya%20lupa%20password%20akun%20Grahita%20saya.%20Email%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-headline font-semibold text-sm bg-[#25D366] text-white shadow-level-1 hover:opacity-90 active:scale-95 transition-all w-full"
              >
                Hubungi Admin via WhatsApp
              </a>
            </div>

            <Button
              variant="ghost"
              className="w-full font-body"
              onClick={() => setShowForgotModal(false)}
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
