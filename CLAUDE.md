# Elysian – Sorsi di Poesia

Astro static landing page for the bar "Elysian – Sorsi di Poesia". Single page (`src/pages/index.astro`), the entire menu rendered from `src/data/menu.ts` (also the source for the embedded schema.org Menu JSON-LD).

## Build & deploy

```
npm install
npm run build
```

Deploy the contents of `dist/`. No environment variables required, no server-side runtime — output is fully static.

## Tests

```
npm test
```

Runs the full Vitest suite, including a real `astro build` + assertions against the built `dist/index.html`.

## One-time asset regeneration

These scripts were run once during initial development and their output is committed — they don't run automatically and don't need to be re-run unless the source logo or font choice changes:

- `node scripts/generate-brand-assets.mjs` — rasterizes `Contenuti/Logo Elysian.pdf` (not tracked in git — must be present locally to re-run this) into `src/assets/logo-source.png`, `public/favicon.png`, `public/apple-touch-icon.png`, `public/og-image.png`.
- `node scripts/fetch-fonts.mjs` — downloads the self-hosted Cormorant Garamond woff2 files into `public/fonts/`.
