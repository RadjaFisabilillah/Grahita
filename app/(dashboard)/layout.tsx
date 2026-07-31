import { requireAuth } from "@/lib/session"
import { TopAppBar } from "@/components/features/top-app-bar"
import { SpeedDial } from "@/components/features/speed-dial"
import { BottomNav } from "@/components/features/bottom-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth()

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <TopAppBar userName={session.user.name || session.user.email} />
      <main className="max-w-lg mx-auto px-5 py-6">{children}</main>
      <SpeedDial />
      <BottomNav />
    </div>
  )
}
