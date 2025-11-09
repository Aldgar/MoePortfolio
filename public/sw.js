self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker...");
  event.waitUntil(
    caches.open("portfolio-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/globals.css",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
