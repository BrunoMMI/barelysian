# Elysian – Sorsi di Poesia: landing page design

Date: 2026-09-17
Status: approved for implementation

## Context

Bar/caffetteria "Elysian – Sorsi di Poesia" (logo also carries "Drink and Poetry
Café") needs a landing page whose primary job is: someone scans a QR code at a
table and reads the menu on their phone, fast. Domain: `www.elysiamsorsidipoesia.it`.

Source material lives in `Contenuti/`:
- `Logo Elysian.pdf` — vector wordmark + rose/glass emblem, black/navy line art.
- `Foto Menù cartaceo/Foto 1.jpg`–`Foto 11.jpg` — phone photos of the physical
  menu booklet (11 pages: 5 section dividers + their content pages, plus one
  standalone wine-list insert in a different print style).

### Decisions already made with the client (do not re-litigate)

1. **Brand name**: use "Elysian" everywhere (logo/menu spelling), not "Elysia"
   from the original brief text — the brief's spelling doesn't match any
   actual asset.
2. **Contact info**: no address/phone/hours/socials exist anywhere in the
   source material. Do not invent any. Omit a contact section entirely; no
   `LocalBusiness` structured data (would be incomplete/misleading without an
   address).
3. **Wine Selection pricing**: the calice/bottiglia pairing on Foto 11 is not
   reliably legible (rotated photo, small icons). Show **one price per wine
   only** (the clearly legible number), with no glass/bottle distinction
   claimed.
4. **Page structure**: single-page site (`index.astro`), anchor navigation to
   menu categories. No separate `/menu` route.
5. **Menu photos are not used as website imagery** — they're phone snapshots
   of a physical booklet (plastic-sleeve glare, black tablecloth backdrop),
   not presentable. Only the logo is used as a visual asset. The recurring
   visual language *of the photographed pages themselves* (cream paper, navy
   serif type, thin gold rules, botanical illustrations, blue-and-white
   azulejo tile corners) is what the site's design system is built from —
   observed from the material, not invented.

## Content inventory (source of truth for `src/data/menu.ts`)

Transcribed directly from the menu photos. One deliberate correction: "Japanase
Blossom Tonic" → "Japanese Blossom Tonic" (obvious print typo of a common
English word, not an invented fact). Everything else is verbatim, including
brand names as printed (e.g. "Tanquerai", "Bickens" — printed spellings kept
as-is since they may be intentional supplier-list shorthand and correcting
them risks misidentifying the product).

### Caffetteria
Caffè espresso 1.10€ · Caffè corretto 1.30€ · Caffè macchiato 1.20€ · Caffè
macchiato (senza lattosio o soia) 1.30€ · Crema caffè 2.50€ · Caffè americano
2.00€ · Caffè alla nocciola 1.30€ · Caffè decaffeinato 1.10€ · Caffè deca
macchiato 1.20€ · Orzo 1.10€ · Orzo macchiato 1.20€ · Orzo doppio 2.40€ ·
Ginseng amaro 1.50€ · Ginseng doppio 3.00€ · Ginseng dolce 1.50€ · Ginseng
rosso 1.50€ · Ginseng alla nocciola 1.50€ · Ginseng miele e limone 1.50€ ·
Cappuccino 1.70€ · Cappuccino deca 1.80€ · Cappuccino senza lattosio 1.80€ ·
Cappuccino ginseng 2.00€ · Cappuccino d'orzo 2.00€ · Cappuccino nutella 2.20€
· Cornetti Tre Marie 1.30€ (Cioccolato, crema, pistacchio, frutti di bosco,
albicocca, integrale al miele, vuoto, vegano ribes e melograno) · Cornetto
Nutella 1.50€ · Succhi di frutta 2.00€/2.50€ (ACE, albicocca, pesca, arancia
di Sicilia, arancia rossa, pera, banana, fragola, melograno, mirtillo, mela,
ananas, ananas e cocco, pesca e mango) · Spremuta d'arancia 2.50€ · Tè caldo
2.50€ · Cioccolata calda 2.50€ · Granita vari gusti 2.50€

### Bibite
Crodino classico XL 2.50€ · Crodino rosso XL 2.50€ · Schweppes (arancia,
limone, tonica) 2.50€ · Chinotto 2.50€ · Bitter (bianco, rosso) 2.00€ ·
Cocktail San Pellegrino (bianco, rosso) 2.00€ · Tassoni (classica, zero)
2.50€ · Tassoni pompelmo rosa 2.50€ · Coca-Cola lattina 2.00€ · Coca-Cola
Zero lattina 2.00€ · Pepsi lattina (zero, lime, limone) 2.00€ · Sprite
lattina 2.00€ · Coca-Cola bottiglia PET (classica, zero) 2.50€ · Coca-Cola
vetro (classica, zero) 3.00€ · Estathè lattina (pesca, limone) 2.00€ ·
Estathè bottiglia (pesca, limone, zero) 2.50€ · Estathè vetro (pesca, limone)
3.00€ · Estathè deteinato (pesca, limone) 2.00€ · Estathè brick 1.20€ ·
Redbull (vari gusti) 3.00€ · Aloe Vera (Classica, melograno, ananas) 2.50€

### Drink List
**Spritz** — 5€: Aperol, Campari, Hugo, Cynar, Limoncello, Sarti Rosa,
Select, Rabarbaro.
**Classici** — 7€: Negroni, Mi-To, Negroni sbagliato (base Gin Mare),
Americano, Moscow Mule.
**Gin tonic / lemon**: Gin Mare 8€ · Bulldog 8€ · Malfy 8€ · Bombay 7€ ·
Tanquerai 7€ · Bickens 7€.
**Signature Tonic** — 10€: Velvet Berry Tonic (Base Brockmans Gin) · Garden
Royal Tonic (Base Hendrick's Gin) · Riviera Prestige Tonic (Base Portofino
Gin) · Japanese Blossom Tonic (Base Etsu Gin).

### Birre e Liquori
**Birre in bottiglia**: Ceres Strong Ale 3.50€ · Nastro Azzurro 2.00€ ·
Heineken 2.50€ · Peroni Limone 2.00€ · Poretti IPA 3.00€ · Poretti senza
Glutine 3.00€ · Forst 3.00€ · Corona 3.00€ · Beck's 2.50€ · Bud 2.50€ ·
Ichnusa 3.00€ · Tennent's 4.00€ · Tuborg 2.00€ · Tuborg Limone 2.00€ ·
Stella Artois 3.00€.
**Alla spina**: 0.3L 3.00€ · 0.5L 5.00€.
**Liquori** (3.00€ unless noted): Amaro del Capo, Averna, Baileys, Branca
Menta, Cynar, Cognac, Fernet, Grappa Barrique, Grappa Bianca, Orzo
macchiato, Jack Daniel's, Jefferson (3.50€), Jägermeister, Limoncello,
Martini, Montenegro, Petrus, Punch, Rum, Rum Barceló, Sambuca, Strega,
Tequila, Unicum, Vecchia Romagna, Vodka.

> Note: "Orzo macchiato" appears twice in the source material — once in
> Caffetteria at 1.20€, once in this Liquori list at 3.00€. Both are
> transcribed verbatim from their respective photos; this is a print
> oddity in the original menu, not a transcription error, and both entries
> are kept as-is rather than "corrected."

### Gelati
Cono (2 gusti) 2.50€ · Coppa (2 gusti) 2.50€ · Cono (3 gusti) 3.50€ · Coppa
(3 gusti) 3.50€.
Gusti: Limone, Fragola, Panna, Nocciola, Cioccolato fondente, Pistacchio,
Caffè, Stracciatella, Fiordilatte, Tiramisù.

### Wine Selection
(single price per wine — see decision #3 above)
- Traminer Aromatico — I Magredi, Friuli-Venezia Giulia, 100% Traminer
  Aromatico — 18€
- Pallagrè Bianco — Quercete, Campania, 100% Pallagrello Bianco — 18€
- Bourgogne AOC Chardonnay — Reine Pédauque, Francia, 100% Chardonnay — 22€
- Bullorosso Campania IGP — Vitialte, Campania, 70% Aglianico / 30%
  Montepulciano — 20€
- Bourgogne Pinot Noir AOP — Reine Pédauque, Francia, 100% Pinot Noir — 22€
- Gelso Nero Puglia IGT — Podere 29, Puglia, 100% Nero di Troia — 20€
- Petali IGT Toscano Rosato — Cantalici, Toscana, 100% Sangiovese — 20€

## Visual design system

- **Background**: warm ivory/cream (`#F7F3EA`-ish), matching the menu paper.
- **Ink**: deep navy (`#1E2E3F`-ish) for all text, matching the printed menu
  and the logo's dark linework.
- **Accent gold**: muted brass (`#B08D57`-ish) for thin rule lines and small
  dividers, matching the menu's decorative rules.
- **Accent sage**: soft olive green, used sparingly for botanical flourishes.
- **Accent tile-blue**: the azulejo blue from the menu's tile corners, used
  as a rare, small decorative accent (e.g. a section divider motif) — never
  as a large fill, to keep the palette calm.
- **Typography**: one serif family (Cormorant Garamond or Playfair Display,
  weights 400/600 only) for the logo-adjacent headings/payoff; system font
  stack (`-apple-system, "Segoe UI", Roboto, sans-serif`) for all body copy
  and menu item text — no second webfont, to keep the page light and menu
  text crisply legible at small sizes on a phone.
- **Logo**: extracted from the PDF as an inline SVG (crisp, tiny, themeable
  via `currentColor` where possible). PNG fallback only if vector extraction
  turns out lossy.
- **Motion**: microanimations limited to opacity/transform fades on scroll
  into view and discreet hover states on links/buttons; all wrapped in
  `@media (prefers-reduced-motion: no-preference)` so reduced-motion users
  get an instant, static page.

## Page structure (single page, `src/pages/index.astro`)

1. **Header** — sticky, small inline-SVG logo mark + "Elysian" wordmark on
   the left; a horizontally-scrollable pill nav (no hamburger) linking to
   each menu category anchor. Works on a 320px screen without truncation.
2. **Hero** — logo/emblem, "Elysian", "Sorsi di Poesia" payoff, "Drink and
   Poetry Café" line (from the logo), one short atmospheric sentence of
   brand voice copy (no invented facts about the venue), primary CTA button
   scrolling to `#menu`.
3. **Menu** — one `<section id="...">` per category in this order:
   Caffetteria, Bibite, Drink List (with its four subgroups), Birre e
   Liquori (with its three subgroups), Wine Selection, Gelati. Each item:
   name, optional description/ingredients (only where the paper menu had
   one), price. Prices right-aligned with a dotted leader on wider screens,
   stacked naturally on narrow screens (no `....` filler characters — those
   were a paper-menu affordance, not something to replicate in HTML).
4. **Footer** — small logo mark, "Sorsi di Poesia" payoff repeated, `©
   [current year] Elysian`. No contact info.

## SEO / GEO / accessibility

- Semantic HTML throughout: `<nav aria-label="Categorie menu">`, `<main>`,
  one `<section>` per category with a real `<h2>`, items marked up as
  `<dl>`/`<dt>`/`<dd>` (name+desc / price) or an equivalent list structure —
  never `<div>` soup.
- `lang="it"`, skip-to-content link, visible `:focus-visible` states, body
  text and price contrast checked against AA on the cream background.
- `<title>` and meta description built around "Elysian – Sorsi di Poesia",
  Open Graph + Twitter card tags with an OG image generated from the logo.
- JSON-LD `schema.org/Menu` (with nested `MenuSection`/`MenuItem`) generated
  from the exact same `src/data/menu.ts` array that renders the HTML — one
  data source, so structured data can never drift from the visible page.
- No `LocalBusiness` schema (see decision #2).
- `astro-sitemap` integration, `robots.txt` allowing all, canonical URL set
  to `https://www.elysiamsorsidipoesia.it/`.

## Responsive strategy

Mobile-first CSS, checked at 320/375/390/430/768/1024/1280/1440/1920px per
the brief. Fluid type via `clamp()`, a single-column menu layout up to
tablet width, two-column category grid from ~768px up where it doesn't hurt
readability. No horizontal scroll anywhere except the intentional pill-nav
strip. Tap targets ≥44px.

## Architecture / files

```
src/
  data/menu.ts          # typed menu data — single source of truth
  components/
    Header.astro
    Hero.astro
    MenuCategory.astro  # reusable per-category renderer
    Footer.astro
  styles/global.css      # design tokens + base styles
  pages/index.astro       # assembles the above
public/
  logo.svg
  favicon.svg
  og-image.png
astro.config.mjs          # site: https://www.elysiamsorsidipoesia.it, sitemap integration
```

Zero client-side JavaScript by default (native CSS `scroll-behavior: smooth`
for anchor nav, disabled under reduced-motion). Static Astro output
(`output: 'static'`).

## Testing / verification plan

- `astro build` succeeds with no errors/warnings.
- Manual check of every menu price against this spec's transcription (which
  was itself checked against the source photos) — no invented items.
- Responsive check at each breakpoint listed above via browser devtools,
  confirming no horizontal overflow, no clipped text, no overlapping
  elements.
- Lighthouse pass (performance/SEO/accessibility) on the built output.
- `prefers-reduced-motion` verified to fully disable animation and smooth
  scroll.
