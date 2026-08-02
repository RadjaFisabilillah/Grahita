"use client"

import {
  Package,
  Scale,
  Droplets,
  Apple,
  FlaskConical,
  RotateCw,
  CalendarCheck,
  Beaker,
  MoveRight,
  Wind,
  Power,
  type LucideIcon,
} from "lucide-react"

export interface WalkthroughStepData {
  title: string
  description: string
  icon: LucideIcon
  tip: string
}

export const ECO_ENZYM_STEPS: WalkthroughStepData[] = [
  {
    title: "Siapkan Bahan",
    description:
      "Siapkan galon 15 liter, limbah buah (sisa potongan atau kulit buah), dan molase. Pastikan galon bersih dan kering.",
    icon: Package,
    tip: "Pastikan seluruh peralatan bersih dan tidak ada sisa detergen agar mikroba tidak mati.",
  },
  {
    title: "Perbandingan Bahan",
    description:
      "Gunakan perbandingan 10:1:1 — 10 bagian air (dalam liter), 1 bagian buah (dalam kilogram), dan 1 bagian molase (dalam liter).",
    icon: Scale,
    tip: "Takar dengan timbangan dapur biasa untuk hasil yang konsisten setiap batch.",
  },
  {
    title: "Masukkan Air",
    description:
      "Tuangkan air ke dalam galon sesuai dengan jumlah yang ingin Anda buat berdasarkan perbandingan tadi.",
    icon: Droplets,
    tip: "Air sumur atau air mineral lebih baik daripada air keran yang mengandung klorin tinggi.",
  },
  {
    title: "Siapkan Buah",
    description:
      "Potong atau lumatkan buah yang akan digunakan. Jika menggunakan buah yang dipotong dan membuang udara secara manual (membuka tutup), buka tutup galon 2 hari sekali. Jika buah dilumatkan, buka tutup galon setiap sehari sekali.",
    icon: Apple,
    tip: "Semakin kecil potongan buah, semakin cepat proses fermentasi berlangsung.",
  },
  {
    title: "Tambahkan Molase",
    description:
      "Masukkan molase ke dalam galon. Molase berfungsi sebagai sumber energi untuk mikroorganisme yang akan tumbuh dan memproses buah menjadi Eco Enzym.",
    icon: FlaskConical,
    tip: "Jika tidak ada molase, Anda bisa menggantinya dengan gula pasir atau gula merah.",
  },
  {
    title: "Aduk dan Tutup",
    description:
      "Aduk seluruh isi galon secara merata hingga molase larut. Tutup galon dengan rapat menggunakan penutup yang sudah disiapkan.",
    icon: RotateCw,
    tip: "Aduk dengan arah yang konsisten agar oksigen tercampur merata di awal fermentasi.",
  },
  {
    title: "Pengecekan Berkala (Otomatis)",
    description:
      "Jika menggunakan penutup dengan pembuangan udara otomatis, Anda cukup mengecek galon setiap 3 hari sekali untuk memastikan proses fermentasi berjalan lancar.",
    icon: CalendarCheck,
    tip: "Pasang notifikasi di aplikasi Grahita agar tidak lupa jadwal pengecekan.",
  },
  {
    title: "Pengecekan Berkala (Manual)",
    description:
      "Jika menggunakan tutup galon tanpa saluran udara, Anda perlu rutin membuka tutup untuk melepaskan gas hasil fermentasi agar tidak menumpuk dan menyebabkan galon pecah.",
    icon: CalendarCheck,
    tip: "Buka tutup perlahan dan jauhkan wajah untuk menghindari percikan cairan asam.",
  },
]

export const POC_STEPS: WalkthroughStepData[] = [
  {
    title: "Siapkan Peralatan",
    description:
      "Siapkan galon, buah atau urin sapi, molase, dan EM4 sebagai starter mikroorganisme. Pastikan semua peralatan bersih.",
    icon: Package,
    tip: "Galon bekas air mineral 15 liter adalah pilihan paling praktis dan mudah didapat.",
  },
  {
    title: "Masukkan Bahan",
    description:
      "Masukkan urin sapi, molase, dan EM4 ke dalam galon sesuai takaran yang Anda inginkan. Molase dan EM4 membantu mempercepat fermentasi.",
    icon: Beaker,
    tip: "Perbandingan umum POC: 10 liter air, 1 liter urin sapi, 0.5 liter molase, dan 1 tutup botol EM4.",
  },
  {
    title: "Aduk Merata",
    description:
      "Aduk isi galon secara merata hingga semua bahan tercampur dengan baik. Pastikan tidak ada endapan yang menggumpal di dasar.",
    icon: RotateCw,
    tip: "Gunakan kayu atau sendok plastik bersih, hindarkan logam yang bisa bereaksi dengan cairan.",
  },
  {
    title: "Pasang Selang",
    description:
      "Pasang selang pada lubang penutup galon. Selang ini akan digunakan untuk menghubungkan galon dengan aerator.",
    icon: MoveRight,
    tip: "Lubangi penutup dengan ukuran sedikit lebih kecil dari diameter selang agar pas kencang.",
  },
  {
    title: "Hubungkan Aerator",
    description:
      "Hubungkan penutup galon yang sudah dipasangi selang dengan aerator. Aerator akan memasok oksigen dari dasar galon untuk membantu proses fermentasi aerob.",
    icon: Wind,
    tip: "Pastikan ujung selang aerator sampai ke dasar galon untuk aerasi maksimal.",
  },
  {
    title: "Nyalakan Aerator",
    description:
      "Tutup galon dengan rapat dan nyalakan aerator setiap 2 hari sekali selama beberapa jam untuk memastikan pasokan oksigen tetap cukup.",
    icon: Power,
    tip: "Catat jadwal aerasi di aplikasi agar proses fermentasi tetap terkontrol dan berkualitas.",
  },
]

export function getSteps(type: "ECO_ENZYM" | "POC") {
  return type === "ECO_ENZYM" ? ECO_ENZYM_STEPS : POC_STEPS
}

export function getWalkthroughMeta(type: "ECO_ENZYM" | "POC") {
  return type === "ECO_ENZYM"
    ? {
        label: "Eco Enzym",
        shortLabel: "Eco Enzym",
        result: "Eco Enzym siap pakai",
        duration: "~4 menit",
        stepCount: ECO_ENZYM_STEPS.length,
      }
    : {
        label: "POC (Pupuk Organik Cair)",
        shortLabel: "POC",
        result: "Pupuk organik cair matang",
        duration: "~3 menit",
        stepCount: POC_STEPS.length,
      }
}

const COMPLETION_KEY = "grahita-walkthrough-completed"

export function markWalkthroughComplete(type: "ECO_ENZYM" | "POC") {
  if (typeof window === "undefined") return
  const existing = JSON.parse(localStorage.getItem(COMPLETION_KEY) || "[]") as string[]
  if (!existing.includes(type)) {
    localStorage.setItem(COMPLETION_KEY, JSON.stringify([...existing, type]))
  }
}

export function getCompletedWalkthroughs(): ("ECO_ENZYM" | "POC")[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(COMPLETION_KEY) || "[]") as ("ECO_ENZYM" | "POC")[]
  } catch {
    return []
  }
}
