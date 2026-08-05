import { NextResponse } from "next/server"
import { requireAuthApi } from "@/lib/session"
import { db } from "@/lib/db"
import webPush from "web-push"

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@grahita.app"

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
}

export async function POST() {
  const session = await requireAuthApi()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const subscriptions = await db.pushSubscription.findMany({
      where: { userId: session.user.id },
    })

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada subscription push notifikasi. Aktifkan notifikasi push di pengaturan terlebih dahulu." },
        { status: 400 }
      )
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        { error: "VAPID keys tidak dikonfigurasi" },
        { status: 500 }
      )
    }

    let sentCount = 0
    const errors: string[] = []

    for (const sub of subscriptions) {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify({
            title: "Test Notifikasi Grahita",
            body: "Notifikasi ini adalah uji coba. Push notification berfungsi dengan baik!",
            tag: "grahita-test-notification",
            requireInteraction: false,
            renotify: true,
          })
        )
        sentCount++
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        errors.push(errorMsg)
        if (
          errorMsg.includes("expired") ||
          errorMsg.includes("unsubscribe") ||
          errorMsg.includes("NotRegistered") ||
          errorMsg.includes("InvalidRegistration")
        ) {
          await db.pushSubscription.delete({ where: { endpoint: sub.endpoint } })
        }
      }
    }

    if (sentCount === 0) {
      return NextResponse.json(
        { error: "Gagal mengirim notifikasi", details: errors },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      message: `Notifikasi uji coba berhasil dikirim ke ${sentCount} device(s)`,
    })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
