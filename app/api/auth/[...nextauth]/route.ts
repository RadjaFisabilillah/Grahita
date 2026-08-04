import { NextRequest } from "next/server"
import { GET as getAuth, POST as postAuth } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import { NextResponse } from "next/server"

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1"
}

export async function GET(req: NextRequest) {
  return getAuth(req)
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
  return postAuth(req)
}
