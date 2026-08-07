import { Metadata } from "next"
import { FermentationsClient } from "./fermentations-client"

export const metadata: Metadata = {
  title: "Kelola Fermentasi",
  description: "Kelola seluruh fermentasi pengguna aplikasi Grahita.",
}

export default function AdminFermentationsPage() {
  return <FermentationsClient />
}
