import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface ResetPasswordEmailProps {
  resetUrl: string
  userEmail: string
}

export function ResetPasswordEmail({ resetUrl, userEmail }: ResetPasswordEmailProps) {
  return (
    <Html lang="id">
      <Head />
      <Preview>Reset password akun Grahita Anda</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Password Grahita</Heading>
          <Text style={text}>Halo,</Text>
          <Text style={text}>
            Kami menerima permintaan reset password untuk akun <strong>{userEmail}</strong>. Klik
            tombol di bawah untuk mengatur ulang password Anda.
          </Text>
          <Section style={buttonSection}>
            <Link href={resetUrl} style={button}>
              Reset Password
            </Link>
          </Section>
          <Text style={text}>
            Atau salin link berikut ke browser Anda:
          </Text>
          <Text style={linkText}>{resetUrl}</Text>
          <Hr style={hr} />
          <Text style={muted}>
            Link ini berlaku selama 15 menit. Jika Anda tidak meminta reset password, abaikan email
            ini.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ResetPasswordEmail

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "24px 0",
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: "12px",
  padding: "40px 32px",
  margin: "0 auto",
  maxWidth: "480px",
}

const h1 = {
  color: "#0b493a",
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 16px",
}

const text = {
  color: "#18181b",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 12px",
}

const buttonSection = {
  textAlign: "center" as const,
  margin: "24px 0",
}

const button = {
  backgroundColor: "#0b493a",
  borderRadius: "12px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
}

const linkText = {
  color: "#0b493a",
  fontSize: "12px",
  lineHeight: "1.5",
  wordBreak: "break-all" as const,
  margin: "0 0 12px",
}

const hr = {
  borderColor: "#e4e4e7",
  margin: "24px 0",
}

const muted = {
  color: "#71717a",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
}
