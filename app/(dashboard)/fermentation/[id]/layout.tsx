import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Detail Fermentasi",
  description: "Lihat detail progres fermentasi, tugas jadwal, dan riwayat fermentasi Anda.",
}

export default function FermentationDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
