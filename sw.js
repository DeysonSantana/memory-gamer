/**
 * ==============================================================================
 * MEMORYMASTER - SERVICE WORKER (PWA OFFLINE-FIRST)
 * ==============================================================================
 * Estratégia: Cache-First com Fallback de Rede para funcionamento 100% offline.
 */

const CACHE_NAME = 'memorymaster-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './js/app.js',
  './js/audio.js',
  './js/themeManager.js',
  './js/defaultDecks.js',
  './js/deckManager.js',
  './js/csvParser.js',
  './js/shareManager.js',
  './js/qrcodeEngine.js',
  './js/gameEngine.js',
  './js/leaderboardManager.js',
  './js/offlineManager.js'
];

// Instalação: Cacheia todos os arquivos estáticos essenciais
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Armazenando shell da aplicação em cache...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativação: Limpa versões anteriores de cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removendo cache obsoleto:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições: Cache First com fallback para Network
self.addEventListener('fetch', (e) => {
  // Ignora requisições não-GET e esquemas externos de extensões
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Armazena cópia no cache caso a requisição seja válida
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback offline se for navegação HTML
        if (e.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
