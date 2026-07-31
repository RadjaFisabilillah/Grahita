# Grahita Deployment Checklist

## Pre-Deploy (Local)

### 1. Generate Keys
```bash
# Generate VAPID keys
npx web-push generate-vapid-keys

# Generate Auth Secret
npx auth secret
# atau
echo "$(openssl rand -base64 32)"

# Generate CRON_SECRET
openssl rand -hex 32
```

### 2. Database Preparation
```bash
# Pastikan DATABASE_URL production sudah ada di .env.local
# Jalankan migrate
npx prisma migrate deploy

# Verifikasi (opsional)
npx prisma studio
```

---

## Vercel Environment Variables

Masukkan variabel berikut di **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Environment | Value |
|----------|-------------|-------|
| `DATABASE_URL` | Production | *(dari Neon dashboard)* |
| `AUTH_SECRET` | Production | *(dari `npx auth secret`)* |
| `NEXTAUTH_URL` | Production | `https://grahita.vercel.app` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Production | *(dari `npx web-push generate-vapid-keys`)* |
| `VAPID_PRIVATE_KEY` | Production | *(private key dari command di atas)* |
| `VAPID_SUBJECT` | Production | `mailto:radjafisabilillah07@gmail.com` |
| `CRON_SECRET` | Production | *(dari `openssl rand -hex 32`)* |

> **Catatan Penting:**
> - Semua environment variables hanya di-set di Vercel dashboard, JANGAN commit ke repo
> - `.env` file sudah ada di `.gitignore` (pastikan!)
> - `NEXT_PUBLIC_*` akan tersedia di client-side

---

## Deploy Steps

### 1. Import Project ke Vercel
1. Login ke [vercel.com](https://vercel.com)
2. Klik **Add New... → Project**
3. Import repository GitHub Anda
4. Framework preset: **Next.js** (auto-detect)
5. Build command: `prisma generate && next build` (sudah di `vercel.json`)
6. Klik **Deploy**

### 2. Set Environment Variables
1. Buka project → **Settings → Environment Variables**
2. Tambahkan SEMUA variable di tabel di atas
3. Pastikan environment diatur ke **Production**

### 3. Re-Deploy
1. Trigger redeploy (push commit baru atau manual redeploy)
2. Tunggu build selesai

---

## Post-Deploy Verification

### A. Smoke Tests
- [ ] Buka `https://grahita.vercel.app/login` → halaman login tampil
- [ ] Register/login dengan akun baru → berhasil
- [ ] Dashboard tampil → fermentasi list ada
- [ ] Tambah fermentasi baru → berhasil redirect ke dashboard
- [ ] Buka kalender → task muncul
- [ ] Settings → theme toggle work
- [ ] Walkthrough modal fullscreen work
- [ ] Logout → redirect ke login

### B. PWA Tests (Chrome DevTools)
- [ ] **Application → Manifest** → valid, icons tersedia
- [ ] **Application → Service Workers** → registered, active, running
- [ ] **Lighthouse PWA Audit** → score ≥ 90
- [ ] Test install prompt (Chrome menu → Install Grahita)
- [ ] Test offline mode (DevTools → Network → Offline → refresh)

### C. Push Notification Tests
1. Buka Settings → aktifkan toggle **Notifikasi Push**
2. Izinkan browser untuk notifikasi
3. Klik **"Kirim Notifikasi Uji Coba"**
4. Verifikasi notifikasi muncul di device/browser

### D. Cron Job Verification
```bash
curl -H "Authorization: Bearer <CRON_SECRET>" \
  https://grahita.vercel.app/api/cron/push-reminders
```

Expected response:
```json
{
  "sent": 0,
  "message": "No tasks due today"
}
```

Atau jika ada task:
```json
{
  "sent": 1,
  "tasksFound": 1,
  "usersNotified": 1
}
```

### E. Security Headers Test
```bash
curl -I https://grahita.vercel.app
```

Expected headers:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### F. SEO Verification
- [ ] `/robots.txt` accessible
- [ ] `/sitemap.xml` accessible
- [ ] Open Graph metadata valid (test dengan [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/))
- [ ] Twitter Card metadata valid

---

## Troubleshooting

### Build Failed
```
Error: DATABASE_URL is not set
```
→ Pastikan DATABASE_URL di-set di Vercel Environment Variables

### Push Notification Tidak Berfungsi
```
Error: VAPID keys not configured
```
→ Pastikan NEXT_PUBLIC_VAPID_PUBLIC_KEY dan VAPID_PRIVATE_KEY benar
→ Pastikan VAPID_SUBJECT valid (format: `mailto:email@domain.com`)

### Cron Job Unauthorized
```
Error: 401 Unauthorized
```
→ Pastikan CRON_SECRET di-set di Vercel
→ Pastikan header Authorization: Bearer <CRON_SECRET>

### Database Connection Error
```
Error: Can't reach database server
```
→ Pastikan DATABASE_URL valid dan Neon database aktif
→ Pastikan IP allowlist di Neon mencakup Vercel (atau set `sslmode=require`)

---

## Monitoring & Maintenance

### Database Backup
- Neon: Auto-backup daily (paid tier)
- Manual backup: `pg_dump` atau export dari Neon dashboard

### Error Tracking (Opsional)
- Setup [Sentry](https://sentry.io) untuk Next.js
- Atau gunakan Vercel Monitoring (built-in)

### Analytics (Opsional)
- [Vercel Analytics](https://vercel.com/analytics) - gratis untuk personal projects
- Google Analytics jika ingin tracking detail

---

## Contact & Support

- **Project:** Grahita — PWA Monitoring Fermentasi
- **Stack:** Next.js 15, Prisma, PostgreSQL, Tailwind CSS, Auth.js
- **Deploy Target:** Vercel (Region: Singapore sin1)
- **Domain:** https://grahita.vercel.app
