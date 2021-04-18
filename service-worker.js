var cacheName = 'offlineCache-v0';

var contentToCache = [
  '/home.html',
  '/manifest.json',
  '/assets/back.png',
  '/assets/confetti.gif',
  '/assets/down.png',
  '/assets/launch_icon.jpg',
  '/assets/minus.jpg',
  '/assets/plus.png',
  '/assets/yay_effect.mp3',
  '/libraries/jquery-3.4.1.min.js',
  '/libraries/mithril.min.js',
  '/libraries/paper-core.js',
  '/libraries/swipe.js',
  '/scripts/index.js',
  '/scripts/utilities.js',
  '/scripts/wheel.js',
  '/styles/style.css',
  '/styles/text.css'
];


self.addEventListener('install', (event) => {
  console.log('Service Worker Installed');
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Service Worker Caching Files');
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if(key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
