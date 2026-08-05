import { auth } from "@/lib/auth"
import type { Session } from "next-auth"

export interface SessionUser {
  id: string
  email: string
  name: string | null
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
