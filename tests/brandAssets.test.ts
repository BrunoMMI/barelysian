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
