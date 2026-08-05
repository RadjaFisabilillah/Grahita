import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import webPush from "web-push"
import { startOfDay, endOfDay, addDays } from "date-fns"

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@grahita.app"

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
}

function isAuthorized(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    return token === process.env.CRON_SECRET
  }
  const url = new URL(req.url)
  if (process.env.NODE_ENV === "development" && url.hostname === "localhost") {
    return true
  }
  return false
}

interface TaskGroup {
  userId: string
  tasks: Array<{
    title: string
    fermentation: { name: string }
  }>
}

function groupTasksByUser(
  tasks: Array<{ title: string; fermentation: { name: string; userId: string } }>
): Map<string, TaskGroup> {
  const map = new Map<string, TaskGroup>()
  for (const task of tasks) {
    const userId = task.fermentation.userId
    if (!map.has(userId)) {
      map.set(userId, { userId, tasks: [] })
    }
    map.get(userId)!.tasks.push(task)
  }
  return map
}

async function sendPushNotifications(
  grouped: Map<string, TaskGroup>,
  options: { tagPrefix: string; titleBuilder: (count: number) => string; bodyBuilder: (count: number, firstTitle: string, fermentationName: string) => string }
) {
  let sentCount = 0
  const errors: string[] = []
  const today = new Date()

  for (const [userId, group] of grouped) {
    const subscriptions = await db.pushSubscription.findMany({ where: { userId } })
    if (subscriptions.length === 0) continue

    const tasks = group.tasks
    const fermentationName = tasks[0].fermentation.name
    const taskCount = tasks.length
    const title = options.titleBuilder(taskCount)
    const body = options.bodyBuilder(taskCount, tasks[0].title, fermentationName)

    for (const sub of subscriptions) {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({
            title,
            body,
            tag: `${options.tagPrefix}-${today.toISOString().split("T")[0]}`,
            requireInteraction: false,
            renotify: true,
            url: "/calendar",
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
  }

  return { sentCount, errors }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)
  const tomorrowStart = startOfDay(addDays(today, 1))
  const tomorrowEnd = endOfDay(addDays(today, 1))

  const [tasksDueToday, tasksDueTomorrow] = await Promise.all([
    db.task.findMany({
      where: {
        completed: false,
        scheduledDate: { gte: todayStart, lte: todayEnd },
      },
      include: { fermentation: { select: { name: true, userId: true } } },
    }),
    db.task.findMany({
      where: {
        completed: false,
        scheduledDate: { gte: tomorrowStart, lte: tomorrowEnd },
      },
      include: { fermentation: { select: { name: true, userId: true } } },
    }),
  ])

  const todayGrouped = groupTasksByUser(tasksDueToday)
  const tomorrowGrouped = groupTasksByUser(tasksDueTomorrow)

  const todayResult = await sendPushNotifications(todayGrouped, {
    tagPrefix: "grahita-task",
    titleBuilder: (count) => (count === 1 ? "Tugas Hari Ini" : `${count} Tugas Hari Ini`),
    bodyBuilder: (count, firstTitle, name) =>
      count === 1
        ? `${firstTitle} — ${name}`
        : `${count} tugas fermentasi "${name}" perlu dikerjakan`,
  })

  const tomorrowResult = await sendPushNotifications(tomorrowGrouped, {
    tagPrefix: "grahita-task-tomorrow",
    titleBuilder: (count) => (count === 1 ? "Tugas Besok" : `${count} Tugas Besok`),
    bodyBuilder: (count, firstTitle, name) =>
      count === 1
        ? `${firstTitle} — ${name} (besok)`
        : `${count} tugas fermentasi "${name}" jatuh tempo besok`,
  })

  return NextResponse.json({
    today: {
      sent: todayResult.sentCount,
      tasksFound: tasksDueToday.length,
      usersNotified: todayGrouped.size,
    },
    tomorrow: {
      sent: tomorrowResult.sentCount,
      tasksFound: tasksDueTomorrow.length,
      usersNotified: tomorrowGrouped.size,
    },
  })
}
