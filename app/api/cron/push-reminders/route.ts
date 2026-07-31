import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import webPush from "web-push"
import { startOfDay, endOfDay } from "date-fns"

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@grahita.app"

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
}

// Simple auth for cron requests
function isAuthorized(req: Request) {
  const authHeader = req.headers.get("authorization")
  // Check for Vercel Cron secret or x-vercel-signature
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    return token === process.env.CRON_SECRET
  }
  // Allow if called from localhost in development
  const url = new URL(req.url)
  if (process.env.NODE_ENV === "development" && url.hostname === "localhost") {
    return true
  }
  return false
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = new Date()
  const dayStart = startOfDay(today)
  const dayEnd = endOfDay(today)

  // Find all incomplete tasks due today
  const tasksDueToday = await db.task.findMany({
    where: {
      completed: false,
      scheduledDate: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
    include: {
      fermentation: {
        select: {
          name: true,
          userId: true,
        },
      },
    },
  })

  if (tasksDueToday.length === 0) {
    return NextResponse.json({ sent: 0, message: "No tasks due today" })
  }

  // Group tasks by user
  const tasksByUser = new Map<string, typeof tasksDueToday>()
  for (const task of tasksDueToday) {
    const userId = task.fermentation.userId
    if (!tasksByUser.has(userId)) {
      tasksByUser.set(userId, [])
    }
    tasksByUser.get(userId)!.push(task)
  }

  let sentCount = 0
  const errors: string[] = []

  // Send notifications per user
  for (const [userId, tasks] of tasksByUser) {
    const subscriptions = await db.pushSubscription.findMany({
      where: { userId },
    })

    if (subscriptions.length === 0) continue

    const fermentationName = tasks[0].fermentation.name
    const taskCount = tasks.length
    const title = taskCount === 1 ? `Tugas Hari Ini` : `${taskCount} Tugas Hari Ini`
    const body =
      taskCount === 1
        ? `${tasks[0].title} — ${fermentationName}`
        : `${taskCount} tugas fermentasi "${fermentationName}" perlu dikerjakan`

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
            title,
            body,
            tag: `grahita-task-${today.toISOString().split("T")[0]}`,
          })
        )
        sentCount++
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        errors.push(errorMsg)
        // Remove invalid/expired subscriptions
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
  }

  return NextResponse.json({
    sent: sentCount,
    tasksFound: tasksDueToday.length,
    usersNotified: tasksByUser.size,
    errors: errors.length > 0 ? errors : undefined,
  })
}
