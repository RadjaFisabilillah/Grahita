# Grahita — PWA Monitoring Fermentasi

## Overview
PWA full-stack untuk memantau proses pembuatan POC dan Eco Enzym. Built dengan Next.js App Router, Prisma ORM, PostgreSQL, dan Tailwind CSS.

## Design System
Mengikuti `DESIGN.md` dengan:
- Warna: Deep Forest (#0b493a), Electric Lime (#eaf06a), Earth Clay (#cdc2b1)
- Fonts: Lexend (headline), Libre Franklin (body)
- Radius: 3xl (1.5rem) untuk cards, pill untuk status chips

## Arsitektur

### Routing
- `/login` — Email + password login
- `/forgot-password` — Arahkan user menghubungi admin via WhatsApp
- `/dashboard` — List fermentasi + progress
- `/fermentation/[id]` — Detail, timeline, edit
- `/calendar` — Kalender task + reminder
- `/settings` — Tema, permission, notifikasi, logout
- `/admin` — Dashboard admin (Overview, Pengguna, Fermentasi, Tugas) khusus role `ADMIN`

### Database (Prisma)
- `User` — akun pengguna (punya `role`: `USER` | `ADMIN`)
- `Fermentation` — proses fermentasi (POC / ECO_ENZYM)
- `Task` — tugas/jadwal per fermentasi
- `Session` — Auth.js session
- `PushSubscription` — Web Push subscriptions

### Role & Admin
- Default role pengguna = `USER`. Super admin ditunjuk manual via seed/database.
- Role disertakan di token/session (`session.user.role`) via `lib/auth.ts` + type augmentation `types/next-auth.d.ts`.
- Helper guard: `lib/session.ts` — `isAdmin()`, `requireAdmin()`, `requireAdminApi()`.
- Route `/admin/*` diproteksi oleh `requireAdmin()` di `app/(dashboard)/admin/layout.tsx`.

### API Routes
- `POST /api/auth/[...nextauth]` — Auth.js handlers
- `GET/POST /api/fermentations` — CRUD fermentasi
- `PATCH/DELETE /api/fermentations/[id]` — Update/delete
- `PATCH /api/tasks/[id]` — Toggle task completion
- `POST /api/subscribe` — Save push subscription
- `GET /api/admin/users` — List user (admin)
- `DELETE /api/admin/users/[id]` — Hapus user (admin)
- `POST /api/admin/users/[id]/reset-password` — Reset password user (admin)
- `GET /api/admin/stats` — Statistik ringkasan (admin)
- `GET /api/admin/fermentations` — List semua fermentasi (admin)
- `DELETE /api/admin/fermentations/[id]` — Hapus fermentasi (admin)
- `GET /api/admin/tasks` — List semua tugas (admin)
- `DELETE /api/admin/tasks/[id]` — Hapus tugas (admin)

### PWA
- Manifest: `app/manifest.ts`
- Service Worker: `public/sw.js`
- Install Prompt: `components/features/install-prompt.tsx`
- Push: `web-push` library + VAPID keys

## Build Commands
```bash
npm run dev        # Development server
npm run build      # Production build
npm run db:migrate # Prisma migrate
npm run db:seed    # Seed demo data
npm run db:studio  # Prisma Studio
```

## Environment Variables
```env
DATABASE_URL=postgresql://...
AUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:...
```

## Important Notes
- Next.js 15.5 dengan React 19 memiliki beberapa kompatibilitas issues dengan Radix UI + Prisma WASM engine. Build berhasil setelah menambahkan `"use client"` ke UI components.
- Untuk production, pastikan PostgreSQL connection string valid dan Prisma migrate sudah dijalankan.
- Service worker memerlukan HTTPS untuk push notifications.
