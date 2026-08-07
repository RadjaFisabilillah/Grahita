import { auth } from "@/lib/auth"
import type { Session } from "next-auth"

export type Role = "USER" | "ADMIN"

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: Role
}

function assertSessionUser(session: Session | null): SessionUser {
  if (!session?.user?.id || !session?.user?.email) {
    throw new Error("Invalid session")
  }
  return session.user as SessionUser
}

export async function requireAuth(): Promise<{ user: SessionUser }> {
  const session = await auth()
  if (!session?.user?.id) {
    const { redirect } = await import("next/navigation")
    redirect("/login?expired=true")
  }
  return { user: assertSessionUser(session) }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  try {
    return assertSessionUser(session)
  } catch {
    return null
  }
}

export async function requireAuthApi(): Promise<{ user: SessionUser } | null> {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }
  try {
    return { user: assertSessionUser(session) }
  } catch {
    return null
  }
}

export function isAdmin(user: { role?: string }): boolean {
  return user.role === "ADMIN"
}

/**
 * Server-side guard for admin pages. Redirects non-admin users to /dashboard.
 */
export async function requireAdmin(): Promise<{ user: SessionUser }> {
  const { user } = await requireAuth()
  if (!isAdmin(user)) {
    const { redirect } = await import("next/navigation")
    redirect("/dashboard")
  }
  return { user }
}

/**
 * API guard for admin-only endpoints. Returns null if not authorized.
 */
export async function requireAdminApi(): Promise<{ user: SessionUser } | null> {
  const result = await requireAuthApi()
  if (!result) return null
  if (!isAdmin(result.user)) return null
  return result
}
