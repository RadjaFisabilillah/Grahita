"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Image from "next/image"

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirm = formData.get("confirm") as string

    if (password !== confirm) {
      setError("Password dan konfirmasi password tidak cocok")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan. Coba lagi nanti.")
        setIsLoading(false)
        return
      }

      setSuccess(true)
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
        <CardTitle className="font-headline text-2xl">Atur Ulang Password</CardTitle>
        <CardDescription className="font-body">
          Buat password baru untuk akun Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {success ? (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-lime/20 dark:bg-lime/10 border border-lime/30 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-forest mt-0.5 shrink-0" />
              <p className="font-body text-xs text-forest dark:text-lime">
                Password berhasil diubah. Silakan masuk dengan password baru Anda.
              </p>
            </div>
            <Button asChild className="w-full font-headline">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" /> Ke Halaman Masuk
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-headline text-xs uppercase tracking-wider">Password Baru</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="font-headline text-xs uppercase tracking-wider">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirm ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <p className="font-body text-xs text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full font-headline" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Password Baru"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
