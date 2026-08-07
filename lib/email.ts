import { Resend } from "resend"
import { render } from "@react-email/render"
import { ResetPasswordEmail } from "@/components/emails/reset-password-email"

const resend = new Resend(process.env.RESEND_API_KEY)

export const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Grahita <onboarding@resend.dev>"

export interface SendResetEmailInput {
  to: string
  resetUrl: string
}

export async function sendResetPasswordEmail({ to, resetUrl }: SendResetEmailInput) {
  const { data, error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: [to],
    subject: "Reset password akun Grahita Anda",
    html: await render(ResetPasswordEmail({ resetUrl, userEmail: to })),
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
