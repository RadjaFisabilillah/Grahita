import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke Grahita untuk memantau proses fermentasi POC dan Eco Enzym Anda.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  const params = await searchParams
  const expired = params.expired === "true"
  const registered = params.registered === "true"
  const errorParam = typeof params.error === "string" ? params.error : undefined

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-5">
      <LoginForm
        expired={expired}
        registered={registered}
        errorParam={errorParam}
      />
    </div>
  )
}
