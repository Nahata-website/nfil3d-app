# NFIL3D App

The official NFIL3D app for Android, iOS and the web, built from one Expo (React Native) codebase.

- **Shop**: the live nfil3d.com catalog (WooCommerce Store API), GST-inclusive prices, cart and checkout on nfil3d.com
- **Models**: free 3D model collections curated by NFIL3D, uploads with review
- **My printer**: pair a Mini-N, N1 or N2 and queue prints
- **Learn**: guides and a weekly quiz with prizes
- **Profile**: orders, addresses, rewards, account deletion

Brand: NFIL3D Brand Guidelines v1.2 (light mustard `#F5CB7B`, commerce orange `#FF8A00` for buy actions, Inter Tight 900 + Inter).

## Run locally

```bash
npm install
npm run sync        # refresh the bundled product snapshot from nfil3d.com
npm run web         # web in the browser
npm start           # scan the QR code with Expo Go on your phone
```

## Deploy the web app to Cloudflare Pages

In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, pick this repo, then:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build:web` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION` = `22` |

Every push to `main` deploys automatically, and pull requests get preview URLs.

`functions/api/products.js` runs as a Pages Function at `/api/products`. It proxies the nfil3d.com Store API, which browsers can't call directly because of CORS, and caches the result for 10 minutes. `public/_redirects` makes deep links like `/product/3180` work.

## Publish to the App Store and Google Play

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform all --profile production
npx eas-cli@latest submit --platform all
```

Builds run in Expo's cloud, so you don't need a Mac. You need an Apple Developer account and a Google Play Console account, preferably registered to the NFIL3D company (this needs a D-U-N-S number).

## Multi-item checkout

A single product checks out with standard WooCommerce. To hand over a whole cart, install `wordpress/nfil3d-app-cart.php` on nfil3d.com (in `wp-content/mu-plugins/`).

## What's next

- Real Google, Apple and phone OTP sign-in (Firebase Auth). The UI is complete, and this build creates a local profile.
- Community uploads storage and moderation (Supabase).
- Printer Wi-Fi pairing, once the Mini-N, N1 and N2 connectivity is confirmed.
