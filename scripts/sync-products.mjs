// Pulls the live catalog from nfil3d.com (public WooCommerce Store API)
// and writes a trimmed snapshot the app bundles for instant, offline-safe loading.
// Usage: npm run sync
import { writeFile, mkdir } from 'node:fs/promises';
import { fetchCatalog } from '../functions/_lib/catalog.js';

const products = await fetchCatalog();
await mkdir('src/data', { recursive: true });
await writeFile('src/data/products.json', JSON.stringify({ syncedAt: new Date().toISOString(), products }));
console.log(`Saved ${products.length} products`);
