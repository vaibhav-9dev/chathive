const CACHE_NAME = "chat-hive-v2";

const FILES_TO_CACHE = [
  "/",
  "/login.html",
  "/signup.html",
  "/messages_home.html",
  "/chat_window.html",
  "/contacts_list.html",
  "/user_profile.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// 🔥 INSTALL → cache all core files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // activate immediately
});

// 🔄 ACTIVATE → clean old cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🌐 FETCH → serve cache first, then network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      // 🔥 fallback (optional)
      return caches.match("/login.html");
    })
  );
});