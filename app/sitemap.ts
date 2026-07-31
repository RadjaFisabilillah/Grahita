import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://grahita.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://grahita.vercel.app/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://grahita.vercel.app/dashboard",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://grahita.vercel.app/calendar",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://grahita.vercel.app/settings",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://grahita.vercel.app/fermentation/new",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]
}
