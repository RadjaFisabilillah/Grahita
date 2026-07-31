import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/session"
import { db } from "@/lib/db"
import { z } from "zod"
import { addDays } from "date-fns"

const createSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["POC", "ECO_ENZYM"]),
  batchCode: z.string().nullable().optional(),
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z.string().transform((s) => new Date(s)),
  totalDays: z.number().int().min(1),
  notes: z.string().nullable().optional(),
  ventType: z.enum(["MANUAL", "AUTO"]).optional(),
  fruitForm: z.enum(["CUT", "BLENDED"]).optional(),
})

type TaskInput = {
  title: string
  description: string
  scheduledDate: Date
  isCritical: boolean
}

function generateEcoEnzymTasks(startDate: Date, totalDays: number, ventType: string, fruitForm: string): TaskInput[] {
  const tasks: TaskInput[] = []
  const intervalDays = ventType === "AUTO" ? 3 : fruitForm === "BLENDED" ? 1 : 2

  // Generate check tasks throughout the fermentation period
  let currentDay = intervalDays
  while (currentDay <= totalDays) {
    const scheduledDate = addDays(startDate, currentDay)
    const isLastCheck = currentDay + intervalDays > totalDays

    if (ventType === "AUTO") {
      tasks.push({
        title: `Cek galon hari ke-${currentDay}`,
        description: `Periksa kondisi Eco Enzym. Penutup otomatis aktif — cek setiap 3 hari.`,
        scheduledDate,
        isCritical: isLastCheck,
      })
    } else {
      tasks.push({
        title: `Buka tutup galon hari ke-${currentDay}`,
        description: `Lepaskan gas hasil fermentasi. Buah ${fruitForm === "BLENDED" ? "dihaluskan" : "dipotong"} → buka setiap ${intervalDays} hari.`,
        scheduledDate,
        isCritical: isLastCheck,
      })
    }

    currentDay += intervalDays
  }

  // Add completion reminder
  tasks.push({
    title: "Eco Enzym siap diambil",
    description: `Fermentasi selesai setelah ${totalDays} hari. Saring dan simpan hasilnya.`,
    scheduledDate: addDays(startDate, totalDays),
    isCritical: true,
  })

  return tasks
}

function generatePOCTasks(startDate: Date, totalDays: number): TaskInput[] {
  const tasks: TaskInput[] = []
  const intervalDays = 2

  let currentDay = intervalDays
  while (currentDay <= totalDays) {
    const scheduledDate = addDays(startDate, currentDay)
    const isLastCheck = currentDay + intervalDays > totalDays

    tasks.push({
      title: `Nyalakan aerator hari ke-${currentDay}`,
      description: "Aktifkan aerator untuk memasok oksigen dari dasar galon selama beberapa jam.",
      scheduledDate,
      isCritical: isLastCheck,
    })

    currentDay += intervalDays
  }

  tasks.push({
    title: "POC siap diambil",
    description: `Fermentasi selesai setelah ${totalDays} hari. Saring dan simpan hasilnya.`,
    scheduledDate: addDays(startDate, totalDays),
    isCritical: true,
  })

  return tasks
}

export async function GET() {
  const session = await requireAuth()
  const fermentations = await db.fermentation.findMany({
    where: { userId: session.user.id },
    include: { tasks: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(fermentations)
}

export async function POST(req: Request) {
  const session = await requireAuth()
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data

  const fermentation = await db.fermentation.create({
    data: {
      name: data.name,
      type: data.type,
      batchCode: data.batchCode ?? null,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: data.totalDays,
      notes: data.notes ?? null,
      userId: session.user.id,
      status: "ACTIVE",
    },
  })

  // Auto-generate tasks based on type and config
  let taskInputs: TaskInput[] = []

  if (data.type === "ECO_ENZYM" && data.ventType && data.fruitForm) {
    taskInputs = generateEcoEnzymTasks(data.startDate, data.totalDays, data.ventType, data.fruitForm)
  } else if (data.type === "POC") {
    taskInputs = generatePOCTasks(data.startDate, data.totalDays)
  }

  if (taskInputs.length > 0) {
    await db.task.createMany({
      data: taskInputs.map((t) => ({
        ...t,
        fermentationId: fermentation.id,
        completed: false,
      })),
    })
  }

  const result = await db.fermentation.findUnique({
    where: { id: fermentation.id },
    include: { tasks: true },
  })

  return NextResponse.json(result, { status: 201 })
}
