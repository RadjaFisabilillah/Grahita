import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
})

export type RegisterUserResult =
  | { success: false; error: string; details?: z.typeToFlattenedError<{ email: string; password: string; name?: string }> }
  | { success: true; user: { id: string; email: string; name: string | null } }

export async function registerUser(data: unknown): Promise<RegisterUserResult> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Data tidak valid", details: parsed.error.flatten() }
  }

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
  })
  if (existing) {
    return { success: false, error: "Email sudah terdaftar" }
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12)

  const user = await db.user.create({
    data: {
      email: parsed.data.email,
      password: hashed,
      name: parsed.data.name || null,
    },
  })

  return { success: true, user: { id: user.id, email: user.email, name: user.name } }
}
