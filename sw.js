
const CACHE_NAME = "nirantar-shell-v4";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

// Install: cache every required app file before accepting the update.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old NIRANTAR shell caches.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key =>
            key.startsWith("nirantar-shell-") &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: use cached app files offline and update navigation cache safely.
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle same-origin GET requests.
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Navigation: display the cached app quickly, then refresh its HTML.
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedPage =
        await cache.match("./index.html") ||
        await cache.match("./");

      const refreshPage = async () => {
        const response = await fetch(request);

        if (response.ok && response.type === "basic") {
          await cache.put("./index.html", response.clone());
        }

        return response;
      };

      if (cachedPage) {
        event.waitUntil(
          refreshPage().catch(error => {
            console.warn(
              "NIRANTAR: Offline page refresh skipped.",
              error
            );
          })
        );

        return cachedPage;
      }

      // First visit needs the network if no app shell is cached.
      try {
        return await refreshPage();
      } catch {
        return new Response(
          "NIRANTAR is not available offline yet. Open it online once first.",
          {
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8"
            }
          }
        );
      }
    })());

    return;
  }

  // Cache-first only for the known app shell files.
  const appFilePaths = new Set(
    APP_FILES.map(path =>
      new URL(path, self.registration.scope).pathname
    )
  );

  if (!appFilePaths.has(url.pathname)) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const response = await fetch(request);

      if (response.ok && response.type === "basic") {
        await cache.put(request, response.clone());
      }

      return response;
    } catch {
      return new Response(
        "This NIRANTAR resource is unavailable offline.",
        {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8"
          }
        }
      );
    }
  })());
});
