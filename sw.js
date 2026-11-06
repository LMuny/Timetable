// Offline support: keeps a copy of the app so it opens without a connection.
// Bump CACHE_VERSION when the precached file list changes.
const CACHE_VERSION = 'v1';
const CACHE = `hours-planner-${CACHE_VERSION}`;
const PRECACHE = [
  './',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'vendor/jspdf.umd.min.js'
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const NETWORK_TIMEOUT_MS = 3000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Prefer a fresh copy so updates show up straight away, but fall back to the
// saved copy when offline or when the connection is too slow to be usable.
async function networkFirst(event, cacheKey) {
  const cache = await caches.open(CACHE);
  const fromNetwork = fetch(event.request).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      event.waitUntil(cache.put(cacheKey, copy));
    }
    return res;
  });
  const timedOut = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS));
  const winner = await Promise.race([fromNetwork.catch(() => null), timedOut]);
  if (winner) return winner;
  const cached = await cache.match(cacheKey);
  return cached || fromNetwork;
}

// Font files never change at a given URL, so the saved copy is always fine.
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok || res.type === 'opaque') await cache.put(request, res.clone());
  return res;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(event, new URL('./', self.location).href));
  } else {
    event.respondWith(networkFirst(event, request));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      if (windows.length) return windows[0].focus();
      return self.clients.openWindow('./');
    })
  );
});
