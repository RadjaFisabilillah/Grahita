import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }
  return session as { user: { id: string; email: string; name: string | null } }
}

export async function getSessionUser() {
  const session = await auth()
  return session?.user ?? null
}
