import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ResetPasswordForm } from "./reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Atur ulang password akun Grahita Anda.",
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  const params = await searchParams
  const token = typeof params.token === "string" ? params.token : ""

  if (!token) {
    redirect("/forgot-password")
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-5">
      <ResetPasswordForm token={token} />
    </div>
  )
}
