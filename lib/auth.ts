import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { compare, hash } from "bcryptjs"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user) return null

        const valid = await compare(parsed.data.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
