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
