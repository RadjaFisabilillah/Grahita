const CACHE_SHELL = "grahita-shell-v1"
const CACHE_RUNTIME = "grahita-runtime-v1"
const SHELL_ASSETS = [
  "/",
  "/login",
  "/dashboard",
  "/calendar",
  "/settings",
  "/offline",
  "/icon-192x192.png",
  "/icon-512x512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then((cache) => cache.addAll(SHELL_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_SHELL && key !== CACHE_RUNTIME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth")) {
    return
  }

  // Navigation requests (HTML pages): offline fallback
  const isNavigation = request.mode === "navigate"

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone()
            caches.open(CACHE_RUNTIME).then((cache) => {
              cache.put(request, clone)
            })
          }
          return networkResponse
        })
        .catch(() => {
          if (isNavigation) {
            return caches.match("/offline")
          }
          return cached
        })

      return cached || fetchPromise
    })
  )
})

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  const options = {
    body: data.body || "Pengingat tugas fermentasi",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    tag: data.tag || "grahita-reminder",
    requireInteraction: true,
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Grahita", options)
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow("/calendar"))
})
