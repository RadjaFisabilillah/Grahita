"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import Image from "next/image"

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan. Coba lagi nanti.")
        setIsLoading(false)
        return
      }

      setSent(true)
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
        <CardTitle className="font-headline text-2xl">Lupa Password?</CardTitle>
        <CardDescription className="font-body">
          Masukkan email akun Anda. Kami akan mengirimkan link untuk reset password.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {sent ? (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-lime/20 dark:bg-lime/10 border border-lime/30 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-forest mt-0.5 shrink-0" />
              <p className="font-body text-xs text-forest dark:text-lime">
                Jika email terdaftar, link reset password telah dikirim. Periksa kotak masuk dan
                folder spam Anda. Link berlaku selama 15 menit.
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full font-body"
            >
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Masuk
              </Link>
            </Button>
          </div>
        ) : (
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
                  Mengirim...
                </>
              ) : (
                "Kirim Link Reset"
              )}
            </Button>

            <div className="text-center">
              <p className="font-body text-sm text-muted-foreground">
                Ingat password?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-foreground hover:underline underline-offset-4"
                >
                  Masuk
                </Link>
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
