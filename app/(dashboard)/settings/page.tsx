import { requireAuth } from "@/lib/session"
import { SettingsContent } from "./settings-content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pengaturan",
  description: "Atur preferensi aplikasi Grahita termasuk tema, notifikasi push, dan panduan penggunaan.",
}

export default async function SettingsPage() {
  const session = await requireAuth()

  return (
    <SettingsContent user={session.user} />
  )
}
