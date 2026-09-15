// ==========================================
// SERVICE WORKER - SURAEM PERFUMES (OFFLINE PWA)
// ==========================================

const CACHE_NAME = 'suraem-v1';

// Static resources to pre-cache on SW installation
const STATIC_ASSETS = [
    './',
    './index.html',
    './admin.html',
    './add-product.html',
    './edit-product.html',
    './style.css',
    './admin.css',
    './script.js',
    './admin.js',
    './add-product.js',
    './edit-product.js',
    './images/hero_bg.png',
    './images/mens_perfume.png',
    './images/womens_perfume.png',
    './images/oud_incense.png',
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing SW & Caching Assets');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                STATIC_ASSETS.map(url => cache.add(url).catch(err => console.warn('[SW] Failed to pre-cache:', url, err)))
            );
        }).then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating SW & Cleaning Old Caches');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Stale-While-Revalidate & Fallback Strategy
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Background fetch to refresh cache if online
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(() => {
                    // Offline - Ignore network update failure
                });

                return cachedResponse;
            }

            // Fetch from network and cache for future offline usage
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Offline Fallbacks
                if (event.request.mode === 'navigate' || event.request.destination === 'document') {
                    if (url.pathname.includes('admin')) {
                        return caches.match('./admin.html');
                    }
                    if (url.pathname.includes('add-product')) {
                        return caches.match('./add-product.html');
                    }
                    if (url.pathname.includes('edit-product')) {
                        return caches.match('./edit-product.html');
                    }
                    return caches.match('./index.html');
                }

                if (event.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif)/i)) {
                    if (url.pathname.includes('women')) {
                        return caches.match('./images/womens_perfume.png');
                    } else if (url.pathname.includes('oud')) {
                        return caches.match('./images/oud_incense.png');
                    } else {
                        return caches.match('./images/mens_perfume.png');
                    }
                }
            });
        })
    );
});
