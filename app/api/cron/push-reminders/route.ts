import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import webPush from "web-push"
import { startOfDay, endOfDay, addDays, differenceInCalendarDays, format } from "date-fns"
import { id } from "date-fns/locale"

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

interface TaskItem {
  id: string
  title: string
  scheduledDate: Date
  fermentation: {
    id: string
    name: string
    type: string
    userId: string
    startDate: Date
    totalDays: number
  }
}

function typeLabel(type: string): string {
  return type === "POC" ? "POC" : "Eco Enzym"
}

function buildMessage(task: TaskItem, when: "today" | "tomorrow") {
  const { fermentation } = task
  const dayNumber = differenceInCalendarDays(task.scheduledDate, fermentation.startDate) + 1
  const dueLabel =
    when === "today" ? "hari ini" : "besok"
  const dayInfo =
    fermentation.totalDays > 0
      ? `Hari ke-${dayNumber} dari ${fermentation.totalDays}.`
      : `Hari ke-${dayNumber}.`

  return {
    title: `${typeLabel(fermentation.type)} ${fermentation.name} — ${task.title}`,
    body: `Jatuh tempo ${dueLabel} (${format(task.scheduledDate, "d MMM", { locale: id })}). ${dayInfo}`,
    tag: `${when}-${task.id}`,
    url: `/fermentation/${fermentation.id}`,
    data: {
      fermentationId: fermentation.id,
      taskId: task.id,
    },
  }
}

async function sendPushForTasks(tasks: TaskItem[], when: "today" | "tomorrow") {
  let sentCount = 0
  const errors: string[] = []

  for (const task of tasks) {
    const subscriptions = await db.pushSubscription.findMany({
      where: { userId: task.fermentation.userId },
    })
    if (subscriptions.length === 0) continue

    const payload = buildMessage(task, when)

    for (const sub of subscriptions) {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({
            ...payload,
            requireInteraction: false,
            renotify: false,
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

  const taskSelect = {
    id: true,
    title: true,
    scheduledDate: true,
    fermentation: {
      select: {
        id: true,
        name: true,
        type: true,
        userId: true,
        startDate: true,
        totalDays: true,
      },
    },
  }

  const [tasksDueToday, tasksDueTomorrow] = await Promise.all([
    db.task.findMany({
      where: {
        completed: false,
        scheduledDate: { gte: todayStart, lte: todayEnd },
      },
      select: taskSelect,
    }),
    db.task.findMany({
      where: {
        completed: false,
        scheduledDate: { gte: tomorrowStart, lte: tomorrowEnd },
      },
      select: taskSelect,
    }),
  ])

  const todayResult = await sendPushForTasks(tasksDueToday as unknown as TaskItem[], "today")
  const tomorrowResult = await sendPushForTasks(tasksDueTomorrow as unknown as TaskItem[], "tomorrow")

  const usersNotifiedToday = new Set(
    tasksDueToday.map((t) => t.fermentation.userId)
  ).size
  const usersNotifiedTomorrow = new Set(
    tasksDueTomorrow.map((t) => t.fermentation.userId)
  ).size

  return NextResponse.json({
    today: {
      sent: todayResult.sentCount,
      tasksFound: tasksDueToday.length,
      usersNotified: usersNotifiedToday,
    },
    tomorrow: {
      sent: tomorrowResult.sentCount,
      tasksFound: tasksDueTomorrow.length,
      usersNotified: usersNotifiedTomorrow,
    },
  })
}
