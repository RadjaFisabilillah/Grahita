"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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
    <Card className="w-full max-w-sm border-0 shadow-none">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center overflow-hidden">
            <img src="/icon-512x512.png" alt="Grahita" className="h-full w-full object-cover" />
          </div>
        </div>
        <CardTitle className="font-headline text-2xl">Grahita</CardTitle>
        <CardDescription className="font-body">
          Monitoring fermentasi POC & Eco Enzym
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="password" className="font-headline text-xs uppercase tracking-wider">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
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
      </CardContent>
    </Card>
  )
}
