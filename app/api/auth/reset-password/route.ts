import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/db"

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Token dan password tidak valid. Password minimal 6 karakter." },
        { status: 400 }
      )
    }

    const { token, password } = parsed.data

    const resetToken = await db.passwordResetToken.findUnique({ where: { token } })
    if (!resetToken) {
      return NextResponse.json(
        { error: "Token tidak valid atau sudah digunakan." },
        { status: 400 }
      )
    }

    if (resetToken.expiresAt < new Date()) {
      await db.passwordResetToken.delete({ where: { token } })
      return NextResponse.json(
        { error: "Link reset password sudah kedaluwarsa. Silakan minta ulang." },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({ where: { email: resetToken.email } })
    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)

    await db.user.update({
      where: { id: user.id },
      data: { password: hashed },
    })

    await db.passwordResetToken.deleteMany({ where: { email: resetToken.email } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi nanti." },
      { status: 500 }
    )
  }
}
