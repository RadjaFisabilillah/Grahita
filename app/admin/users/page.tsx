import { Metadata } from "next"
import { UsersClient } from "./users-client"

export const metadata: Metadata = {
  title: "Kelola Pengguna",
  description: "Kelola akun pengguna aplikasi Grahita.",
}

export default function AdminUsersPage() {
  return <UsersClient />
}
