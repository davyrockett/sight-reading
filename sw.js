// Replaces the old app's service worker so installed copies stop showing the old version.
// It takes over open windows, clears the old app's saved files, sends each window to the
// "we've moved" page (which forwards to Page Fright), then removes itself.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('sightreading-')).map((k) => caches.delete(k)));
    const wins = await self.clients.matchAll({ type: 'window' });
    await Promise.all(wins.map((w) => w.navigate(w.url).catch(() => {})));
    await self.registration.unregister();
  })());
});
