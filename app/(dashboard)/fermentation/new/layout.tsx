import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fermentasi Baru",
  description: "Tambah fermentasi POC atau Eco Enzym baru untuk dipantau.",
}

export default function NewFermentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
