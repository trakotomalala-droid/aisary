// Ohay : fonctionne sans connexion une fois ouvert une première fois
const V = "ohay-v17";
const BASE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin === location.origin){
    // page : réseau d'abord (pour les mises à jour), sinon la copie
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(k => k.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match("./index.html"))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const c = res.clone(); caches.open(V).then(k => k.put(r, c)); return res; })));
  }
});
