import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-actions"
import { rateLimit } from "@/lib/rate-limit"

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1"
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const limit = rateLimit(ip)
  if (!limit.success) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
    )
  }

  try {
    const body = await req.json()
    const result = await registerUser(body)

    if (!result.success) {
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