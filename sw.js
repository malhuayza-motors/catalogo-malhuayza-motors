/* Malhuayza Motors: copia del catálogo para verlo con poca o ninguna señal.
   - La página: primero intenta la red (máx. 4 s) y, si no hay, usa la copia guardada.
   - Logo, fuentes y fotos de Drive: se guardan al verlas y se reutilizan.
   - Precios: no pasan por aquí; la página guarda la última lista en el celular. */
const VERSION = "mm-v1";
const PAGE = VERSION + "-page", ASSETS = VERSION + "-assets", PHOTOS = VERSION + "-photos";
const MAX_PHOTOS = 150;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(PAGE).then(c => c.addAll(["./", "logo-malhuayza.webp"])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)); }

async function pageFirstNetwork(req) {
  const cache = await caches.open(PAGE);
  try {
    const res = await Promise.race([fetch(req), timeout(4000)]);
    if (res && res.ok) cache.put("./", res.clone());
    return res;
  } catch (e) {
    return (await cache.match("./")) || (await cache.match(req)) || Response.error();
  }
}
async function cacheFirst(req, name, corsOnly) {
  const cache = await caches.open(name);
  const hit = await cache.match(req.url);
  if (hit) return hit;
  try {
    const res = await fetch(req.url, corsOnly ? { mode: "cors", credentials: "omit" } : undefined);
    if (res.ok) {
      await cache.put(req.url, res.clone());
      if (name === PHOTOS) trim(cache);
    }
    return res;
  } catch (e) {
    if (corsOnly) return fetch(req);   // el servidor no permite guardar: se muestra igual, sin copia
    throw e;
  }
}
async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_PHOTOS; i++) await cache.delete(keys[i]);
}

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  if (req.mode === "navigate" && url.origin === location.origin) { e.respondWith(pageFirstNetwork(req)); return; }
  if (url.origin === location.origin && /\.(webp|png|jpg|svg)$/.test(url.pathname)) { e.respondWith(cacheFirst(req, ASSETS)); return; }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") { e.respondWith(cacheFirst(req, ASSETS, true)); return; }
  if ((url.hostname === "drive.google.com" && url.pathname === "/thumbnail") || url.hostname === "lh3.googleusercontent.com") { e.respondWith(cacheFirst(req, PHOTOS, true)); return; }
});
