// Service Worker for Akal Galaxy Convent School (AGCS) Portal
const CACHE_NAME = 'agcs-portal-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass API requests through to the network
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request).catch(() => {
      return new Response(JSON.stringify({ error: 'Offline mode active' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }));
    return;
  }

  // Stale-while-revalidate for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification handling
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'AGCS Notification', body: 'New update from Akal Galaxy Convent School' };
  const options = {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
