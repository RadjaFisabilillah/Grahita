const CACHE_SHELL = "grahita-shell-v2"
const CACHE_RUNTIME = "grahita-runtime-v2"
const SHELL_ASSETS = [
  "/",
  "/login",
  "/register",
  "/offline",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/icon-192x192.svg",
  "/icon-512x512.svg",
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

  // Bypass API and auth requests
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth")) {
    return
  }

  const isNavigation = request.mode === "navigate"
  const isPage = isNavigation || request.destination === "document"
  const isStaticAsset =
    request.destination === "image" ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    url.pathname.match(/\.(svg|png|jpg|jpeg|webp|ico|woff2?|ttf|otf|css|js)$/)

  // Navigation requests (HTML pages): Network First
  if (isPage) {
    event.respondWith(
      fetch(request)
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
          // Network failed: try cache, then offline page
          return caches.match(request).then((cached) => {
            if (cached) return cached
            return caches.match("/offline")
          })
        })
    )
    return
  }

  // Static assets: Stale While Revalidate
  if (isStaticAsset) {
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
          .catch(() => cached)

        return cached || fetchPromise
      })
    )
    return
  }

  // Default: try cache first, then network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
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

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow("/calendar"))
})
