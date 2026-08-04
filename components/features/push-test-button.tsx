"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { apiFetch, handleApiError } from "@/lib/api-client"
import { cn } from "@/lib/utils"

export function PushTestButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleTestPush() {
    setStatus("loading")
    setMessage("")
    try {
      const res = await apiFetch("/api/test-push", {
        method: "POST",
      })
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage(data.message || "Notifikasi terkirim! Cek notifikasi di device Anda.")
      } else {
        setStatus("error")
        handleApiError(data, "Gagal mengirim notifikasi. Pastikan push notifikasi sudah diaktifkan.")
      }
    } catch {
      setStatus("error")
      setMessage("Terjadi kesalahan jaringan. Coba lagi.")
    }
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleTestPush}
        disabled={status === "loading"}
        className="w-full justify-start gap-2"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === "success" ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : status === "error" ? (
          <AlertCircle className="h-4 w-4 text-red-500" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === "loading"
          ? "Mengirim..."
          : status === "success"
            ? "Terkirim!"
            : status === "error"
              ? "Coba Lagi"
              : "Kirim Notifikasi Uji Coba"}
      </Button>
      {message && (
        <div
          className={cn(
            "text-xs font-body px-1 py-1.5 rounded-lg",
            status === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          )}
        >
          {message}
        </div>
      )}
    </div>
  )
}
