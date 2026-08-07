import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { requireAdminApi } from "@/lib/session"
import { db } from "@/lib/db"

const resetSchema = z.object({
  password: z.string().min(6),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const parsed = resetSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 })
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12)

    await db.user.update({
      where: { id },
      data: { password: hashed },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi nanti." },
      { status: 500 }
    )
  }
}
