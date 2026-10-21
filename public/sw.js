/*
 * Asset cache for the group website.
 *
 * Build assets (hashed by Astro) and the optimised portraits used by the
 * animations are served from the browser cache first and refreshed in the
 * background, so coming back to a page does not download them again.
 * Documents are always fetched from the network, so content stays fresh.
 *
 * Bump VERSION whenever you want to drop everything that was cached.
 */
const VERSION = 'v1';
const CACHE = `msmg-assets-${VERSION}`;
const MAX_CACHEABLE_BYTES = 1024 * 1024; // skip multi-megabyte photos

const isCacheable = (url) =>
	url.origin === self.location.origin &&
	(url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/assets/'));

self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((key) => key.startsWith('msmg-assets-') && key !== CACHE).map((key) => caches.delete(key)))
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (!isCacheable(url)) return;

	event.respondWith(
		caches.open(CACHE).then(async (cache) => {
			const cached = await cache.match(request);

			const network = fetch(request)
				.then((response) => {
					const size = Number(response.headers.get('content-length') || 0);
					if (response.ok && response.type === 'basic' && size <= MAX_CACHEABLE_BYTES) {
						cache.put(request, response.clone());
					}
					return response;
				})
				.catch(() => cached);

			return cached || network;
		})
	);
});
