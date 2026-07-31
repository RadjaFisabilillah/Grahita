"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, Loader2 } from "lucide-react"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushSubscriptionToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setIsSupported(false)
      setIsLoading(false)
      return
    }

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        setIsSubscribed(!!subscription)
        setIsLoading(false)
      })
    })
  }, [])

  async function subscribe() {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) return

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      const subscriptionJson = subscription.toJSON()
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subscriptionJson.endpoint,
          p256dh: subscriptionJson.keys?.p256dh,
          auth: subscriptionJson.keys?.auth,
        }),
      })

      setIsSubscribed(true)
    } catch {
      // Subscription failed silently; user can retry via toggle
    } finally {
      setIsLoading(false)
    }
  }

  async function unsubscribe() {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        await fetch("/api/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
      }
      setIsSubscribed(false)
    } catch {
      // Unsubscribe failed silently
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="flex items-center justify-between opacity-50">
        <div className="flex items-center gap-3">
          <BellOff className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-body text-sm">Notifikasi Push</p>
            <p className="font-body text-xs text-muted-foreground">Browser tidak mendukung push notification</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <div>
          <Label htmlFor="push-toggle" className="font-body text-sm">Notifikasi Push</Label>
          <p className="font-body text-xs text-muted-foreground">Pengingat tugas fermentasi</p>
        </div>
      </div>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <Switch
          id="push-toggle"
          checked={isSubscribed}
          onCheckedChange={(checked) => {
            if (checked) subscribe()
            else unsubscribe()
          }}
        />
      )}
    </div>
  )
}
