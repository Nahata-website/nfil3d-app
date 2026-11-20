// Cloudflare Pages skips any folder named `node_modules` when uploading a build,
// so fonts and icons Expo exports to dist/assets/node_modules/** would 404 there.
// This moves them to dist/assets/vendor/** and rewrites every reference.
import { existsSync } from 'node:fs';
import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const FROM = join(DIST, 'assets', 'node_modules');
const TO = join(DIST, 'assets', 'vendor');

if (!existsSync(FROM)) {
  console.log('fix-pages-assets: nothing to move');
  process.exit(0);
}
await rename(FROM, TO);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(js|html|json|css|map)$/.test(entry.name)) yield p;
  }
}

let changed = 0;
for await (const file of walk(DIST)) {
  const text = await readFile(file, 'utf8');
  if (!text.includes('/assets/node_modules/')) continue;
  await writeFile(file, text.split('/assets/node_modules/').join('/assets/vendor/'));
  changed++;
}
console.log(`fix-pages-assets: moved assets to /assets/vendor, rewrote ${changed} files`);
