import { NextRequest, NextResponse } from "next/server"
import { requireAdminApi } from "@/lib/session"
import { db } from "@/lib/db"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "Anda tidak dapat menghapus akun Anda sendiri." },
      { status: 400 }
    )
  }

  const user = await db.user.findUnique({ where: { id } })
  if (!user) {
    return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 })
  }

  await db.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
