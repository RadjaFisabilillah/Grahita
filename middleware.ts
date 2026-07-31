import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function middleware(request: Request) {
  const session = await auth()
  const pathname = new URL(request.url).pathname

  const publicPaths = ["/login", "/api/auth"]
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|icon-|manifest).*)"],
}
