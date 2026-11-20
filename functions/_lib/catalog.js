// Shared by the Cloudflare Pages Function (live API) and the snapshot script.
// Keeps only the fields the app needs, so the payload stays small on mobile.

const ENTITIES = { '&amp;': '&', '&#8211;': '–', '&#8212;': '—', '&#8217;': '’', '&#8216;': '‘', '&#8220;': '“', '&#8221;': '”', '&quot;': '"', '&#039;': "'", '&#038;': '&', '&nbsp;': ' ', '&times;': '×', '&#215;': '×' };

export function decode(str = '') {
  return String(str)
    .replace(/&[#a-z0-9]+;/gi, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripHtml(html = '') {
  return decode(String(html).replace(/<\/(p|li|h\d)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' '))
    .replace(/ *\n */g, '\n')
    .trim();
}

// Third-party character collections are kept out of the app (store-review and licensing risk).
const BLOCKED = /sonic|deadpool|gundam|labubu|urban vibe/i;

export function normalizeProduct(p) {
  if (!p || !p.id) return null;
  const name = decode(p.name);
  if (BLOCKED.test(name)) return null;
  const minor = Number(p.prices?.currency_minor_unit ?? 2);
  const toNum = (v) => (v == null || v === '' ? null : Number(v) / Math.pow(10, minor));
  const short = stripHtml(p.short_description).slice(0, 600);
  return {
    id: p.id,
    name,
    slug: p.slug,
    url: p.permalink,
    price: toNum(p.prices?.price),
    regularPrice: toNum(p.prices?.regular_price),
    onSale: !!p.on_sale,
    inStock: !!p.is_in_stock,
    hasOptions: !!p.has_options,
    images: (p.images || []).slice(0, 6).map((i) => i.src),
    categories: (p.categories || []).map((c) => c.id),
    categoryNames: (p.categories || []).map((c) => decode(c.name)),
    summary: short,
  };
}

export async function fetchCatalog(fetchImpl = fetch) {
  const base = 'https://nfil3d.com/wp-json/wc/store/v1/products';
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetchImpl(`${base}?per_page=100&page=${page}`, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`Store API ${res.status}`);
    all.push(...(await res.json()));
    if (page >= Number(res.headers.get('x-wp-totalpages') || 1)) break;
  }
  return all.map(normalizeProduct).filter(Boolean);
}
