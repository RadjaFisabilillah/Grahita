import { Metadata } from "next"

export const siteConfig = {
  name: "Grahita",
  url: "https://grahita.vercel.app",
  description: "PWA monitoring proses pembuatan POC dan Eco Enzym.",
}

export function createMetadata({
  title,
  description = siteConfig.description,
}: {
  title: string
  description?: string
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  }
}
