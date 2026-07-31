import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { db } from "@/lib/db"
import { z } from "zod"

const subscribeSchema = z.object({
  endpoint: z.string(),
  p256dh: z.string(),
  auth: z.string(),
})

export async function POST(req: Request) {
  const session = await requireAuth()
  const body = await req.json()
  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  await db.pushSubscription.upsert({
    where: { endpoint: parsed.data.endpoint },
    create: {
      userId: session.user.id,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.p256dh,
      auth: parsed.data.auth,
    },
    update: {
      userId: session.user.id,
      p256dh: parsed.data.p256dh,
      auth: parsed.data.auth,
    },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const session = await requireAuth()
  const body = await req.json()
  const { endpoint } = body

  if (!endpoint || typeof endpoint !== "string") {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
  }

  await db.pushSubscription.deleteMany({
    where: { endpoint, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
