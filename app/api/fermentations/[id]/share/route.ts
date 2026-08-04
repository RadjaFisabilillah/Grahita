import { NextResponse } from "next/server"
import { requireAuthApi } from "@/lib/session"
import { db } from "@/lib/db"

function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuthApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    const fermentation = await db.fermentation.findUnique({
      where: { id, userId: session.user.id },
    })
    if (!fermentation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // If already has share code, return it
    if (fermentation.shareCode) {
      return NextResponse.json({ shareCode: fermentation.shareCode })
    }

    // Generate unique share code
    let shareCode = generateShareCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await db.fermentation.findUnique({ where: { shareCode } })
      if (!existing) break
      shareCode = generateShareCode()
      attempts++
    }

    if (attempts >= 10) {
      return NextResponse.json({ error: "Failed to generate share code" }, { status: 500 })
    }

    await db.fermentation.update({
      where: { id },
      data: { shareCode },
    })

    return NextResponse.json({ shareCode })
  } catch {
    return NextResponse.json({ error: "Failed to create share code" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuthApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    const fermentation = await db.fermentation.findUnique({
      where: { id, userId: session.user.id },
    })
    if (!fermentation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Revoke share code
    await db.fermentation.update({
      where: { id },
      data: { shareCode: null },
    })

    // Optionally delete all shares too, or keep them so existing members still have access.
    // For now we keep shares but revoke the code.

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to revoke share code" }, { status: 500 })
  }
}
