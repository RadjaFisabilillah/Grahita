import { Metadata } from "next"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke Grahita untuk memantau proses fermentasi POC dan Eco Enzym Anda.",
}

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-5">
      <LoginForm />
    </div>
  )
}
