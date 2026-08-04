import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Grahita baru untuk mulai memantau fermentasi POC dan Eco Enzym.",
}

export default async function RegisterPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-5">
      <RegisterForm />
    </div>
  )
}
