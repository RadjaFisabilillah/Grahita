import { Metadata } from "next"
import { TasksClient } from "./tasks-client"

export const metadata: Metadata = {
  title: "Kelola Tugas",
  description: "Kelola seluruh tugas pengguna aplikasi Grahita.",
}

export default function AdminTasksPage() {
  return <TasksClient />
}
