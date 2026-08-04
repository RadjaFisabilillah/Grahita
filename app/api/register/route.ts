import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-actions"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await registerUser(body)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: result.user }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi nanti." },
      { status: 500 }
    )
  }
}
