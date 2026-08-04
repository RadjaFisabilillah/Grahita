import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login?expired=true")
  }
  return session as { user: { id: string; email: string; name: string | null } }
}

export async function getSessionUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function requireAuthApi() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return session as { user: { id: string; email: string; name: string | null } }
}
