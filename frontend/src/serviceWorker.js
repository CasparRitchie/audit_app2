/* eslint-disable no-restricted-globals */

const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html', '/static/js/main.7c957e3d.js', '/static/css/styles.scss'];

// Install a service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll([
              'index.html',
              'offline.html',
              '/',
              // Dynamically cache all static files
              '/static/js/',
              '/static/css/'
          ]);
      })
  );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )
});

// Activate the service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))

    )
});
