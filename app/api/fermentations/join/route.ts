import { NextResponse } from "next/server"
import { requireAuthApi } from "@/lib/session"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await requireAuthApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { shareCode } = body

    if (!shareCode || typeof shareCode !== "string") {
      return NextResponse.json({ error: "Share code is required" }, { status: 400 })
    }

    const fermentation = await db.fermentation.findUnique({
      where: { shareCode: shareCode.toUpperCase().trim() },
    })

    if (!fermentation) {
      return NextResponse.json({ error: "Kode tidak ditemukan" }, { status: 404 })
    }

    if (fermentation.userId === session.user.id) {
      return NextResponse.json({ error: "Anda sudah adalah pemilik fermentasi ini" }, { status: 400 })
    }

    // Check if already joined
    const existing = await db.fermentationShare.findUnique({
      where: {
        fermentationId_userId: {
          fermentationId: fermentation.id,
          userId: session.user.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Anda sudah bergabung di fermentasi ini" }, { status: 400 })
    }

    await db.fermentationShare.create({
      data: {
        fermentationId: fermentation.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true, fermentationId: fermentation.id })
  } catch {
    return NextResponse.json({ error: "Failed to join fermentation" }, { status: 500 })
  }
}
