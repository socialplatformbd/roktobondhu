// RoktoBondhu PWA service worker.
// Cache only the app shell and explicitly static assets. Never cache Firebase
// traffic, private data, API responses, or arbitrary same-origin GET requests.

const CACHE_VERSION = "roktobondhu-v3";
// Works at any base path (e.g. https://user.github.io/roktobondhu/).
const BASE = self.registration.scope;
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const SHELL_URLS = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.json",
  BASE + "icons/icon-192.png",
  BASE + "icons/icon-512.png",
  BASE + "icons/maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("roktobondhu-") && key !== SHELL_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Never intercept authentication, Firestore, Firebase Storage, or Google API traffic.
  if (
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("firebaseio.com") ||
    url.hostname.includes("firebaseapp.com") ||
    url.hostname.includes("identitytoolkit") ||
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("cloudfunctions.net")
  ) return;

  const sameOrigin = url.origin === self.location.origin;
  const fontHost = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !fontHost) return;

  if (request.mode === "navigate" && sameOrigin) {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(SHELL_CACHE);
            await cache.put(BASE, response.clone());
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(BASE);
          return cached || caches.match(BASE + "index.html");
        })
    );
    return;
  }

  // Only explicitly static file types and the manifest may be cached.
  const staticPath = sameOrigin && (
    url.pathname.endsWith("/manifest.json") ||
    url.pathname.endsWith("/favicon.ico") ||
    /\.(?:js|css|png|jpg|jpeg|webp|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname)
  );
  const fontAsset = fontHost && (
    url.hostname === "fonts.googleapis.com" ||
    /\.(?:woff2?|ttf|otf)$/i.test(url.pathname)
  );
  if (!staticPath && !fontAsset) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(SHELL_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      });
    })
  );
});
