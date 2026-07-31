import type { Metadata, Viewport } from "next"
import { Lexend, Libre_Franklin } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { InstallPrompt } from "@/components/features/install-prompt"
import { ServiceWorkerRegister } from "@/components/features/sw-register"

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
  weight: ["500", "600", "700"],
})

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: { template: "%s | Grahita", default: "Grahita — Monitoring Fermentasi" },
  description: "PWA monitoring proses pembuatan POC dan Eco Enzym. Pantau fermentasi Anda dengan mudah melalui aplikasi web.",
  keywords: ["fermentasi", "POC", "Eco Enzym", "pupuk organik", "monitoring", "agriculture", "pertanian"],
  authors: [{ name: "Grahita Team" }],
  creator: "Grahita",
  metadataBase: new URL("https://grahita.vercel.app"),
  openGraph: {
    title: "Grahita — Monitoring Fermentasi",
    description: "PWA monitoring proses pembuatan POC dan Eco Enzym.",
    url: "https://grahita.vercel.app",
    siteName: "Grahita",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://grahita.vercel.app/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Grahita App Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grahita — Monitoring Fermentasi",
    description: "PWA monitoring proses pembuatan POC dan Eco Enzym.",
    images: ["https://grahita.vercel.app/icon-512x512.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Grahita",
    startupImage: ["/icon-512x512.png"],
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0b493a",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${lexend.variable} ${libreFranklin.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-body min-h-[100dvh] bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
          <InstallPrompt />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}
