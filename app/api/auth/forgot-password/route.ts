import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { addMinutes } from "date-fns"
import { z } from "zod"
import { db } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"
import { sendResetPasswordEmail } from "@/lib/email"

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1"
}

function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL || "http://localhost:3000"
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const limit = rateLimit(ip)
  if (!limit.success) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
    )
  }

  try {
    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      // Return success anyway to avoid account enumeration
      return NextResponse.json({ success: true })
    }

    // Delete any existing valid tokens for this email to keep only one active
    await db.passwordResetToken.deleteMany({ where: { email } })

    const token = randomBytes(32).toString("hex")

    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt: addMinutes(new Date(), 15),
      },
    })

    const resetUrl = `${getBaseUrl()}/reset-password?token=${token}`

    try {
      await sendResetPasswordEmail({ to: email, resetUrl })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      return NextResponse.json(
        { error: `Gagal mengirim email: ${errorMsg}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi nanti." },
      { status: 500 }
    )
  }
}
