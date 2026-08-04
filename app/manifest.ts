import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Grahita",
    short_name: "Grahita",
    description: "Monitoring proses pembuatan POC dan Eco Enzym",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fcfcfc",
    theme_color: "#0b493a",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icon-192x192.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
