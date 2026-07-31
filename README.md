# Grahita

PWA monitoring proses pembuatan **POC (Pupuk Organik Cair)** dan **Eco Enzym** untuk pertanian modern.

## Fitur

- **Autentikasi** — Login dengan email & password (Auth.js)
- **Dashboard** — Pantau progress fermentasi real-time dengan progress ring
- **Kalender** — Lihat jadwal tugas per fermentasi per tanggal
- **Detail Fermentasi** — Expand card untuk detail lengkap, update status, catatan
- **PWA** — Installable, offline-ready, push notifications
- **Responsive** — Mobile-first, nyaman di HP maupun desktop

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15.5 + React 19 + TypeScript |
| Styling | Tailwind CSS 3.4 + shadcn/ui (customized) |
| Fonts | Lexend (headline) + Libre Franklin (body) |
| Database | PostgreSQL + Prisma ORM 6.19 |
| Auth | Auth.js v5 (NextAuth beta) |
| PWA | Web App Manifest + Service Worker + Web Push |

## Setup Development

1. Clone repo
2. `npm install`
3. Setup PostgreSQL dan buat `.env` dari `.env.example`
4. `npx prisma migrate dev`
5. `npm run db:seed` (opsional, buat akun demo)
6. `npm run dev`
7. Buka `http://localhost:3000`

## Deploy ke Vercel

1. Push ke GitHub
2. Connect ke Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
4. Deploy

## Akun Demo

- Email: `demo@grahita.app`
- Password: `password123`

## Offline Support

Service worker (`public/sw.js`) meng-cache:
- App shell (halaman, JS, CSS, icons)
- Runtime API responses (Stale-While-Revalidate)
- Push notifications untuk reminder tugas

## License

MIT
