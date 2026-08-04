"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

const PUBLIC_PATHS = ["/login", "/register", "/offline", "/"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "unauthenticated" && !PUBLIC_PATHS.includes(pathname)) {
      router.replace("/login?expired=true")
    }
  }, [status, pathname, router])

  // Don't block render on loading — let the page handle its own loading state
  // This prevents flash of login redirect during initial hydration
  return <>{children}</>
}
