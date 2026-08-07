import { Metadata } from "next"
import { OverviewClient } from "./overview-client"

export const metadata: Metadata = {
  title: "Admin Overview",
  description: "Ringkasan statistik aplikasi Grahita.",
}

export default function AdminOverviewPage() {
  return <OverviewClient />
}
