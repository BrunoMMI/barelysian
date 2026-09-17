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
