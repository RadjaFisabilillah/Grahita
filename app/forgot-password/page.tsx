import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata: Metadata = {
  title: "Lupa Password",
  description: "Minta link reset password akun Grahita Anda.",
}

export default async function ForgotPasswordPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-5">
      <ForgotPasswordForm />
    </div>
  )
}
