"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface ActionTask {
  id: string
  title: string
  description: string | null
  fermentationName: string
}

export function ActionRequiredCard({ task }: { task: ActionTask }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function markDone() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      })
      if (!res.ok) {
        toast({
          title: "Gagal menyelesaikan tugas",
          description: "Silakan coba lagi.",
          variant: "destructive",
        })
        return
      }
      router.refresh()
      toast({
        title: "Tugas selesai!",
        description: "Tugas berhasil ditandai selesai.",
      })
    } catch {
      toast({
        title: "Gagal menyelesaikan tugas",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-lime/15 dark:bg-secondary/10 rounded-2xl p-4 border border-lime/30 dark:border-secondary/20 shadow-level-1 relative overflow-hidden flex items-start gap-4">
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-lime dark:bg-secondary" />
      <div className="bg-forest dark:bg-secondary text-white dark:text-secondary-foreground w-12 h-12 rounded-full flex items-center justify-center shrink-0">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h4 className="font-headline text-base text-foreground font-semibold truncate">
          {task.title}
        </h4>
        <p className="font-body text-sm text-muted-foreground">
          {task.description || task.fermentationName}
        </p>
      </div>
      <Button
        size="sm"
        className="self-center shrink-0"
        onClick={markDone}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Done"
        )}
      </Button>
    </div>
  )
}
