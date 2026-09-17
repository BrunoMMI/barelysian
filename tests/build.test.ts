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
