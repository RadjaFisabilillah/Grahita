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

  const task = await db.task.findUnique({ where: { id } })
  if (!task) {
    return NextResponse.json({ error: "Tugas tidak ditemukan." }, { status: 404 })
  }

  await db.task.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
