// Minimal service worker — required by Chrome/Android for PWA installability.
// This does not cache anything aggressively; it just needs to exist and control the page.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// A bare fetch handler is required for installability criteria on Chrome.
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
