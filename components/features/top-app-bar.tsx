"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { WalkthroughModal } from "./walkthrough-modal"
import { HelpCircle } from "lucide-react"

export function TopAppBar({ userName }: { userName: string }) {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false)
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-5 h-16">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/icon-512x512.png" alt="Grahita" className="h-full w-full object-cover" />
          </div>
          <h1 className="font-headline text-xl font-bold text-foreground tracking-tight">
            Grahita
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWalkthroughOpen(true)}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Buka panduan pembuatan"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <Link href="/settings">
            <Avatar className="h-10 w-10 border border-border cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarFallback className="bg-forest dark:bg-secondary text-white dark:text-secondary-foreground font-headline text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      <WalkthroughModal isOpen={walkthroughOpen} onClose={() => setWalkthroughOpen(false)} />
    </>
  )
}
