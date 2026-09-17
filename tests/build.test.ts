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
      "#gelati",
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
