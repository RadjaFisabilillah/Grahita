import { auth } from "@/lib/auth"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) {
    const { redirect } = await import("next/navigation")
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
    return null
  }
  return session as { user: { id: string; email: string; name: string | null } }
}
