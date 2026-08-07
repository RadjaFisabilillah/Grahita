import { requireAdmin } from "@/lib/session"
import { AdminShell } from "./admin-shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireAdmin()

  return <AdminShell userName={user.name || user.email}>{children}</AdminShell>
}
