import { toast } from "@/components/ui/use-toast"

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init)

  if (res.status === 401) {
    // Session expired or unauthorized — redirect to login
    window.location.href = "/login?expired=true"
    // Throw to stop further processing in caller
    throw new Error("Session expired")
  }

  return res
}

export function handleApiError(data: { error?: string }, fallback = "Terjadi kesalahan") {
  const message = data.error || fallback
  toast({
    title: "Gagal",
    description: message,
    variant: "destructive",
  })
}
