"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageCircle, Info } from "lucide-react"
import Image from "next/image"

const ADMIN_WHATSAPP = "62895635537407"

export function ForgotPasswordForm() {
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
          Hubungi admin untuk mengatur ulang password akun Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="p-4 rounded-2xl bg-muted/50 flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="font-body text-sm text-muted-foreground">
            Kirim pesan WhatsApp ke admin dengan menyertakan email akun Anda. Admin akan mereset
            password Anda.
          </p>
        </div>

        <a
          href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
            "Halo admin, saya lupa password akun Grahita saya. Email: "
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-headline font-semibold text-sm bg-[#25D366] text-white shadow-level-1 hover:opacity-90 active:scale-95 transition-all w-full"
        >
          <MessageCircle className="h-4 w-4" />
          Hubungi Admin via WhatsApp
        </a>

        <Button asChild variant="ghost" className="w-full font-body">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Masuk
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
