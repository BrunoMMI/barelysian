import { beforeAll, describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
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

describe("design tokens", () => {
  it("ships a stylesheet defining the core color tokens", () => {
    const cssFiles = readdirSync("dist/_astro").filter((f) => f.endsWith(".css"));
    const allCss = cssFiles.map((f) => readFileSync(`dist/_astro/${f}`, "utf-8")).join("\n");
    expect(allCss).toContain("--color-ink");
    expect(allCss).toContain("--color-cream");
    expect(allCss).toContain("prefers-reduced-motion");
  });
});

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
      "#spumanti-e-champagne",
      "#gelati",
      "#stuzzicheria-e-aperitivi",
    ]);
  });
});

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

describe("aperitivo note", () => {
  it("explains what's included with soft drinks/beers vs alcoholic drinks", () => {
    const note = document.querySelector(".aperitivo-note")?.textContent ?? "";
    expect(note).toContain("noccioline");
    expect(note).toContain("patatine");
    expect(note).toContain("rustici");
    expect(note).toContain("olive");
    expect(note).toContain("tacos");
  });
});

describe("menu", () => {
  it("renders a heading and section for every category", () => {
    for (const id of [
      "caffetteria",
      "bibite",
      "drink-list",
      "birre-e-liquori",
      "wine-selection",
      "spumanti-e-champagne",
      "gelati",
      "stuzzicheria-e-aperitivi",
    ]) {
      const section = document.querySelector(`#${id}`);
      expect(section, `expected a #${id} section`).not.toBeNull();
      expect(section?.querySelector("h2")).not.toBeNull();
    }
  });

  it("renders the exact number of items transcribed from the paper menu", () => {
    const expectedCounts: Record<string, number> = {
      caffetteria: 36,
      bibite: 23,
      "drink-list": 28,
      "birre-e-liquori": 47,
      "wine-selection": 11,
      "spumanti-e-champagne": 3,
      gelati: 5,
      "stuzzicheria-e-aperitivi": 3,
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

  it("shows Bianchi/Rossi/Rosati subgroup headings for Wine Selection", () => {
    const wineSelection = document.querySelector("#wine-selection");
    const subheadings = Array.from(wineSelection?.querySelectorAll("h3") ?? []).map(
      (el) => el.textContent,
    );
    expect(subheadings).toEqual(["Vini Bianchi", "Vini Rossi", "Vini Rosati"]);
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

describe("footer", () => {
  it("shows the payoff and a copyright line with the current year", () => {
    const footerText = document.querySelector("footer")?.textContent ?? "";
    expect(footerText).toContain("Sorsi di Poesia");
    expect(footerText).toContain(String(new Date().getFullYear()));
    expect(footerText).toContain("Elysian");
  });

  it("notes that the menu is continuously updated", () => {
    const footerText = document.querySelector("footer")?.textContent ?? "";
    expect(footerText).toContain("continuo aggiornamento");
  });
});

describe("SEO head", () => {
  it("has a meta description and canonical link", () => {
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toMatch(
      /Elysian/,
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://caffetteriaelysian.shop/",
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
    expect(jsonld.hasMenuSection).toHaveLength(8);
  });
});
