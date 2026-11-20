import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import snapshot from '@/data/products.json';

export type Product = {
  id: number;
  name: string;
  slug: string;
  url: string;
  price: number | null;
  regularPrice: number | null;
  onSale: boolean;
  inStock: boolean;
  hasOptions: boolean;
  images: string[];
  categories: number[];
  categoryNames: string[];
  summary: string;
};

// WooCommerce category ids on nfil3d.com
export const CAT = { printers: 41, fdmPrinters: 43, resinPrinters: 44, pens: 96, penFilaments: 115, models: 128, accessories: 45 };

export type ShopTab = 'printers' | 'filaments' | 'pens' | 'penFilaments' | 'accessories';
export const SHOP_TABS: { key: ShopTab; label: string }[] = [
  { key: 'printers', label: 'Printers' },
  { key: 'filaments', label: 'Filaments' },
  { key: 'pens', label: '3D pens' },
  { key: 'penFilaments', label: 'Pen refills' },
  { key: 'accessories', label: 'Accessories' },
];

export function shopTabOf(p: Product): ShopTab | 'models' {
  if (p.categories.includes(CAT.models)) return 'models';
  if ([CAT.printers, CAT.fdmPrinters, CAT.resinPrinters].some((c) => p.categories.includes(c))) return 'printers';
  if (p.categories.includes(CAT.penFilaments)) return 'penFilaments';
  if (p.categories.includes(CAT.pens)) return 'pens';
  if (p.categories.includes(CAT.accessories)) return 'accessories';
  return 'filaments';
}

export const NFIL_PRINTERS = [
  { key: 'mini', name: 'Mini-N', match: /mini-?n 3d printer/i, spec: '200 × 200 × 200 mm' },
  { key: 'n1', name: 'N1', match: /^n1 3d printer/i, spec: '250 × 250 × 270 mm' },
  { key: 'n2', name: 'N2', match: /^n2 3d printer/i, spec: '250 × 250 × 300 mm' },
] as const;

export function inr(n: number | null) {
  if (n == null) return '';
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function cleanModelName(name: string) {
  return name.replace(/^[^A-Za-z0-9]+/, '').trim();
}

const LIVE_URL = Platform.OS === 'web' ? '/api/products' : 'https://nfil3d.com/wp-json/wc/store/v1/products?per_page=100';

let cache: Product[] = (snapshot as { products: Product[] }).products;
let liveLoaded = false;
const listeners = new Set<(p: Product[]) => void>();

async function refreshLive() {
  if (liveLoaded) return;
  liveLoaded = true;
  try {
    if (Platform.OS === 'web') {
      const res = await fetch(LIVE_URL);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length) cache = data.products;
    } else {
      // Native apps call the public Store API directly (no CORS on native).
      const { fetchCatalog } = await import('../../functions/_lib/catalog.js');
      const products = await fetchCatalog(fetch);
      if (products.length) cache = products as Product[];
    }
    listeners.forEach((l) => l(cache));
  } catch {
    // Offline or blocked: keep the bundled snapshot.
  }
}

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>(cache);
  useEffect(() => {
    listeners.add(setProducts);
    refreshLive();
    return () => {
      listeners.delete(setProducts);
    };
  }, []);
  return products;
}

export function getProduct(products: Product[], id: number) {
  return products.find((p) => p.id === id);
}

export function checkoutUrl(items: { id: number; qty: number }[]) {
  // Single item works with stock WooCommerce. Extra items use the small
  // nf_cart handoff plugin in /wordpress (installs on nfil3d.com).
  const [first, ...rest] = items;
  const q = new URLSearchParams({ 'add-to-cart': String(first.id), quantity: String(first.qty) });
  if (rest.length) q.set('nf_cart', rest.map((i) => `${i.id}:${i.qty}`).join(','));
  q.set('utm_source', 'nfil3d_app');
  return `https://nfil3d.com/checkout/?${q.toString()}`;
}
