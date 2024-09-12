/* eslint-disable no-restricted-globals */

const CACHE_NAME = "version-1";
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',        // Offline fallback page
  '/static/js/main.js',   // Main JS bundle
  '/static/css/main.css', // Main CSS bundle
  // Include any other critical assets such as logos
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(() => {
        return fetch(event.request).catch(() => caches.match('offline.html'));
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
