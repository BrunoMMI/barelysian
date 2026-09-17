# Elysian Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Astro landing page for bar "Elysian – Sorsi di Poesia" — a single page whose whole job is letting someone who scanned a QR code read the full real menu instantly on their phone.

**Architecture:** Static Astro site (zero client-side JS), one `index.astro` page assembling `Header`/`Hero`/`MenuCategory`/`Footer` components, a single typed `src/data/menu.ts` file as the one source of truth for both the rendered HTML and a generated `schema.org/Menu` JSON-LD block. Brand assets (logo, favicon, OG image, one self-hosted display font) are generated once by small Node scripts and committed as static files — nothing is regenerated at every build.

**Tech Stack:** Astro 7, `@astrojs/sitemap`, Vitest 5 + `linkedom` for build-output assertions, `mupdf` (WASM, no native build step) for PDF→PNG logo extraction, `sharp` for image derivatives.

**Spec:** `docs/superpowers/specs/2026-09-17-elysian-landing-page-design.md`

## Global Constraints

- Brand name is **"Elysian"** everywhere (not "Elysia") — matches the logo and every menu page.
- **No contact info** (address/phone/hours/socials) anywhere on the site — none exists in the source material. No `LocalBusiness` JSON-LD.
- **Wine Selection shows one price per wine** (bottle price only) — the calice/bottiglia pairing in the source photo isn't reliably legible.
- **Single-page site** — `src/pages/index.astro` only, anchor navigation, no `/menu` route.
- **No menu photos used as imagery** — they're low-quality phone snapshots of the physical booklet. Only the logo (extracted from `Contenuti/Logo Elysian.pdf`) is used as a visual asset.
- **Zero client-side JavaScript.** Native CSS `scroll-behavior: smooth`, disabled under `prefers-reduced-motion: reduce`.
- **One self-hosted display font only** (Cormorant Garamond, weights 400/600, latin subset, local files — not loaded from Google's CDN at runtime) for headings/payoff. Body/menu text uses the system font stack. No other webfonts.
- Site URL: `https://www.elysiamsorsidipoesia.it`.
- Responsive down to 320px, no horizontal overflow, tap targets ≥44px, checked at 320/375/390/430/768/1024/1280/1440/1920px.
- `lang="it"` on the document; every price/menu item comes verbatim from the spec's content inventory — never invent an item, price, or fact not in that inventory.

---

## File structure

```
scripts/
  generate-brand-assets.mjs   # PDF → logo PNG, favicon, apple-touch-icon, OG image
  fetch-fonts.mjs             # downloads self-hosted Cormorant Garamond woff2 files
src/
  assets/
    logo-source.png           # generated master logo raster (transparent)
  data/
    menu.ts                   # typed menu content — single source of truth
  lib/
    parsePrice.ts             # "1.10€" -> 1.1, pure helper
    menuJsonLd.ts              # menu data -> schema.org Menu JSON-LD
  components/
    Logo.astro
    Header.astro
    Hero.astro
    MenuCategory.astro
    Footer.astro
  layouts/
    BaseLayout.astro           # HTML shell, meta tags, JSON-LD injection
  styles/
    global.css                 # design tokens, reset, base styles, @font-face
  pages/
    index.astro                 # assembles everything
public/
  fonts/
    cormorant-garamond-400.woff2
    cormorant-garamond-600.woff2
  favicon.png
  apple-touch-icon.png
  og-image.png
  robots.txt
tests/
  parsePrice.test.ts
  menuJsonLd.test.ts
  fonts.test.ts
  build.test.ts
astro.config.mjs
tsconfig.json
vitest.config.ts
package.json
.gitignore
```

---

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`
- Create: `src/pages/index.astro` (minimal placeholder, replaced incrementally by later tasks)
- Create: `public/robots.txt`
- Test: `tests/build.test.ts`

**Interfaces:**
- Produces: an `npm run build` that outputs to `dist/`, and `npm test` running Vitest. All later tasks assume both scripts exist.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "elysian-landing",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^7.3.3",
    "@astrojs/sitemap": "^3.7.4"
  },
  "devDependencies": {
    "vitest": "^5.0.1",
    "linkedom": "^0.18.13",
    "mupdf": "^1.28.1",
    "sharp": "^0.35.4"
  }
}
```

Run: `npm install`

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.elysiamsorsidipoesia.it",
  integrations: [sitemap()],
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.astro/
```

- [ ] **Step 5: Create the minimal placeholder page** at `src/pages/index.astro`

```astro
---
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <title>Elysian – Sorsi di Poesia</title>
  </head>
  <body>
    <h1>Elysian</h1>
  </body>
</html>
```

- [ ] **Step 6: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://www.elysiamsorsidipoesia.it/sitemap-index.xml
```

- [ ] **Step 7: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 8: Write `tests/build.test.ts`**

```ts
import { beforeAll, describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseHTML } from "linkedom";

let document: Document;

beforeAll(() => {
  execSync("npm run build", { stdio: "inherit" });
  const html = readFileSync("dist/index.html", "utf-8");
  ({ document } = parseHTML(html));
}, 60_000);

describe("built page shell", () => {
  it("declares Italian as the page language", () => {
    expect(document.documentElement.getAttribute("lang")).toBe("it");
  });

  it("has a title mentioning Elysian", () => {
    expect(document.title).toContain("Elysian");
  });

  it("has a level-one heading with the brand name", () => {
    expect(document.querySelector("h1")?.textContent).toContain("Elysian");
  });
});

describe("sitemap generation", () => {
  it("produces a sitemap index file", () => {
    const sitemap = readFileSync("dist/sitemap-index.xml", "utf-8");
    expect(sitemap).toContain("sitemap-0.xml");
  });
});
```

This is a scaffolding task, not a behavior change, so there's no meaningful "red" state to force — the assertions above describe the baseline we just built. Run it to confirm the baseline is right, not to watch it fail.

- [ ] **Step 9: Run the test suite**

Run: `npm test`
Expected: PASS (4 tests)

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts .gitignore src/pages/index.astro public/robots.txt tests/build.test.ts
git commit -m "chore: scaffold Astro project with sitemap and Vitest build checks"
```

---

### Task 2: Menu content data model

**Files:**
- Create: `src/data/menu.ts`
- Create: `src/lib/parsePrice.ts`
- Test: `tests/parsePrice.test.ts`

**Interfaces:**
- Produces:
  - `parsePrice(raw: string): number`
  - `interface MenuItem { name: string; price: string; description?: string }`
  - `interface MenuSubgroup { title?: string; note?: string; items: MenuItem[] }`
  - `interface MenuCategoryData { id: string; title: string; subgroups: MenuSubgroup[] }`
  - `menuCategories: MenuCategoryData[]` (6 entries, ids: `caffetteria`, `bibite`, `drink-list`, `birre-e-liquori`, `wine-selection`, `gelati`)

- [ ] **Step 1: Write the failing test** at `tests/parsePrice.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { parsePrice } from "../src/lib/parsePrice";

describe("parsePrice", () => {
  it("parses a simple decimal price", () => {
    expect(parsePrice("1.10€")).toBe(1.1);
  });

  it("parses a price with no decimal", () => {
    expect(parsePrice("5€")).toBe(5);
  });

  it("takes the first price when two are given", () => {
    expect(parsePrice("2.00€ / 2.50€")).toBe(2);
  });

  it("throws when no number is present", () => {
    expect(() => parsePrice("gratis")).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/parsePrice.test.ts`
Expected: FAIL — `Cannot find module '../src/lib/parsePrice'`

- [ ] **Step 3: Implement** `src/lib/parsePrice.ts`

```ts
export function parsePrice(raw: string): number {
  const match = raw.match(/\d+(?:\.\d+)?/);
  if (!match) {
    throw new Error(`Cannot parse a numeric price from "${raw}"`);
  }
  return Number.parseFloat(match[0]);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/parsePrice.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Create the menu data** at `src/data/menu.ts`

```ts
export interface MenuItem {
  name: string;
  price: string;
  description?: string;
}

export interface MenuSubgroup {
  title?: string;
  note?: string;
  items: MenuItem[];
}

export interface MenuCategoryData {
  id: string;
  title: string;
  subgroups: MenuSubgroup[];
}

export const menuCategories: MenuCategoryData[] = [
  {
    id: "caffetteria",
    title: "Caffetteria",
    subgroups: [
      {
        items: [
          { name: "Caffè espresso", price: "1.10€" },
          { name: "Caffè corretto", price: "1.30€" },
          { name: "Caffè macchiato", price: "1.20€" },
          { name: "Caffè macchiato (senza lattosio o soia)", price: "1.30€" },
          { name: "Crema caffè", price: "2.50€" },
          { name: "Caffè americano", price: "2.00€" },
          { name: "Caffè alla nocciola", price: "1.30€" },
          { name: "Caffè decaffeinato", price: "1.10€" },
          { name: "Caffè deca macchiato", price: "1.20€" },
          { name: "Orzo", price: "1.10€" },
          { name: "Orzo macchiato", price: "1.20€" },
          { name: "Orzo doppio", price: "2.40€" },
          { name: "Ginseng amaro", price: "1.50€" },
          { name: "Ginseng doppio", price: "3.00€" },
          { name: "Ginseng dolce", price: "1.50€" },
          { name: "Ginseng rosso", price: "1.50€" },
          { name: "Ginseng alla nocciola", price: "1.50€" },
          { name: "Ginseng miele e limone", price: "1.50€" },
          { name: "Cappuccino", price: "1.70€" },
          { name: "Cappuccino deca", price: "1.80€" },
          { name: "Cappuccino senza lattosio", price: "1.80€" },
          { name: "Cappuccino ginseng", price: "2.00€" },
          { name: "Cappuccino d'orzo", price: "2.00€" },
          { name: "Cappuccino nutella", price: "2.20€" },
          {
            name: "Cornetti Tre Marie",
            price: "1.30€",
            description:
              "Cioccolato, crema, pistacchio, frutti di bosco, albicocca, integrale al miele, vuoto, vegano ribes e melograno",
          },
          { name: "Cornetto Nutella", price: "1.50€" },
          {
            name: "Succhi di frutta",
            price: "2.00€ / 2.50€",
            description:
              "ACE, albicocca, pesca, arancia di Sicilia, arancia rossa, pera, banana, fragola, melograno, mirtillo, mela, ananas, ananas e cocco, pesca e mango",
          },
          { name: "Spremuta d'arancia", price: "2.50€" },
          { name: "Tè caldo", price: "2.50€" },
          { name: "Cioccolata calda", price: "2.50€" },
          { name: "Granita", price: "2.50€", description: "Vari gusti" },
        ],
      },
    ],
  },
  {
    id: "bibite",
    title: "Bibite",
    subgroups: [
      {
        items: [
          { name: "Crodino classico XL", price: "2.50€" },
          { name: "Crodino rosso XL", price: "2.50€" },
          { name: "Schweppes", price: "2.50€", description: "Arancia, limone, tonica" },
          { name: "Chinotto", price: "2.50€" },
          { name: "Bitter", price: "2.00€", description: "Bianco, rosso" },
          { name: "Cocktail San Pellegrino", price: "2.00€", description: "Bianco, rosso" },
          { name: "Tassoni", price: "2.50€", description: "Classica, zero" },
          { name: "Tassoni pompelmo rosa", price: "2.50€" },
          { name: "Coca-Cola lattina", price: "2.00€" },
          { name: "Coca-Cola Zero lattina", price: "2.00€" },
          { name: "Pepsi lattina", price: "2.00€", description: "Zero, lime, limone" },
          { name: "Sprite lattina", price: "2.00€" },
          { name: "Coca-Cola bottiglia PET", price: "2.50€", description: "Classica, zero" },
          { name: "Coca-Cola vetro", price: "3.00€", description: "Classica, zero" },
          { name: "Estathè lattina", price: "2.00€", description: "Pesca, limone" },
          { name: "Estathè bottiglia", price: "2.50€", description: "Pesca, limone, zero" },
          { name: "Estathè vetro", price: "3.00€", description: "Pesca, limone" },
          { name: "Estathè deteinato", price: "2.00€", description: "Pesca, limone" },
          { name: "Estathè brick", price: "1.20€" },
          { name: "Redbull", price: "3.00€", description: "Vari gusti" },
          { name: "Aloe Vera", price: "2.50€", description: "Classica, melograno, ananas" },
        ],
      },
    ],
  },
  {
    id: "drink-list",
    title: "Drink List",
    subgroups: [
      {
        title: "Spritz",
        items: [
          { name: "Spritz Aperol", price: "5€" },
          { name: "Spritz Campari", price: "5€" },
          { name: "Spritz Hugo", price: "5€" },
          { name: "Spritz Cynar", price: "5€" },
          { name: "Spritz Limoncello", price: "5€" },
          { name: "Spritz Sarti Rosa", price: "5€" },
          { name: "Spritz Select", price: "5€" },
          { name: "Spritz Rabarbaro", price: "5€" },
        ],
      },
      {
        title: "Classici",
        items: [
          { name: "Negroni", price: "7€" },
          { name: "Mi-To", price: "7€" },
          { name: "Negroni sbagliato", price: "7€", description: "Base Gin Mare" },
          { name: "Americano", price: "7€" },
          { name: "Moscow Mule", price: "7€" },
        ],
      },
      {
        title: "Gin Tonic / Lemon",
        items: [
          { name: "Gin Mare", price: "8€" },
          { name: "Bulldog", price: "8€" },
          { name: "Malfy", price: "8€" },
          { name: "Bombay", price: "7€" },
          { name: "Tanquerai", price: "7€" },
          { name: "Bickens", price: "7€" },
        ],
      },
      {
        title: "Signature Tonic",
        items: [
          { name: "Velvet Berry Tonic", price: "10€", description: "Base Brockmans Gin" },
          { name: "Garden Royal Tonic", price: "10€", description: "Base Hendrick's Gin" },
          { name: "Riviera Prestige Tonic", price: "10€", description: "Base Portofino Gin" },
          { name: "Japanese Blossom Tonic", price: "10€", description: "Base Etsu Gin" },
        ],
      },
    ],
  },
  {
    id: "birre-e-liquori",
    title: "Birre e Liquori",
    subgroups: [
      {
        title: "Birre in bottiglia",
        items: [
          { name: "Ceres Strong Ale", price: "3.50€" },
          { name: "Nastro Azzurro", price: "2.00€" },
          { name: "Heineken", price: "2.50€" },
          { name: "Peroni Limone", price: "2.00€" },
          { name: "Poretti IPA", price: "3.00€" },
          { name: "Poretti senza Glutine", price: "3.00€" },
          { name: "Forst", price: "3.00€" },
          { name: "Corona", price: "3.00€" },
          { name: "Beck's", price: "2.50€" },
          { name: "Bud", price: "2.50€" },
          { name: "Ichnusa", price: "3.00€" },
          { name: "Tennent's", price: "4.00€" },
          { name: "Tuborg", price: "2.00€" },
          { name: "Tuborg Limone", price: "2.00€" },
          { name: "Stella Artois", price: "3.00€" },
        ],
      },
      {
        title: "Alla spina",
        items: [
          { name: "Spina 0.3L", price: "3.00€" },
          { name: "Spina 0.5L", price: "5.00€" },
        ],
      },
      {
        title: "Liquori",
        items: [
          { name: "Amaro del Capo", price: "3.00€" },
          { name: "Averna", price: "3.00€" },
          { name: "Baileys", price: "3.00€" },
          { name: "Branca Menta", price: "3.00€" },
          { name: "Cynar", price: "3.00€" },
          { name: "Cognac", price: "3.00€" },
          { name: "Fernet", price: "3.00€" },
          { name: "Grappa Barrique", price: "3.00€" },
          { name: "Grappa Bianca", price: "3.00€" },
          { name: "Orzo macchiato", price: "3.00€" },
          { name: "Jack Daniel's", price: "3.00€" },
          { name: "Jefferson", price: "3.50€" },
          { name: "Jägermeister", price: "3.00€" },
          { name: "Limoncello", price: "3.00€" },
          { name: "Martini", price: "3.00€" },
          { name: "Montenegro", price: "3.00€" },
          { name: "Petrus", price: "3.00€" },
          { name: "Punch", price: "3.00€" },
          { name: "Rum", price: "3.00€" },
          { name: "Rum Barceló", price: "3.00€" },
          { name: "Sambuca", price: "3.00€" },
          { name: "Strega", price: "3.00€" },
          { name: "Tequila", price: "3.00€" },
          { name: "Unicum", price: "3.00€" },
          { name: "Vecchia Romagna", price: "3.00€" },
          { name: "Vodka", price: "3.00€" },
        ],
      },
    ],
  },
  {
    id: "wine-selection",
    title: "Wine Selection",
    subgroups: [
      {
        items: [
          {
            name: "Traminer Aromatico",
            price: "18€",
            description: "I Magredi — Friuli-Venezia Giulia — 100% Traminer Aromatico",
          },
          {
            name: "Pallagrè Bianco",
            price: "18€",
            description: "Quercete — Campania — 100% Pallagrello Bianco",
          },
          {
            name: "Bourgogne AOC Chardonnay",
            price: "22€",
            description: "Reine Pédauque — Francia — 100% Chardonnay",
          },
          {
            name: "Bullorosso Campania IGP",
            price: "20€",
            description: "Vitialte — Campania — 70% Aglianico, 30% Montepulciano",
          },
          {
            name: "Bourgogne Pinot Noir AOP",
            price: "22€",
            description: "Reine Pédauque — Francia — 100% Pinot Noir",
          },
          {
            name: "Gelso Nero Puglia IGT",
            price: "20€",
            description: "Podere 29 — Puglia — 100% Nero di Troia",
          },
          {
            name: "Petali IGT Toscano Rosato",
            price: "20€",
            description: "Cantalici — Toscana — 100% Sangiovese",
          },
        ],
      },
    ],
  },
  {
    id: "gelati",
    title: "Gelati",
    subgroups: [
      {
        note:
          "Gusti: Limone, Fragola, Panna, Nocciola, Cioccolato fondente, Pistacchio, Caffè, Stracciatella, Fiordilatte, Tiramisù",
        items: [
          { name: "Cono (2 gusti)", price: "2.50€" },
          { name: "Coppa (2 gusti)", price: "2.50€" },
          { name: "Cono (3 gusti)", price: "3.50€" },
          { name: "Coppa (3 gusti)", price: "3.50€" },
        ],
      },
    ],
  },
];
```

- [ ] **Step 6: Commit**

```bash
git add src/data/menu.ts src/lib/parsePrice.ts tests/parsePrice.test.ts
git commit -m "feat: add typed menu content data and price parsing helper"
```

---

### Task 3: Menu JSON-LD generator

**Files:**
- Create: `src/lib/menuJsonLd.ts`
- Test: `tests/menuJsonLd.test.ts`

**Interfaces:**
- Consumes: `MenuCategoryData`, `MenuSubgroup` from `src/data/menu.ts` (Task 2); `parsePrice` from `src/lib/parsePrice.ts` (Task 2)
- Produces: `buildMenuJsonLd(categories: MenuCategoryData[]): Record<string, unknown>`

- [ ] **Step 1: Write the failing test** at `tests/menuJsonLd.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { buildMenuJsonLd } from "../src/lib/menuJsonLd";
import { menuCategories } from "../src/data/menu";

describe("buildMenuJsonLd", () => {
  it("wraps the menu in a schema.org Menu type", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    expect(jsonld["@context"]).toBe("https://schema.org");
    expect(jsonld["@type"]).toBe("Menu");
  });

  it("creates one MenuSection per top-level category", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    expect(jsonld.hasMenuSection).toHaveLength(menuCategories.length);
  });

  it("nests named subgroups as their own MenuSection with priced items", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    const drinkList = jsonld.hasMenuSection.find((s: any) => s.name === "Drink List");
    const spritz = drinkList.hasMenuSection.find((s: any) => s.name === "Spritz");
    expect(spritz.hasMenuItem).toHaveLength(8);
    expect(spritz.hasMenuItem[0].offers.price).toBe(5);
    expect(spritz.hasMenuItem[0].offers.priceCurrency).toBe("EUR");
  });

  it("lists items directly on categories with no subgroup titles", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    const caffetteria = jsonld.hasMenuSection.find((s: any) => s.name === "Caffetteria");
    expect(caffetteria.hasMenuItem.length).toBeGreaterThan(0);
    expect(caffetteria.hasMenuSection).toBeUndefined();
  });

  it("carries a subgroup note as the nested section's description", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    const gelati = jsonld.hasMenuSection.find((s: any) => s.name === "Gelati");
    expect(gelati.hasMenuItem.some((item: any) => item.name.startsWith("Cono"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/menuJsonLd.test.ts`
Expected: FAIL — `Cannot find module '../src/lib/menuJsonLd'`

- [ ] **Step 3: Implement** `src/lib/menuJsonLd.ts`

```ts
import type { MenuCategoryData, MenuItem, MenuSubgroup } from "../data/menu";
import { parsePrice } from "./parsePrice";

export function buildMenuJsonLd(categories: MenuCategoryData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Elysian – Sorsi di Poesia",
    hasMenuSection: categories.map(categoryToSection),
  };
}

function categoryToSection(category: MenuCategoryData) {
  const namedSubgroups = category.subgroups.filter((sg) => sg.title);
  const unnamedSubgroups = category.subgroups.filter((sg) => !sg.title);

  const section: Record<string, unknown> = {
    "@type": "MenuSection",
    name: category.title,
  };

  if (namedSubgroups.length > 0) {
    section.hasMenuSection = namedSubgroups.map(subgroupToSection);
  }

  const directItems = unnamedSubgroups.flatMap((sg) => sg.items);
  if (directItems.length > 0) {
    section.hasMenuItem = directItems.map(itemToJsonLd);
  }

  return section;
}

function subgroupToSection(subgroup: MenuSubgroup) {
  const section: Record<string, unknown> = {
    "@type": "MenuSection",
    name: subgroup.title,
    hasMenuItem: subgroup.items.map(itemToJsonLd),
  };
  if (subgroup.note) {
    section.description = subgroup.note;
  }
  return section;
}

function itemToJsonLd(item: MenuItem) {
  return {
    "@type": "MenuItem",
    name: item.name,
    ...(item.description ? { description: item.description } : {}),
    offers: {
      "@type": "Offer",
      price: parsePrice(item.price),
      priceCurrency: "EUR",
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/menuJsonLd.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/menuJsonLd.ts tests/menuJsonLd.test.ts
git commit -m "feat: generate schema.org Menu JSON-LD from the menu data"
```

---

### Task 4: Brand assets — logo, favicon, apple-touch-icon, OG image

**Files:**
- Create: `scripts/generate-brand-assets.mjs`
- Create (generated by the script): `src/assets/logo-source.png`, `public/favicon.png`, `public/apple-touch-icon.png`, `public/og-image.png`
- Test: `tests/brandAssets.test.ts`

**Interfaces:**
- Produces: `src/assets/logo-source.png` (a transparent-background raster of the full logo, used by the `Logo` component in Task 7 via `astro:assets`).

This task rasterizes the vector logo PDF at high resolution rather than trying to extract editable vector paths — that requires a design tool and can't be scripted reliably. The verified approach below (`mupdf` + `sharp`) has already been spiked and confirmed to produce a crisp, transparent 2665×2382 PNG from `Contenuti/Logo Elysian.pdf`.

- [ ] **Step 1: Write the generation script** at `scripts/generate-brand-assets.mjs`

```js
import * as mupdf from "mupdf";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PDF_PATH = path.join(ROOT, "Contenuti", "Logo Elysian.pdf");
const ASSETS_DIR = path.join(ROOT, "src", "assets");
const PUBLIC_DIR = path.join(ROOT, "public");

fs.mkdirSync(ASSETS_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

// 1. Rasterize the vector PDF logo at high resolution (transparent background).
const pdfBuffer = fs.readFileSync(PDF_PATH);
const doc = mupdf.Document.openDocument(pdfBuffer, "application/pdf");
const page = doc.loadPage(0);
const zoom = 4;
const matrix = mupdf.Matrix.scale(zoom, zoom);
const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, true);
const masterPngBuffer = pixmap.asPNG();

const masterPath = path.join(ASSETS_DIR, "logo-source.png");
fs.writeFileSync(masterPath, masterPngBuffer);
console.log(`Saved master logo: ${masterPath} (${pixmap.getWidth()}x${pixmap.getHeight()})`);

// 2. Favicon: trimmed, square, transparent.
await sharp(masterPngBuffer)
  .trim()
  .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(PUBLIC_DIR, "favicon.png"));

// 3. Apple touch icon: trimmed, square, opaque cream background (iOS ignores transparency).
await sharp(masterPngBuffer)
  .trim()
  .resize(160, 160, { fit: "contain", background: { r: 247, g: 243, b: 234, alpha: 1 } })
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: { r: 247, g: 243, b: 234 } })
  .flatten({ background: { r: 247, g: 243, b: 234 } })
  .png()
  .toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));

// 4. Social-share OG image: logo centered on the site's cream background.
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const logoForOg = await sharp(masterPngBuffer).resize({ height: 480 }).toBuffer();
const logoMeta = await sharp(logoForOg).metadata();

await sharp({
  create: {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    channels: 3,
    background: { r: 247, g: 243, b: 234 },
  },
})
  .composite([
    {
      input: logoForOg,
      left: Math.round((OG_WIDTH - (logoMeta.width ?? 0)) / 2),
      top: Math.round((OG_HEIGHT - (logoMeta.height ?? 0)) / 2),
    },
  ])
  .png()
  .toFile(path.join(PUBLIC_DIR, "og-image.png"));

console.log("Saved favicon.png, apple-touch-icon.png, og-image.png");
```

- [ ] **Step 2: Run the script**

Run: `node scripts/generate-brand-assets.mjs`
Expected: prints the four saved-file lines, no errors. Verify `src/assets/logo-source.png`, `public/favicon.png`, `public/apple-touch-icon.png`, and `public/og-image.png` now exist.

- [ ] **Step 3: Write a verification test** at `tests/brandAssets.test.ts`

```ts
import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { existsSync } from "node:fs";

describe("generated brand assets", () => {
  it("has a large transparent master logo", async () => {
    const filePath = "src/assets/logo-source.png";
    expect(existsSync(filePath)).toBe(true);
    const meta = await sharp(filePath).metadata();
    expect(meta.width).toBeGreaterThan(1000);
    expect(meta.hasAlpha).toBe(true);
  });

  it("has a square favicon", async () => {
    const meta = await sharp("public/favicon.png").metadata();
    expect(meta.width).toBe(64);
    expect(meta.height).toBe(64);
  });

  it("has a square apple touch icon", async () => {
    const meta = await sharp("public/apple-touch-icon.png").metadata();
    expect(meta.width).toBe(180);
    expect(meta.height).toBe(180);
  });

  it("has a 1200x630 OG image", async () => {
    const meta = await sharp("public/og-image.png").metadata();
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(630);
  });
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/brandAssets.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-brand-assets.mjs src/assets/logo-source.png public/favicon.png public/apple-touch-icon.png public/og-image.png tests/brandAssets.test.ts
git commit -m "feat: generate logo, favicon, and OG image assets from the source PDF"
```

---

### Task 5: Self-hosted display font

**Files:**
- Create: `scripts/fetch-fonts.mjs`
- Create (generated by the script): `public/fonts/cormorant-garamond-400.woff2`, `public/fonts/cormorant-garamond-600.woff2`
- Test: `tests/fonts.test.ts`

**Interfaces:**
- Produces: two local woff2 files consumed by the `@font-face` rules in `src/styles/global.css` (Task 6).

**Important:** request each weight from the Google Fonts CSS2 API **separately** (`wght@400` and `wght@600` in two different requests, not combined as `wght@400;600`) — a combined request has been observed to return the same file for both weights. Two separate requests reliably return distinct files.

- [ ] **Step 1: Write the fetch script** at `scripts/fetch-fonts.mjs`

```js
import fs from "node:fs";
import path from "node:path";

const WEIGHTS = [400, 600];
const OUT_DIR = path.join(process.cwd(), "public", "fonts");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const weight of WEIGHTS) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl, { headers: { "User-Agent": USER_AGENT } }).then((r) => r.text());

  const latinBlockMatch = css.match(/\/\* latin \*\/\s*@font-face\s*\{([^}]*)\}/);
  if (!latinBlockMatch) {
    throw new Error(`Could not find a latin @font-face block for weight ${weight}`);
  }
  const fontUrl = latinBlockMatch[1].match(/url\(([^)]+)\)/)?.[1];
  if (!fontUrl) {
    throw new Error(`Could not find a font URL for weight ${weight}`);
  }

  const fontBuffer = Buffer.from(await fetch(fontUrl).then((r) => r.arrayBuffer()));
  const outPath = path.join(OUT_DIR, `cormorant-garamond-${weight}.woff2`);
  fs.writeFileSync(outPath, fontBuffer);
  console.log(`Saved ${outPath} (${fontBuffer.length} bytes)`);
}
```

- [ ] **Step 2: Run the script**

Run: `node scripts/fetch-fonts.mjs`
Expected: two "Saved ..." lines. Verify both files exist under `public/fonts/`.

- [ ] **Step 3: Write a verification test** at `tests/fonts.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

describe("self-hosted display font", () => {
  for (const weight of [400, 600]) {
    it(`has a valid woff2 file for weight ${weight}`, () => {
      const filePath = `public/fonts/cormorant-garamond-${weight}.woff2`;
      expect(existsSync(filePath)).toBe(true);
      const buffer = readFileSync(filePath);
      expect(buffer.subarray(0, 4).toString("ascii")).toBe("wOF2");
    });
  }

  it("uses two distinct files for the two weights", () => {
    const file400 = readFileSync("public/fonts/cormorant-garamond-400.woff2");
    const file600 = readFileSync("public/fonts/cormorant-garamond-600.woff2");
    expect(file400.equals(file600)).toBe(false);
  });
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/fonts.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/fetch-fonts.mjs public/fonts tests/fonts.test.ts
git commit -m "feat: self-host Cormorant Garamond display font (latin subset)"
```

---

### Task 6: Design tokens and base styles

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro:1-11` (import the stylesheet)

**Interfaces:**
- Produces CSS custom properties consumed by every component task from here on: `--color-cream`, `--color-ink`, `--color-gold`, `--color-gold-soft`, `--color-sage`, `--color-tile-blue`, `--font-display`, `--font-body`, `--content-max-width`.

- [ ] **Step 1: Add a build assertion for the design tokens** — append to `tests/build.test.ts`, inside a new `describe` block:

```ts
describe("design tokens", () => {
  it("ships a stylesheet defining the core color tokens", () => {
    const cssFiles = readdirSync("dist/_astro").filter((f) => f.endsWith(".css"));
    const allCss = cssFiles.map((f) => readFileSync(`dist/_astro/${f}`, "utf-8")).join("\n");
    expect(allCss).toContain("--color-ink");
    expect(allCss).toContain("--color-cream");
    expect(allCss).toContain("prefers-reduced-motion");
  });
});
```

Add `import { readdirSync } from "node:fs";` to the existing `node:fs` import line at the top of `tests/build.test.ts` (change `import { readFileSync } from "node:fs";` to `import { readFileSync, readdirSync } from "node:fs";`).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/build.test.ts`
Expected: FAIL — `dist/_astro` doesn't exist yet, or the CSS doesn't contain the token names.

- [ ] **Step 3: Implement** `src/styles/global.css`

```css
@font-face {
  font-family: "Cormorant Garamond";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/cormorant-garamond-400.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+2000-206F, U+20AC;
}

@font-face {
  font-family: "Cormorant Garamond";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/cormorant-garamond-600.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+2000-206F, U+20AC;
}

:root {
  color-scheme: light;

  --color-cream: #f7f3ea;
  --color-ink: #1e2e3f;
  --color-gold: #b08d57;
  --color-gold-soft: #e4d9c3;
  --color-sage: #7c8b6f;
  --color-tile-blue: #3a5a78;

  --font-display: "Cormorant Garamond", Georgia, "Times New Roman", serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    sans-serif;

  --content-max-width: 72rem;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

body {
  margin: 0;
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-body);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.1;
  margin: 0 0 0.5em;
}

a {
  color: inherit;
}

img {
  max-width: 100%;
  display: block;
}

:focus-visible {
  outline: 3px solid var(--color-tile-blue);
  outline-offset: 2px;
}
```

- [ ] **Step 4: Import the stylesheet** — replace the contents of `src/pages/index.astro` with:

```astro
---
import "../styles/global.css";
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <title>Elysian – Sorsi di Poesia</title>
  </head>
  <body>
    <h1>Elysian</h1>
  </body>
</html>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/build.test.ts`
Expected: PASS (all tests, including the new one)

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/pages/index.astro tests/build.test.ts
git commit -m "feat: add design tokens, self-hosted font, and base styles"
```

---

### Task 7: Logo component and sticky header navigation

**Files:**
- Create: `src/components/Logo.astro`
- Create: `src/components/Header.astro`
- Modify: `src/pages/index.astro` (render `Header`)
- Test: `tests/build.test.ts` (append)

**Interfaces:**
- Consumes: `src/assets/logo-source.png` (Task 4), `menuCategories` from `src/data/menu.ts` (Task 2)
- Produces: `Logo` component with props `{ width: number; class?: string; loading?: "eager" | "lazy" }`, reused by Hero (Task 8) and Footer (Task 10).

- [ ] **Step 1: Add build assertions** — append to `tests/build.test.ts`:

```ts
describe("header", () => {
  it("renders the logo with brand-name alt text", () => {
    const logoImg = document.querySelector("header img");
    expect(logoImg?.getAttribute("alt")).toContain("Elysian");
  });

  it("has a skip link to the main content", () => {
    const skipLink = document.querySelector('a[href="#main-content"]');
    expect(skipLink).not.toBeNull();
  });

  it("links to every menu category anchor", () => {
    const navLinks = Array.from(document.querySelectorAll('nav[aria-label] a')).map((a) =>
      a.getAttribute("href"),
    );
    expect(navLinks).toEqual([
      "#caffetteria",
      "#bibite",
      "#drink-list",
      "#birre-e-liquori",
      "#wine-selection",
      "#gelati",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/build.test.ts`
Expected: FAIL — no `<header>` exists yet.

- [ ] **Step 3: Implement** `src/components/Logo.astro`

```astro
---
import { Image } from "astro:assets";
import logoSource from "../assets/logo-source.png";

interface Props {
  width: number;
  class?: string;
  loading?: "eager" | "lazy";
}

const { width, class: className, loading = "lazy" } = Astro.props;
const height = Math.round((width * logoSource.height) / logoSource.width);
---
<Image
  src={logoSource}
  alt="Elysian – Sorsi di Poesia"
  width={width}
  height={height}
  class={className}
  loading={loading}
/>
```

- [ ] **Step 4: Implement** `src/components/Header.astro`

```astro
---
import Logo from "./Logo.astro";
import { menuCategories } from "../data/menu";
---
<header class="site-header">
  <a class="skip-link" href="#main-content">Vai al contenuto</a>
  <div class="site-header__inner">
    <a class="site-header__brand" href="#" aria-label="Elysian, torna in cima">
      <Logo width={48} loading="eager" />
      <span class="site-header__brand-name">Elysian</span>
    </a>
    <nav class="site-header__nav" aria-label="Categorie menu">
      <ul>
        {menuCategories.map((category) => (
          <li>
            <a href={`#${category.id}`}>{category.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--color-cream);
    border-bottom: 1px solid var(--color-gold-soft);
  }

  .skip-link {
    position: absolute;
    left: -999px;
    top: 0;
    background: var(--color-ink);
    color: var(--color-cream);
    padding: 0.75rem 1rem;
    z-index: 100;
  }

  .skip-link:focus {
    left: 0.5rem;
    top: 0.5rem;
  }

  .site-header__inner {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    max-width: var(--content-max-width);
    margin-inline: auto;
  }

  .site-header__brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--color-ink);
    flex-shrink: 0;
  }

  .site-header__brand-name {
    font-family: var(--font-display);
    font-size: 1.1rem;
    letter-spacing: 0.02em;
  }

  .site-header__nav {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .site-header__nav::-webkit-scrollbar {
    display: none;
  }

  .site-header__nav ul {
    display: flex;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .site-header__nav a {
    display: flex;
    align-items: center;
    white-space: nowrap;
    padding: 0.5rem 0.9rem;
    min-height: 44px;
    border-radius: 999px;
    border: 1px solid var(--color-gold-soft);
    color: var(--color-ink);
    text-decoration: none;
    font-size: 0.9rem;
  }

  .site-header__nav a:hover,
  .site-header__nav a:focus-visible {
    background: var(--color-gold-soft);
  }
</style>
```

- [ ] **Step 5: Render the header** — replace `src/pages/index.astro` body with:

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <title>Elysian – Sorsi di Poesia</title>
  </head>
  <body>
    <Header />
    <main id="main-content">
      <h1>Elysian</h1>
    </main>
  </body>
</html>
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/build.test.ts`
Expected: PASS (all tests)

- [ ] **Step 7: Commit**

```bash
git add src/components/Logo.astro src/components/Header.astro src/pages/index.astro tests/build.test.ts
git commit -m "feat: add sticky header with logo and category navigation"
```

---

### Task 8: Hero section

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro` (render `Hero` inside `<main>`)
- Test: `tests/build.test.ts` (append)

**Interfaces:**
- Consumes: `Logo` component (Task 7)

- [ ] **Step 1: Add build assertions** — append to `tests/build.test.ts`:

```ts
describe("hero", () => {
  it("shows the brand name, payoff, and drink-and-poetry line", () => {
    const heroText = document.querySelector(".hero")?.textContent ?? "";
    expect(heroText).toContain("Elysian");
    expect(heroText).toContain("Sorsi di Poesia");
    expect(heroText).toContain("Drink and Poetry Café");
  });

  it("has a CTA linking to the menu", () => {
    const cta = document.querySelector('.hero a[href="#menu"]');
    expect(cta?.textContent).toContain("menù");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/build.test.ts`
Expected: FAIL — no `.hero` element yet.

- [ ] **Step 3: Implement** `src/components/Hero.astro`

```astro
---
import Logo from "./Logo.astro";
---
<section class="hero">
  <div class="hero__inner">
    <Logo width={140} loading="eager" class="hero__logo" />
    <p class="hero__eyebrow">Drink and Poetry Café</p>
    <h1 class="hero__title">Elysian</h1>
    <p class="hero__payoff">Sorsi di Poesia</p>
    <p class="hero__copy">
      Dove ogni sorso diventa un verso. Un angolo sospeso tra caffè, cocktail
      e parole, pensato per chi ama fermarsi ad assaporare l'attimo.
    </p>
    <a class="hero__cta" href="#menu">Scopri il menù</a>
  </div>
</section>

<style>
  .hero {
    padding: clamp(2.5rem, 8vw, 6rem) 1.25rem;
    text-align: center;
  }

  .hero__inner {
    max-width: 40rem;
    margin-inline: auto;
  }

  @media (prefers-reduced-motion: no-preference) {
    .hero__inner > * {
      animation: hero-fade-in 0.8s ease-out both;
    }
    .hero__eyebrow {
      animation-delay: 0.05s;
    }
    .hero__title {
      animation-delay: 0.15s;
    }
    .hero__payoff {
      animation-delay: 0.25s;
    }
    .hero__copy {
      animation-delay: 0.35s;
    }
    .hero__cta {
      animation-delay: 0.45s;
    }
  }

  @keyframes hero-fade-in {
    from {
      opacity: 0;
      transform: translateY(0.75rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .hero__logo {
    margin-inline: auto;
    margin-bottom: 1.5rem;
  }

  .hero__eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: 0.8rem;
    color: var(--color-sage);
    margin: 0 0 0.5rem;
  }

  .hero__title {
    font-size: clamp(2.75rem, 8vw, 4.5rem);
    margin: 0;
  }

  .hero__payoff {
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    color: var(--color-gold);
    margin: 0.25rem 0 1.5rem;
  }

  .hero__copy {
    font-size: 1.05rem;
    line-height: 1.7;
    margin: 0 0 2rem;
  }

  .hero__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0.85rem 2rem;
    border-radius: 999px;
    background: var(--color-ink);
    color: var(--color-cream);
    text-decoration: none;
    font-size: 1rem;
    letter-spacing: 0.02em;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .hero__cta:hover,
  .hero__cta:focus-visible {
    background: var(--color-gold);
    transform: translateY(-2px);
  }
</style>
```

- [ ] **Step 4: Render the hero** — replace `src/pages/index.astro` with:

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <title>Elysian – Sorsi di Poesia</title>
  </head>
  <body>
    <Header />
    <main id="main-content">
      <Hero />
    </main>
  </body>
</html>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/build.test.ts`
Expected: PASS (all tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro tests/build.test.ts
git commit -m "feat: add hero section with brand copy and menu CTA"
```

---

### Task 9: Menu category component and full menu rendering

**Files:**
- Create: `src/components/MenuCategory.astro`
- Modify: `src/pages/index.astro` (render all categories inside a `#menu` wrapper)
- Test: `tests/build.test.ts` (append)

**Interfaces:**
- Consumes: `MenuCategoryData` type and `menuCategories` from `src/data/menu.ts` (Task 2)

- [ ] **Step 1: Add build assertions** — append to `tests/build.test.ts`:

```ts
describe("menu", () => {
  it("renders a heading and section for every category", () => {
    for (const id of [
      "caffetteria",
      "bibite",
      "drink-list",
      "birre-e-liquori",
      "wine-selection",
      "gelati",
    ]) {
      const section = document.querySelector(`#${id}`);
      expect(section, `expected a #${id} section`).not.toBeNull();
      expect(section?.querySelector("h2")).not.toBeNull();
    }
  });

  it("renders the exact number of items transcribed from the paper menu", () => {
    const expectedCounts: Record<string, number> = {
      caffetteria: 31,
      bibite: 21,
      "drink-list": 23,
      "birre-e-liquori": 43,
      "wine-selection": 7,
      gelati: 4,
    };
    for (const [id, count] of Object.entries(expectedCounts)) {
      const section = document.querySelector(`#${id}`);
      const rows = section?.querySelectorAll(".menu-list__row") ?? [];
      expect(rows.length, `expected ${count} items in #${id}`).toBe(count);
    }
  });

  it("shows named subgroup headings for Drink List and Birre e Liquori", () => {
    const drinkList = document.querySelector("#drink-list");
    const subheadings = Array.from(drinkList?.querySelectorAll("h3") ?? []).map(
      (el) => el.textContent,
    );
    expect(subheadings).toEqual(["Spritz", "Classici", "Gin Tonic / Lemon", "Signature Tonic"]);
  });

  it("shows the gelato flavor note", () => {
    const gelati = document.querySelector("#gelati");
    expect(gelati?.textContent).toContain("Tiramisù");
  });

  it("shows a specific known price verbatim", () => {
    const caffetteria = document.querySelector("#caffetteria");
    expect(caffetteria?.textContent).toContain("Caffè espresso");
    expect(caffetteria?.textContent).toContain("1.10€");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/build.test.ts`
Expected: FAIL — no `#caffetteria` etc. sections exist yet.

- [ ] **Step 3: Implement** `src/components/MenuCategory.astro`

```astro
---
import type { MenuCategoryData } from "../data/menu";

interface Props {
  category: MenuCategoryData;
}

const { category } = Astro.props;
---
<section id={category.id} class="menu-category">
  <h2>{category.title}</h2>
  {category.subgroups.map((subgroup) => (
    <div class="menu-subgroup">
      {subgroup.title && <h3>{subgroup.title}</h3>}
      {subgroup.note && <p class="menu-subgroup__note">{subgroup.note}</p>}
      <dl class="menu-list">
        {subgroup.items.map((item) => (
          <div class="menu-list__row">
            <dt>
              {item.name}
              {item.description && <span class="menu-list__desc">{item.description}</span>}
            </dt>
            <dd>{item.price}</dd>
          </div>
        ))}
      </dl>
    </div>
  ))}
</section>

<style>
  .menu-category {
    max-width: var(--content-max-width);
    margin-inline: auto;
    padding: 3rem 1.25rem;
    scroll-margin-top: 4.5rem;
  }

  .menu-category h2 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    border-bottom: 1px solid var(--color-gold);
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .menu-subgroup + .menu-subgroup {
    margin-top: 2rem;
  }

  .menu-subgroup h3 {
    font-size: 1.25rem;
    color: var(--color-sage);
    margin-bottom: 0.75rem;
  }

  .menu-subgroup__note {
    font-style: italic;
    color: var(--color-ink);
    opacity: 0.75;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
  }

  .menu-list {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .menu-list__row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    border-bottom: 1px dotted var(--color-gold-soft);
    padding-bottom: 0.5rem;
  }

  .menu-list__row dt {
    font-weight: 600;
    margin: 0;
  }

  .menu-list__row dd {
    margin: 0;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .menu-list__desc {
    display: block;
    font-weight: 400;
    font-size: 0.9rem;
    opacity: 0.75;
  }

  @media (max-width: 30rem) {
    .menu-list__row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.15rem;
    }
  }

  @media (min-width: 48rem) {
    .menu-list {
      columns: 2;
      column-gap: 2.5rem;
    }

    .menu-list__row {
      break-inside: avoid;
    }
  }
</style>
```

- [ ] **Step 4: Render every category** — replace `src/pages/index.astro` with:

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import MenuCategory from "../components/MenuCategory.astro";
import { menuCategories } from "../data/menu";
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <title>Elysian – Sorsi di Poesia</title>
  </head>
  <body>
    <Header />
    <main id="main-content">
      <Hero />
      <div id="menu">
        {menuCategories.map((category) => (
          <MenuCategory category={category} />
        ))}
      </div>
    </main>
  </body>
</html>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/build.test.ts`
Expected: PASS (all tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/MenuCategory.astro src/pages/index.astro tests/build.test.ts
git commit -m "feat: render the full menu from the shared data source"
```

---

### Task 10: Footer

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro` (render `Footer`)
- Test: `tests/build.test.ts` (append)

**Interfaces:**
- Consumes: `Logo` component (Task 7)

- [ ] **Step 1: Add build assertion** — append to `tests/build.test.ts`:

```ts
describe("footer", () => {
  it("shows the payoff and a copyright line with the current year", () => {
    const footerText = document.querySelector("footer")?.textContent ?? "";
    expect(footerText).toContain("Sorsi di Poesia");
    expect(footerText).toContain(String(new Date().getFullYear()));
    expect(footerText).toContain("Elysian");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/build.test.ts`
Expected: FAIL — no `<footer>` exists yet.

- [ ] **Step 3: Implement** `src/components/Footer.astro`

```astro
---
import Logo from "./Logo.astro";
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <Logo width={56} />
  <p class="site-footer__payoff">Sorsi di Poesia</p>
  <p class="site-footer__copy">&copy; {year} Elysian</p>
</footer>

<style>
  .site-footer {
    text-align: center;
    padding: 3rem 1.25rem 2.5rem;
    border-top: 1px solid var(--color-gold-soft);
  }

  .site-footer__payoff {
    font-family: var(--font-display);
    font-style: italic;
    color: var(--color-gold);
    margin: 0.75rem 0 0.5rem;
  }

  .site-footer__copy {
    font-size: 0.85rem;
    opacity: 0.7;
    margin: 0;
  }
</style>
```

- [ ] **Step 4: Render the footer** — replace `src/pages/index.astro` with:

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import MenuCategory from "../components/MenuCategory.astro";
import Footer from "../components/Footer.astro";
import { menuCategories } from "../data/menu";
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <title>Elysian – Sorsi di Poesia</title>
  </head>
  <body>
    <Header />
    <main id="main-content">
      <Hero />
      <div id="menu">
        {menuCategories.map((category) => (
          <MenuCategory category={category} />
        ))}
      </div>
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/build.test.ts`
Expected: PASS (all tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro tests/build.test.ts
git commit -m "feat: add footer"
```

---

### Task 11: SEO head — meta tags, canonical, Open Graph, JSON-LD

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` (use the layout instead of a hand-rolled `<html>` shell)
- Test: `tests/build.test.ts` (append)

**Interfaces:**
- Consumes: `buildMenuJsonLd` from `src/lib/menuJsonLd.ts` (Task 3), `menuCategories` from `src/data/menu.ts` (Task 2)
- Produces: `BaseLayout` component with props `{ title: string; description: string }`, wrapping a `<slot />`.

- [ ] **Step 1: Add build assertions** — append to `tests/build.test.ts`:

```ts
describe("SEO head", () => {
  it("has a meta description and canonical link", () => {
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toMatch(
      /Elysian/,
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://www.elysiamsorsidipoesia.it/",
    );
  });

  it("has Open Graph and Twitter card tags", () => {
    expect(document.querySelector('meta[property="og:title"]')).not.toBeNull();
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute("content")).toMatch(
      /og-image\.png$/,
    );
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute("content")).toBe(
      "summary_large_image",
    );
  });

  it("has favicon links", () => {
    expect(document.querySelector('link[rel="icon"]')).not.toBeNull();
    expect(document.querySelector('link[rel="apple-touch-icon"]')).not.toBeNull();
  });

  it("embeds valid schema.org Menu JSON-LD matching the rendered menu", () => {
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const jsonld = JSON.parse(script!.textContent ?? "{}");
    expect(jsonld["@type"]).toBe("Menu");
    expect(jsonld.hasMenuSection).toHaveLength(6);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/build.test.ts`
Expected: FAIL — no meta description, canonical, OG tags, or JSON-LD script exist yet.

- [ ] **Step 3: Implement** `src/layouts/BaseLayout.astro`

```astro
---
import { menuCategories } from "../data/menu";
import { buildMenuJsonLd } from "../lib/menuJsonLd";
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const canonicalUrl = new URL(Astro.url.pathname, Astro.site);
const ogImageUrl = new URL("/og-image.png", Astro.site);
const jsonLd = buildMenuJsonLd(menuCategories);
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImageUrl} />
    <meta property="og:url" content={canonicalUrl} />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Use the layout** — replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import MenuCategory from "../components/MenuCategory.astro";
import Footer from "../components/Footer.astro";
import { menuCategories } from "../data/menu";
---
<BaseLayout
  title="Elysian – Sorsi di Poesia | Drink and Poetry Café"
  description="Il menù di Elysian – Sorsi di Poesia: caffetteria, bibite, drink list, birre e liquori, vini e gelati."
>
  <Header />
  <main id="main-content">
    <Hero />
    <div id="menu">
      {menuCategories.map((category) => (
        <MenuCategory category={category} />
      ))}
    </div>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/build.test.ts`
Expected: PASS (all tests)

- [ ] **Step 6: Run the entire test suite**

Run: `npm test`
Expected: PASS — every test file (`parsePrice`, `menuJsonLd`, `brandAssets`, `fonts`, `build`) green.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro tests/build.test.ts
git commit -m "feat: wire up SEO meta tags, Open Graph, and Menu JSON-LD"
```

---

### Task 12: Manual responsive, accessibility, and content verification

This task has no new automated tests — jsdom-based accessibility checkers (e.g. axe-core without a real layout engine) produce unreliable results for layout- and contrast-dependent rules, so this verification is done in a real browser instead.

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (leave running)

- [ ] **Step 2: Visually check every required breakpoint**

Open the dev server URL in a browser and check each width in the responsive design mode (320, 375, 390, 430, 768, 1024, 1280, 1440, 1920px) for:
- No horizontal scrollbar/overflow
- No clipped or overlapping text
- The header's category pill-nav scrolls horizontally without wrapping oddly
- All tap targets (nav pills, CTA button) look at least 44px tall

- [ ] **Step 3: Check `prefers-reduced-motion`**

Enable "reduce motion" in the OS/browser, reload the page, and confirm the hero content appears immediately with no fade/slide animation, and clicking a nav link jumps instantly instead of smooth-scrolling.

- [ ] **Step 4: Run a Lighthouse audit against the production build**

Run: `npm run build && npm run preview`
Open the preview URL, run a Lighthouse audit (Performance, Accessibility, Best Practices, SEO) in the browser's DevTools, and note the scores. Investigate and fix any flagged issue whose fix doesn't conflict with the constraints in this plan (e.g. missing `alt` text, insufficient contrast — do not add features like analytics or contact forms just because Lighthouse suggests unrelated things).

- [ ] **Step 5: Cross-check every price against the spec**

Open `docs/superpowers/specs/2026-09-17-elysian-landing-page-design.md` side-by-side with the rendered page and confirm every item name, description, and price in the "Content inventory" section appears on the page exactly as written. This is the final defense against a transcription slip.

- [ ] **Step 6: Stop the dev/preview server**

No commit for this task — it's verification only. If Step 4 or Step 5 turns up a real issue, fix it as a small follow-up commit (e.g. `git commit -m "fix: correct <specific item> price to match the paper menu"`).
