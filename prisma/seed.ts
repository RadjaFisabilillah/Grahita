import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

async function seed() {
  const hashedPassword = await bcrypt.hash("password123", 12)

  const user = await db.user.upsert({
    where: { email: "demo@grahita.app" },
    update: {},
    create: {
      email: "demo@grahita.app",
      password: hashedPassword,
      name: "Demo User",
    },
  })

  const poc = await db.fermentation.upsert({
    where: { id: "demo-poc-1" },
    update: {},
    create: {
      id: "demo-poc-1",
      userId: user.id,
      name: "POC Sawit Q1",
      type: "POC",
      batchCode: "B-001",
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      totalDays: 30,
      status: "ACTIVE",
      notes: "Fermentasi POC dari limbah sawit untuk pupuk cair.",
    },
  })

  const eco = await db.fermentation.upsert({
    where: { id: "demo-eco-1" },
    update: {},
    create: {
      id: "demo-eco-1",
      userId: user.id,
      name: "Eco Enzym Dapur",
      type: "ECO_ENZYM",
      batchCode: "E-001",
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      totalDays: 90,
      status: "ACTIVE",
      notes: "Eco enzyme dari sisa buah dan sayur dapur.",
    },
  })

  await db.task.createMany({
    data: [
      {
        fermentationId: poc.id,
        title: "Aduk campuran POC",
        description: "Aduk perlahan agar oksigen masuk.",
        scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        completed: true,
        isCritical: false,
      },
      {
        fermentationId: poc.id,
        title: "Periksa pH larutan",
        description: "Target pH 3.5–4.5.",
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        completed: false,
        isCritical: true,
      },
      {
        fermentationId: eco.id,
        title: "Buka klap sedikit",
        description: "Lepaskan gas CO2 yang terbentuk.",
        scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completed: true,
        isCritical: false,
      },
      {
        fermentationId: eco.id,
        title: "Saring ampas eco enzyme",
        description: "Saring dengan kain kasa halus.",
        scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        completed: false,
        isCritical: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log("Seed completed")
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
