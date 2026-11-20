// Cloudflare Pages Function: GET /api/products
// Proxies the public WooCommerce Store API on nfil3d.com (which sends no CORS
// headers for browsers), trims the payload and caches it at the edge for 10 minutes.
import { fetchCatalog } from '../_lib/catalog.js';

export async function onRequestGet(context) {
  const cache = caches.default;
  const key = new Request(new URL('/api/products', context.request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  try {
    const products = await fetchCatalog(fetch);
    const res = new Response(JSON.stringify({ syncedAt: new Date().toISOString(), products }), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=600',
      },
    });
    context.waitUntil(cache.put(key, res.clone()));
    return res;
  } catch (err) {
    return new Response(JSON.stringify({ error: 'catalog_unavailable' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
}
